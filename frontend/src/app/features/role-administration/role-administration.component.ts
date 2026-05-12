import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { MasterDataFormComponent, MasterDataFormSubmitEvent } from '../master-data/master-data-form.component';
import { MasterDataFormField, MasterDataFormMode } from '../master-data/master-data.models';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_ROLE_ADMIN_PAGE_SIZE,
  EMPTY_ROLE_ADMIN_PAGE,
  RoleAdministrationColumn,
  RoleAdministrationCreateRequest,
  RoleAdministrationPage,
  RoleAdministrationQuery,
  RoleAdministrationRoleListItem,
  RoleAdministrationRowActionEvent,
  RoleAdministrationRowAction,
  RoleAdministrationUpdateRequest
} from './role-administration.models';
import { RoleAdministrationService } from './role-administration.service';

@Component({
  selector: 'app-role-administration',
  imports: [AppButtonComponent, DataTableComponent, MasterDataFormComponent],
  templateUrl: './role-administration.component.html',
  styleUrl: './role-administration.component.scss'
})
export class RoleAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly roleAdministrationService = inject(RoleAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private toggleSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadRoles();
    });

  protected readonly columns = computed<readonly RoleAdministrationColumn[]>(() => [
    {
      key: 'code',
      labelKey: 'masterData.columns.code',
      minWidth: '10rem'
    },
    {
      key: 'name',
      labelKey: 'masterData.columns.name',
      minWidth: '14rem'
    },
    {
      key: 'description',
      labelKey: 'masterData.columns.description',
      minWidth: '18rem'
    },
    {
      key: 'systemRole',
      labelKey: 'masterData.columns.systemFlag',
      type: 'boolean',
      minWidth: '8rem',
      formatter: (value) => this.formatSystemRole(value)
    },
    {
      key: 'active',
      labelKey: 'masterData.columns.active',
      type: 'boolean',
      minWidth: '7rem'
    },
    {
      key: 'updatedAt',
      labelKey: 'masterData.columns.updatedAt',
      type: 'datetime',
      minWidth: '9rem'
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<RoleAdministrationPage<RoleAdministrationRoleListItem>>(EMPTY_ROLE_ADMIN_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_ROLE_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly actingRoleId = signal<string | null>(null);
  protected readonly formMode = signal<MasterDataFormMode | null>(null);
  protected readonly formRole = signal<RoleAdministrationRoleListItem | null>(null);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly isFormOpen = computed(() => this.formMode() !== null);
  protected readonly openFormMode = computed<MasterDataFormMode>(() => this.formMode() ?? 'view');
  protected readonly formFields = computed(() => this.buildFormFields(this.openFormMode()));
  protected readonly tableEmptyMessageKey = computed<I18nKey>(
    () => this.appliedSearch() ? 'roleAdministration.table.noResults' : 'roleAdministration.table.empty'
  );
  protected readonly protectedHint = computed(() => this.i18n.t('roleAdministration.protectedHint'));
  protected readonly rowActions = computed<readonly RoleAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: (row) => !this.modulePermissions().canView || this.isBusy(this.toRoleRow(row))
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      visible: (row) => this.toRoleRow(row).systemRole !== true,
      disabled: (row) => !this.modulePermissions().canUpdate || this.isBusy(this.toRoleRow(row))
    },
    {
      id: 'activate',
      labelKey: 'roleAdministration.actions.activate',
      visible: (row) => {
        const role = this.toRoleRow(row);
        return role.systemRole !== true && role.active !== true;
      },
      disabled: (row) => !this.modulePermissions().canUpdate || this.isBusy(this.toRoleRow(row))
    },
    {
      id: 'deactivate',
      labelKey: 'roleAdministration.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'roleAdministration.deactivate.confirmTitle',
        messageKey: 'roleAdministration.deactivate.confirmMessage',
        confirmLabelKey: 'roleAdministration.deactivate.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.toRoleRow(row).name
      },
      visible: (row) => {
        const role = this.toRoleRow(row);
        return role.systemRole !== true && role.active === true;
      },
      disabled: (row) => !this.modulePermissions().canUpdate || this.isBusy(this.toRoleRow(row))
    },
    {
      id: 'deletePhysical',
      labelKey: 'masterData.actions.deletePhysical',
      tone: 'danger',
      confirmation: {
        titleKey: 'roleAdministration.delete.confirmTitle',
        messageKey: 'roleAdministration.delete.confirmMessage',
        confirmLabelKey: 'roleAdministration.delete.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.toRoleRow(row).name
      },
      visible: (row) => this.toRoleRow(row).systemRole !== true,
      disabled: (row) => !this.modulePermissions().canDelete || this.isBusy(this.toRoleRow(row))
    }
  ]);

  constructor() {
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.toggleSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected refresh(): void {
    this.loadRoles();
  }

  protected openCreateForm(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }

    this.formRole.set(null);
    this.formMode.set('create');
  }

  protected handleRowAction(event: RoleAdministrationRowActionEvent): void {
    if (!this.isActionAllowed(event.action.id)) {
      return;
    }

    const role = this.toRoleRow(event.row);

    if (event.action.id === 'view') {
      this.formRole.set(role);
      this.formMode.set('view');
      return;
    }

    if (event.action.id === 'edit') {
      this.formRole.set(role);
      this.formMode.set('edit');
      return;
    }

    if (event.action.id === 'activate') {
      this.toggleRole(role, true);
      return;
    }

    if (event.action.id === 'deactivate') {
      this.toggleRole(role, false);
      return;
    }

    if (event.action.id === 'deletePhysical') {
      this.deleteRole(role);
    }
  }

  protected handleFormSave(event: MasterDataFormSubmitEvent): void {
    this.saving.set(true);
    this.saveSubscription?.unsubscribe();
    this.saveSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          if (event.mode === 'create') {
            return this.roleAdministrationService.createRole(this.buildCreatePayload(event.value, user.tenantId));
          }

          return this.roleAdministrationService.updateRole(
            this.formRole()?.id ?? '',
            this.buildUpdatePayload(event.value)
          );
        }),
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.i18n.t(event.mode === 'create'
              ? 'roleAdministration.feedback.createSuccess'
              : 'roleAdministration.feedback.updateSuccess'),
            { titleKey: 'alert.title.success' }
          );
          this.closeForm();
          if (event.mode === 'create') {
            this.pageIndex.set(0);
          }
          this.loadRoles();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'roleAdministration.errors.saveGeneric'), {
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
    this.formRole.set(null);
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadRoles();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadRoles();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadRoles();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadRoles();
  }

  private loadRoles(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'roles'));
          return this.roleAdministrationService.findRoles(user.tenantId, this.buildQuery());
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private toggleRole(role: RoleAdministrationRoleListItem, active: boolean): void {
    this.actingRoleId.set(role.id);
    this.toggleSubscription?.unsubscribe();
    const request$ = active
      ? this.roleAdministrationService.activateRole(role.id)
      : this.roleAdministrationService.deactivateRole(role.id);

    this.toggleSubscription = request$
      .pipe(finalize(() => this.actingRoleId.set(null)))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.i18n.t(active
              ? 'roleAdministration.feedback.activateSuccess'
              : 'roleAdministration.feedback.deactivateSuccess'),
            { titleKey: 'alert.title.success' }
          );
          this.loadRoles();
        },
        error: (error) => {
          this.notificationService.error(
            this.resolveApiMessage(error, active
              ? 'roleAdministration.errors.activateGeneric'
              : 'roleAdministration.errors.deactivateGeneric'),
            {
              titleKey: 'alert.title.danger',
              dismissible: true
            }
          );
        }
      });
  }

  private deleteRole(role: RoleAdministrationRoleListItem): void {
    this.deleting.set(true);
    this.deleteSubscription?.unsubscribe();
    this.deleteSubscription = this.roleAdministrationService.deleteRole(role.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          if (this.rows().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => Math.max(0, page - 1));
          }
          this.notificationService.success(this.i18n.t('roleAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadRoles();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'roleAdministration.errors.deleteGeneric'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private buildFormFields(mode: MasterDataFormMode): readonly MasterDataFormField[] {
    if (mode === 'create') {
      return [
        { key: 'code', labelKey: 'masterData.columns.code', required: true },
        { key: 'name', labelKey: 'masterData.columns.name', required: true },
        { key: 'description', labelKey: 'masterData.columns.description' },
        { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean' }
      ];
    }

    if (mode === 'edit') {
      return [
        { key: 'code', labelKey: 'masterData.columns.code', readOnly: true },
        { key: 'name', labelKey: 'masterData.columns.name', required: true },
        { key: 'description', labelKey: 'masterData.columns.description' }
      ];
    }

    return [
      { key: 'code', labelKey: 'masterData.columns.code', readOnly: true },
      { key: 'name', labelKey: 'masterData.columns.name', readOnly: true },
      { key: 'description', labelKey: 'masterData.columns.description', readOnly: true },
      { key: 'systemRole', labelKey: 'masterData.columns.systemFlag', type: 'boolean', readOnly: true },
      { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean', readOnly: true }
    ];
  }

  private buildCreatePayload(formValue: Record<string, unknown>, tenantId: string): RoleAdministrationCreateRequest {
    return {
      tenantId,
      code: String(formValue['code'] ?? '').trim(),
      name: String(formValue['name'] ?? '').trim(),
      description: this.normalizeOptionalString(formValue['description']),
      active: formValue['active'] === undefined ? true : Boolean(formValue['active'])
    };
  }

  private buildUpdatePayload(formValue: Record<string, unknown>): RoleAdministrationUpdateRequest {
    return {
      name: String(formValue['name'] ?? '').trim(),
      description: this.normalizeOptionalString(formValue['description'])
    };
  }

  private buildQuery(): RoleAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): RoleAdministrationPage<RoleAdministrationRoleListItem> {
    return {
      ...EMPTY_ROLE_ADMIN_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private normalizeOptionalString(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }

  private isBusy(role: RoleAdministrationRoleListItem): boolean {
    return this.deleting() || this.saving() || this.actingRoleId() === role.id;
  }

  private isActionAllowed(actionId: string): boolean {
    const permissions = this.modulePermissions();

    switch (actionId) {
      case 'view':
        return permissions.canView;
      case 'edit':
      case 'activate':
      case 'deactivate':
        return permissions.canUpdate;
      case 'deletePhysical':
        return permissions.canDelete;
      default:
        return true;
    }
  }

  private formatSystemRole(value: unknown): string {
    return value === true
      ? this.i18n.t('roleAdministration.badges.system')
      : this.i18n.t('roleAdministration.badges.custom');
  }

  private toRoleRow(row: Record<string, unknown>): RoleAdministrationRoleListItem {
    return row as RoleAdministrationRoleListItem;
  }
}
