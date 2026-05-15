import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { LookupService } from '../../shared/lookup/lookup.service';
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
  MasterDataFormField,
  MasterDataFormMode,
  MasterDataColumn,
  MasterDataMutationRequest,
  MasterDataPage,
  MasterDataQuery,
  MasterDataRowActionEvent,
  MasterDataResource,
  MasterDataRow
} from './master-data.models';
import { MasterDataService } from './master-data.service';
import { LookupOption } from '../../shared/lookup/lookup.models';

@Component({
  selector: 'app-master-data-admin',
  imports: [AppButtonComponent, DataTableComponent, LookupSelectComponent, MasterDataFormComponent],
  templateUrl: './master-data-admin.component.html',
  styleUrl: './master-data-admin.component.scss'
})
export class MasterDataAdminComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly masterDataService = inject(MasterDataService);
  private readonly lookupService = inject(LookupService);
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
  protected readonly authenticatedUser = signal<{
    readonly id: string;
    readonly tenantId: string;
    readonly email: string;
    readonly userType: string;
    readonly permissions?: readonly string[];
  } | null>(null);
  protected readonly countryFilterId = signal('');
  protected readonly regionFilterId = signal('');
  protected readonly lastTriggeredRowAction = signal<MasterDataRowActionEvent | null>(null);
  protected readonly lastFormSubmission = signal<MasterDataFormSubmitEvent | null>(null);
  protected readonly formMode = signal<MasterDataFormMode | null>(null);
  protected readonly formValue = signal<MasterDataRow | null>(null);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly formConfig = computed<MasterDataFormConfig | null>(() => this.selectedResource().form ?? null);
  protected readonly formFields = computed(() =>
    this.decorateFormFields(this.formConfig()?.fields ?? [])
  );
  protected readonly visibleColumns = computed<readonly MasterDataColumn[]>(() =>
    this.selectedResource().columns.filter((column) => !this.isTechnicalColumn(column.key))
  );
  protected readonly openFormMode = computed<MasterDataFormMode>(() => this.formMode() ?? 'view');
  protected readonly supportsCreate = computed(
    () => this.formConfig()?.modes.includes('create') === true
  );
  protected readonly canCreate = computed(
    () => this.supportsCreate() && this.modulePermissions().canCreate
  );
  protected readonly isFormOpen = computed(() => this.formMode() !== null && this.formConfig() !== null);
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
  protected readonly showsCountryFilter = computed(
    () => this.selectedResource().id === 'regions' || this.selectedResource().id === 'areas'
  );
  protected readonly showsRegionFilter = computed(
    () => this.selectedResource().id === 'areas'
  );

  constructor() {
    this.loadAuthenticatedUserContext();
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
    this.resetGeoFilters();
    this.closeForm();
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateResource(event: Event): void {
    this.selectedResourceId.set((event.target as HTMLSelectElement).value);
    this.resetGeoFilters();
    this.closeForm();
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

  protected updateCountryFilter(value: string): void {
    const nextValue = value.trim();
    const countryChanged = this.countryFilterId() !== nextValue;
    this.countryFilterId.set(nextValue);
    if (countryChanged) {
      this.regionFilterId.set('');
    }
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateRegionFilter(value: string): void {
    this.regionFilterId.set(value.trim());
    this.pageIndex.set(0);
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
      this.executeDeleteAction('physical', event.row);
    }

    if (event.action.id === 'deactivate') {
      this.executeDeleteAction('deactivate', event.row);
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
            resource,
            formValue,
            this.resolveTenantIdForMutation(user.tenantId)
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

  protected closeForm(): void {
    this.formMode.set(null);
    this.formValue.set(null);
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

  private loadAuthenticatedUserContext(): void {
    this.authService.loadAuthenticatedUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.authenticatedUser.set(user);
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'master-data'));
          if (this.selectedResource().id === 'regions' || this.selectedResource().id === 'areas') {
            this.loadSelectedResource();
          }
        },
        error: () => {
          this.authenticatedUser.set(null);
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
        }
      });
  }

  private buildQuery(): MasterDataQuery {
    const filters: Record<string, string> = {};
    const resourceId = this.selectedResource().id;
    const tenantId = this.authenticatedUser()?.tenantId?.trim();

    if ((resourceId === 'regions' || resourceId === 'areas') && tenantId) {
      filters['tenantId'] = tenantId;
    }
    if ((resourceId === 'regions' || resourceId === 'areas') && this.countryFilterId()) {
      filters['countryId'] = this.countryFilterId();
    }
    if (resourceId === 'areas' && this.regionFilterId()) {
      filters['regionId'] = this.regionFilterId();
    }

    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {}),
      ...(Object.keys(filters).length > 0 ? { filters } : {})
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

    this.formMode.set(mode);
    this.formValue.set(row);
  }

  private buildMutationPayload(
    resource: MasterDataResource,
    formValue: Record<string, unknown>,
    tenantId: string
  ): MasterDataMutationRequest {
    const payload: MasterDataMutationRequest = {};

    for (const [key, value] of Object.entries(formValue)) {
      payload[key] = typeof value === 'string' ? value.trim() : value;
    }

    if (payload['active'] === undefined) {
      payload['active'] = true;
    }

    if (resource.mutationScope !== 'global') {
      payload['tenantId'] = tenantId;
    }

    if (resource.autoCode) {
      delete payload['code'];
    }

    return payload;
  }

  private decorateFormFields(fields: readonly MasterDataFormField[]): readonly MasterDataFormField[] {
    return fields.map((field) => {
      if (field.type !== 'lookup') {
        return field;
      }

      if (field.key === 'countryId') {
        return {
          ...field,
          lookupLoadPage: (query: Parameters<LookupService['findCountryLookups']>[0]) => this.lookupService.findCountryLookups(query),
          initialOptionResolver: (row: MasterDataRow | null) => this.referenceToLookupOption(row?.['country'])
        };
      }

      if (field.key === 'regionId') {
        return {
          ...field,
          lookupLoadPageFactory: (getValue: (key: string) => string | null) => (query: Parameters<LookupService['findRegionLookups']>[0]) =>
            this.lookupService.findRegionLookups(
              query,
              this.authenticatedUser()?.tenantId ?? null,
              getValue('countryId')
            ),
          initialOptionResolver: (row: MasterDataRow | null) => this.referenceToLookupOption(row?.['region'])
        };
      }

      return field;
    });
  }

  private isTechnicalColumn(key: string): boolean {
    return key === 'tenant' || key === 'tenantId' || key === 'tenantName';
  }

  private resolveTenantIdForMutation(userTenantId: string): string {
    const currentRowTenantId = this.formValue()?.['tenantId'];
    if (typeof currentRowTenantId === 'string' && currentRowTenantId.length > 0) {
      return currentRowTenantId;
    }

    return userTenantId;
  }

  private resolveSaveError(error: unknown): string {
    return resolveApiErrorMessage(this.i18n, error, {
      fallbackKey: 'masterData.form.error.generic'
    });
  }

  private resolveDeleteError(error: unknown, mode: MasterDataDeleteMode): string {
    const keyPrefix = mode === 'physical' ? 'masterData.deletePhysical.error.' : 'masterData.delete.error.';
    return resolveApiErrorMessage(this.i18n, error, {
      fallbackKey: mode === 'physical'
        ? 'masterData.deletePhysical.error.generic'
        : 'masterData.delete.error.generic',
      statusKeys: {
        400: `${keyPrefix}badRequest` as I18nKey,
        401: `${keyPrefix}unauthorized` as I18nKey,
        403: `${keyPrefix}forbidden` as I18nKey,
        404: `${keyPrefix}notFound` as I18nKey,
        409: `${keyPrefix}conflict` as I18nKey,
        500: `${keyPrefix}server` as I18nKey
      }
    });
  }

  private executeDeleteAction(mode: MasterDataDeleteMode, row: MasterDataRow): void {
    const rowId = typeof row['id'] === 'string' ? row['id'] as string : null;

    if (!rowId) {
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

  protected readonly loadCountryFilterOptions = (query: Parameters<LookupService['findCountryLookups']>[0]) =>
    this.lookupService.findCountryLookups(query);

  protected readonly loadRegionFilterOptions = (query: Parameters<LookupService['findRegionLookups']>[0]) =>
    this.lookupService.findRegionLookups(
      query,
      this.authenticatedUser()?.tenantId ?? null,
      this.countryFilterId() || null
    );

  private resetGeoFilters(): void {
    this.countryFilterId.set('');
    this.regionFilterId.set('');
  }

  private referenceToLookupOption(reference: unknown): LookupOption | null {
    if (!reference || typeof reference !== 'object') {
      return null;
    }

    const candidate = reference as Record<string, unknown>;
    const id = typeof candidate['id'] === 'string' ? candidate['id'] : '';
    const code = typeof candidate['code'] === 'string' ? candidate['code'] : '';
    const name = typeof candidate['name'] === 'string' ? candidate['name'] : '';

    return id && code && name
      ? { id, code, name }
      : null;
  }
}
