import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { MasterDataFormComponent, MasterDataFormSubmitEvent } from './master-data-form.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_MASTER_DATA_PAGE_SIZE,
  EMPTY_MASTER_DATA_PAGE,
  MASTER_DATA_CATEGORIES,
  MasterDataCategory,
  MasterDataCategoryId,
  MasterDataDeleteMode,
  MasterDataFormConfig,
  MasterDataFormMode,
  MasterDataMutationRequest,
  MasterDataPage,
  MasterDataQuery,
  MasterDataRowActionEvent,
  MasterDataResource,
  MasterDataRow
} from './master-data.models';
import { MasterDataService } from './master-data.service';

@Component({
  selector: 'app-master-data-admin',
  imports: [AppButtonComponent, DataTableComponent, MasterDataFormComponent],
  templateUrl: './master-data-admin.component.html',
  styleUrl: './master-data-admin.component.scss'
})
export class MasterDataAdminComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly masterDataService = inject(MasterDataService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadSelectedResource();
    });

  protected readonly categories = MASTER_DATA_CATEGORIES;
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly selectedCategoryId = signal<MasterDataCategoryId>(MASTER_DATA_CATEGORIES[0].id);
  protected readonly selectedResourceId = signal(MASTER_DATA_CATEGORIES[0].resources[0].id);
  protected readonly pageData = signal<MasterDataPage<MasterDataRow>>(EMPTY_MASTER_DATA_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_MASTER_DATA_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly lastTriggeredRowAction = signal<MasterDataRowActionEvent | null>(null);
  protected readonly lastFormSubmission = signal<MasterDataFormSubmitEvent | null>(null);
  protected readonly formMode = signal<MasterDataFormMode | null>(null);
  protected readonly formValue = signal<MasterDataRow | null>(null);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly pendingDeleteRow = signal<MasterDataRow | null>(null);
  protected readonly pendingDeleteMode = signal<MasterDataDeleteMode | null>(null);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly formConfig = computed<MasterDataFormConfig | null>(() => this.selectedResource().form ?? null);
  protected readonly formFields = computed(() => this.formConfig()?.fields ?? []);
  protected readonly openFormMode = computed<MasterDataFormMode>(() => this.formMode() ?? 'view');
  protected readonly supportsCreate = computed(
    () => this.formConfig()?.modes.includes('create') === true
  );
  protected readonly canCreate = computed(
    () => this.supportsCreate() && this.modulePermissions().canCreate
  );
  protected readonly isFormOpen = computed(() => this.formMode() !== null && this.formConfig() !== null);
  protected readonly isDeleteConfirmOpen = computed(
    () => this.pendingDeleteRow() !== null && this.pendingDeleteMode() !== null
  );
  protected readonly deleteTargetLabel = computed(() => this.describeRow(this.pendingDeleteRow()));
  protected readonly isDeletePhysical = computed(() => this.pendingDeleteMode() === 'physical');
  protected readonly deleteConfirmTitleKey = computed(
    () => this.isDeletePhysical() ? 'masterData.deletePhysical.confirmTitle' : 'masterData.delete.confirmTitle'
  );
  protected readonly deleteConfirmMessageKey = computed(
    () => this.isDeletePhysical() ? 'masterData.deletePhysical.confirmMessage' : 'masterData.delete.confirmMessage'
  );
  protected readonly deleteConfirmActionKey = computed(
    () => this.isDeletePhysical() ? 'masterData.deletePhysical.confirmAction' : 'masterData.delete.confirmAction'
  );
  protected readonly deleteProcessingMessageKey = computed(
    () => this.isDeletePhysical() ? 'masterData.deletePhysical.processing' : 'masterData.delete.processing'
  );
  protected readonly selectedCategory = computed(
    () => this.categories.find((category) => category.id === this.selectedCategoryId()) ?? this.categories[0]
  );
  protected readonly selectedResource = computed(
    () =>
      this.selectedCategory().resources.find((resource) => resource.id === this.selectedResourceId()) ??
      this.selectedCategory().resources[0]
  );
  protected readonly rowActions = computed(
    () => (this.selectedResource().rowActions ?? []).map((action) => this.decorateRowAction(action))
  );
  protected readonly tableEmptyMessageKey = computed<I18nKey>(
    () => this.appliedSearch() ? 'dataTable.noResults' : 'dataTable.empty'
  );

  constructor() {
    this.loadPermissionSummary();
    this.loadSelectedResource();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateCategory(event: Event): void {
    const nextCategoryId = (event.target as HTMLSelectElement).value as MasterDataCategoryId;
    const nextCategory = this.categories.find((category) => category.id === nextCategoryId);
    if (!nextCategory) {
      return;
    }

    this.selectedCategoryId.set(nextCategory.id);
    this.selectedResourceId.set(nextCategory.resources[0].id);
    this.closeForm();
    this.closeDeleteConfirm();
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateResource(event: Event): void {
    this.selectedResourceId.set((event.target as HTMLSelectElement).value);
    this.closeForm();
    this.closeDeleteConfirm();
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected refresh(): void {
    this.loadSelectedResource();
  }

  protected openCreateForm(): void {
    if (!this.canCreate()) {
      return;
    }

    this.openForm('create', null);
  }

  protected handleRowAction(event: MasterDataRowActionEvent): void {
    if (!this.isActionAllowed(event.action.id)) {
      return;
    }

    this.lastTriggeredRowAction.set(event);

    if (event.action.id === 'edit') {
      this.openForm('edit', event.row);
    }

    if (event.action.id === 'view') {
      this.openForm('view', event.row);
    }

    if (event.action.id === 'deletePhysical') {
      this.openDeleteConfirm('physical', event.row);
    }

    if (event.action.id === 'deactivate') {
      this.openDeleteConfirm('deactivate', event.row);
    }
  }

  protected handleFormSave(event: MasterDataFormSubmitEvent): void {
    this.lastFormSubmission.set(event);
    const resource = this.selectedResource();
    const formValue = event.value;
    const recordId = typeof this.formValue()?.['id'] === 'string' ? this.formValue()?.['id'] as string : null;

    if (event.mode === 'edit' && !recordId) {
      this.notificationService.error(this.i18n.t('masterData.form.error.generic'), {
        titleKey: 'alert.title.danger',
        dismissible: true
      });
      return;
    }

    this.saving.set(true);
    this.saveSubscription?.unsubscribe();
    this.saveSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          const payload = this.buildMutationPayload(
            formValue,
            typeof this.formValue()?.['tenantId'] === 'string' ? this.formValue()?.['tenantId'] as string : user.tenantId
          );
          return event.mode === 'create'
            ? this.masterDataService.createRow(resource, payload)
            : this.masterDataService.updateRow(resource, recordId!, payload);
        }),
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: () => {
          if (event.mode === 'create') {
            this.pageIndex.set(0);
          }
          this.notificationService.success(
            this.i18n.t(event.mode === 'create'
              ? 'masterData.form.feedback.createSuccess'
              : 'masterData.form.feedback.updateSuccess'),
            { titleKey: 'alert.title.success' }
          );
          this.closeForm();
          this.loadSelectedResource();
        },
        error: (error) => {
          this.notificationService.error(this.resolveSaveError(error), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected handleFormCancel(): void {
    this.closeForm();
  }

  protected confirmDelete(): void {
    const row = this.pendingDeleteRow();
    const rowId = typeof row?.['id'] === 'string' ? row['id'] as string : null;
    const mode = this.pendingDeleteMode();

    if (!rowId || !mode) {
      this.notificationService.error(this.i18n.t('masterData.delete.error.generic'), {
        titleKey: 'alert.title.danger',
        dismissible: true
      });
      return;
    }

    this.deleting.set(true);
    this.deleteSubscription?.unsubscribe();
    const deletion$ = mode === 'physical'
      ? this.masterDataService.deletePhysicalRow(this.selectedResource(), rowId)
      : this.masterDataService.deleteRow(this.selectedResource(), rowId);

    this.deleteSubscription = deletion$
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          if (this.rows().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => Math.max(0, page - 1));
          }

          this.notificationService.success(
            mode === 'physical'
              ? this.i18n.t('masterData.deletePhysical.feedback.success')
              : this.i18n.t('masterData.delete.feedback.success'),
            { titleKey: 'alert.title.success' }
          );
          this.closeDeleteConfirm();
          this.loadSelectedResource();
        },
        error: (error) => {
          this.notificationService.error(this.resolveDeleteError(error, mode), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected closeForm(): void {
    this.formMode.set(null);
    this.formValue.set(null);
  }

  protected closeDeleteConfirm(): void {
    this.pendingDeleteRow.set(null);
    this.pendingDeleteMode.set(null);
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadSelectedResource();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadSelectedResource();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadSelectedResource();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  private loadSelectedResource(): void {
    const resource = this.selectedResource();
    const query = this.buildQuery();

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.masterDataService.fetchRows(resource, query)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private loadPermissionSummary(): void {
    this.authService.loadAuthenticatedUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'master-data')),
        error: () => this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY)
      });
  }

  private buildQuery(): MasterDataQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): MasterDataPage<MasterDataRow> {
    return {
      ...EMPTY_MASTER_DATA_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private openForm(mode: MasterDataFormMode, row: MasterDataRow | null): void {
    const config = this.formConfig();
    if (!config || !config.modes.includes(mode)) {
      return;
    }

    this.closeDeleteConfirm();
    this.formMode.set(mode);
    this.formValue.set(row);
  }

  private openDeleteConfirm(mode: MasterDataDeleteMode, row: MasterDataRow): void {
    this.closeForm();
    this.pendingDeleteMode.set(mode);
    this.pendingDeleteRow.set(row);
  }

  private buildMutationPayload(formValue: Record<string, unknown>, tenantId: string): MasterDataMutationRequest {
    return {
      tenantId,
      code: String(formValue['code'] ?? '').trim(),
      name: String(formValue['name'] ?? '').trim(),
      active: formValue['active'] === undefined ? true : Boolean(formValue['active'])
    };
  }

  private resolveSaveError(error: unknown): string {
    const extractedMessage = this.extractApiMessage(error);
    if (extractedMessage) {
      return extractedMessage;
    }

    return this.i18n.t('masterData.form.error.generic');
  }

  private resolveDeleteError(error: unknown, mode: MasterDataDeleteMode): string {
    const extractedMessage = this.extractApiMessage(error);
    if (extractedMessage) {
      return extractedMessage;
    }

    const status = error instanceof HttpErrorResponse
      ? error.status
      : Number((error as { status?: unknown })?.status ?? 0);

    const keyPrefix = mode === 'physical' ? 'masterData.deletePhysical.error.' : 'masterData.delete.error.';

    switch (status) {
      case 400:
        return this.i18n.t(`${keyPrefix}badRequest` as const);
      case 401:
        return this.i18n.t(`${keyPrefix}unauthorized` as const);
      case 403:
        return this.i18n.t(`${keyPrefix}forbidden` as const);
      case 404:
        return this.i18n.t(`${keyPrefix}notFound` as const);
      case 409:
        return this.i18n.t(`${keyPrefix}conflict` as const);
      case 500:
        return this.i18n.t(`${keyPrefix}server` as const);
      default:
        return this.i18n.t(mode === 'physical'
          ? 'masterData.deletePhysical.error.generic'
          : 'masterData.delete.error.generic'
        );
    }
  }

  private extractApiMessage(error: unknown): string | null {
    const response = error instanceof HttpErrorResponse
      ? error
      : (error as { error?: { message?: unknown; validationErrors?: unknown } });
    const validationErrors = response.error?.validationErrors;
    if (validationErrors && typeof validationErrors === 'object') {
      const messages = Object.values(validationErrors as Record<string, unknown>)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    const apiMessage = response.error?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    return null;
  }

  private decorateRowAction(action: MasterDataRowActionEvent['action']) {
    const baseDisabled = action.disabled;

    return {
      ...action,
      disabled: (row: MasterDataRow) => {
        if (!this.isActionAllowed(action.id)) {
          return true;
        }

        const disabledByAction = typeof baseDisabled === 'function'
          ? baseDisabled(row)
          : baseDisabled === true;

        if (disabledByAction) {
          return true;
        }

        return this.deleting();
      }
    };
  }

  private isActionAllowed(actionId: string): boolean {
    const permissions = this.modulePermissions();

    switch (actionId) {
      case 'view':
        return permissions.canView;
      case 'edit':
        return permissions.canUpdate;
      case 'deactivate':
      case 'deletePhysical':
        return permissions.canDelete;
      default:
        return true;
    }
  }

  private describeRow(row: MasterDataRow | null): string {
    if (!row) {
      return '';
    }

    const name = row['name'];
    if (typeof name === 'string' && name.trim().length > 0) {
      return name;
    }

    const code = row['code'];
    if (typeof code === 'string' && code.trim().length > 0) {
      return code;
    }

    const id = row['id'];
    return typeof id === 'string' ? id : '';
  }
}
