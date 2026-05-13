import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, forkJoin, map, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_TENANT_ADMIN_PAGE_SIZE,
  EMPTY_TENANT_ADMIN_PAGE,
  TenantAdministrationColumn,
  TenantAdministrationCreateRequest,
  TenantAdministrationFormOptions,
  TenantAdministrationPage,
  TenantAdministrationQuery,
  TenantAdministrationRowAction,
  TenantAdministrationRowActionEvent,
  TenantAdministrationTenantDetail,
  TenantAdministrationTenantListItem,
  TenantAdministrationUpdateRequest
} from './tenant-administration.models';
import { TenantAdministrationService } from './tenant-administration.service';

type TenantAdministrationFormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-tenant-administration',
  imports: [AppButtonComponent, AppCheckboxComponent, DataTableComponent, ReactiveFormsModule],
  templateUrl: './tenant-administration.component.html',
  styleUrl: './tenant-administration.component.scss'
})
export class TenantAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly tenantAdministrationService = inject(TenantAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private modalSubscription?: Subscription;
  private mutationSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadTenants();
    });

  protected readonly columns = computed<readonly TenantAdministrationColumn[]>(() => [
    { key: 'code', labelKey: 'masterData.columns.code', minWidth: '10rem' },
    { key: 'name', labelKey: 'masterData.columns.name', minWidth: '14rem' },
    { key: 'legalName', labelKey: 'tenantAdministration.columns.legalName', minWidth: '16rem' },
    { key: 'defaultCountry.name', labelKey: 'tenantAdministration.columns.defaultCountry', minWidth: '11rem' },
    { key: 'defaultCurrency.code', labelKey: 'tenantAdministration.columns.defaultCurrency', minWidth: '9rem' },
    { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean', minWidth: '7rem' },
    { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime', minWidth: '9rem' }
  ]);
  protected readonly rowActions = computed<readonly TenantAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: () => this.loading() || !this.modulePermissions().canView
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      disabled: (row) => this.loading() || this.isBusy((row as TenantAdministrationTenantListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'activate',
      labelKey: 'tenantAdministration.actions.activate',
      visible: (row) => !(row as TenantAdministrationTenantListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as TenantAdministrationTenantListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deactivate',
      labelKey: 'tenantAdministration.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'tenantAdministration.deactivate.confirmTitle',
        messageKey: 'tenantAdministration.deactivate.confirmMessage',
        confirmLabelKey: 'tenantAdministration.deactivate.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as TenantAdministrationTenantListItem)
      },
      visible: (row) => (row as TenantAdministrationTenantListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as TenantAdministrationTenantListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deletePhysical',
      labelKey: 'tenantAdministration.actions.deletePhysical',
      tone: 'danger',
      confirmation: {
        titleKey: 'tenantAdministration.delete.confirmTitle',
        messageKey: 'tenantAdministration.delete.confirmMessage',
        confirmLabelKey: 'tenantAdministration.delete.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as TenantAdministrationTenantListItem)
      },
      disabled: (row) => this.loading() || this.isBusy((row as TenantAdministrationTenantListItem).id) || !this.modulePermissions().canDelete
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<TenantAdministrationPage<TenantAdministrationTenantListItem>>(EMPTY_TENANT_ADMIN_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_TENANT_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly actingTenantId = signal<string | null>(null);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly modalMode = signal<TenantAdministrationFormMode | null>(null);
  protected readonly modalLoading = signal(false);
  protected readonly modalTenant = signal<TenantAdministrationTenantDetail | null>(null);
  protected readonly formOptions = signal<TenantAdministrationFormOptions | null>(null);
  protected readonly submitted = signal(false);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly isModalOpen = computed(() => this.modalMode() !== null);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(
    () => this.appliedSearch() ? 'tenantAdministration.table.noResults' : 'tenantAdministration.table.empty'
  );

  protected readonly form = this.formBuilder.group({
    code: [''],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    legalName: ['', [Validators.required, Validators.maxLength(150)]],
    defaultCountryId: ['', [Validators.required]],
    defaultCurrencyId: ['', [Validators.required]],
    active: [true]
  });

  constructor() {
    this.loadTenants();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.modalSubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected openCreateForm(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }
    this.openModal('create');
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected handleRowAction(event: TenantAdministrationRowActionEvent): void {
    const tenant = event.row as TenantAdministrationTenantListItem;
    if (event.action.id === 'view' && this.modulePermissions().canView) {
      this.openModal('view', tenant.id);
      return;
    }
    if (event.action.id === 'edit' && this.modulePermissions().canUpdate) {
      this.openModal('edit', tenant.id);
      return;
    }
    if (event.action.id === 'activate' && this.modulePermissions().canUpdate) {
      this.toggleTenant(tenant, true);
      return;
    }
    if (event.action.id === 'deactivate' && this.modulePermissions().canUpdate) {
      this.toggleTenant(tenant, false);
      return;
    }
    if (event.action.id === 'deletePhysical' && this.modulePermissions().canDelete) {
      this.deleteTenant(tenant);
    }
  }

  protected closeModal(): void {
    this.modalMode.set(null);
    this.modalTenant.set(null);
    this.formOptions.set(null);
    this.modalLoading.set(false);
    this.submitted.set(false);
  }

  protected submitModal(): void {
    const mode = this.modalMode();
    if (mode === 'view') {
      this.closeModal();
      return;
    }
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.mutationSubscription?.unsubscribe();
    const payload = this.buildPayload();
    const request$ = mode === 'create'
      ? this.tenantAdministrationService.createTenant(payload as TenantAdministrationCreateRequest)
      : this.tenantAdministrationService.updateTenant(this.modalTenant()?.id ?? '', payload as TenantAdministrationUpdateRequest);

    this.mutationSubscription = request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(mode === 'create'
            ? 'tenantAdministration.feedback.createSuccess'
            : 'tenantAdministration.feedback.updateSuccess'), { titleKey: 'alert.title.success' });
          this.closeModal();
          if (mode === 'create') {
            this.pageIndex.set(0);
          }
          this.loadTenants();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'tenantAdministration.errors.saveGeneric'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }
    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadTenants();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }
    this.pageIndex.update((page) => page + 1);
    this.loadTenants();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }
    this.pageIndex.set(page);
    this.loadTenants();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }
    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadTenants();
  }

  protected modalTitleKey(): I18nKey {
    switch (this.modalMode()) {
      case 'create':
        return 'tenantAdministration.form.createTitle';
      case 'edit':
        return 'tenantAdministration.form.editTitle';
      default:
        return 'tenantAdministration.form.viewTitle';
    }
  }

  protected modalSubmitLabelKey(): I18nKey {
    return this.modalMode() === 'create'
      ? 'tenantAdministration.form.actions.create'
      : 'tenantAdministration.form.actions.save';
  }

  protected modalSubmitLoadingLabelKey(): I18nKey {
    return this.modalMode() === 'create'
      ? 'tenantAdministration.form.actions.creating'
      : 'tenantAdministration.form.actions.saving';
  }

  protected modalReadOnly(): boolean {
    return this.modalMode() === 'view';
  }

  protected notesKey(): I18nKey {
    return 'tenantAdministration.notes.platformOnly';
  }

  private loadTenants(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'tenants'));
          return this.tenantAdministrationService.findTenants(this.buildQuery());
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

  private openModal(mode: TenantAdministrationFormMode, tenantId?: string): void {
    this.modalMode.set(mode);
    this.modalLoading.set(true);
    this.submitted.set(false);
    this.modalSubscription?.unsubscribe();

    const request$ = tenantId
      ? forkJoin({
        options: this.tenantAdministrationService.findFormOptions(),
        tenant: this.tenantAdministrationService.findTenantById(tenantId)
      })
      : this.tenantAdministrationService.findFormOptions().pipe(
        map((options) => ({ options, tenant: null as TenantAdministrationTenantDetail | null }))
      );

    this.modalSubscription = request$
      .pipe(finalize(() => this.modalLoading.set(false)))
      .subscribe({
        next: (result) => {
          this.formOptions.set(result.options);
          this.modalTenant.set(result.tenant);
          this.populateForm(mode, result.tenant);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'tenantAdministration.errors.detailLoad'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
          this.closeModal();
        }
      });
  }

  private populateForm(mode: TenantAdministrationFormMode, tenant: TenantAdministrationTenantDetail | null): void {
    this.form.reset({
      code: tenant?.code ?? '',
      name: tenant?.name ?? '',
      legalName: tenant?.legalName ?? '',
      defaultCountryId: tenant?.defaultCountry.id ?? '',
      defaultCurrencyId: tenant?.defaultCurrency.id ?? '',
      active: tenant?.active ?? true
    });

    if (mode === 'view') {
      this.form.disable();
      return;
    }

    this.form.enable();
    if (mode !== 'create') {
      this.form.controls.code.disable();
    }
    this.form.controls.active.disable();
  }

  private buildPayload(): TenantAdministrationCreateRequest | TenantAdministrationUpdateRequest {
    const value = this.form.getRawValue();
    return {
      name: value.name.trim(),
      legalName: value.legalName.trim(),
      defaultCountryId: value.defaultCountryId,
      defaultCurrencyId: value.defaultCurrencyId,
      ...(this.modalMode() === 'create' ? { active: true } : {})
    };
  }

  private toggleTenant(tenant: TenantAdministrationTenantListItem, active: boolean): void {
    this.actingTenantId.set(tenant.id);
    this.mutationSubscription?.unsubscribe();
    const request$ = active
      ? this.tenantAdministrationService.activateTenant(tenant.id)
      : this.tenantAdministrationService.deactivateTenant(tenant.id);

    this.mutationSubscription = request$
      .pipe(finalize(() => this.actingTenantId.set(null)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(active
            ? 'tenantAdministration.feedback.activateSuccess'
            : 'tenantAdministration.feedback.deactivateSuccess'), { titleKey: 'alert.title.success' });
          this.loadTenants();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, active
            ? 'tenantAdministration.errors.activateGeneric'
            : 'tenantAdministration.errors.deactivateGeneric'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteTenant(tenant: TenantAdministrationTenantListItem): void {
    this.deleting.set(true);
    this.actingTenantId.set(tenant.id);
    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = this.tenantAdministrationService.deleteTenant(tenant.id)
      .pipe(finalize(() => {
        this.deleting.set(false);
        this.actingTenantId.set(null);
      }))
      .subscribe({
        next: () => {
          if (this.rows().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => Math.max(0, page - 1));
          }
          this.notificationService.success(this.i18n.t('tenantAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadTenants();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'tenantAdministration.errors.deleteGeneric'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private buildQuery(): TenantAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): TenantAdministrationPage<TenantAdministrationTenantListItem> {
    return {
      ...EMPTY_TENANT_ADMIN_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private isBusy(tenantId: string): boolean {
    return this.deleting() || this.saving() || this.actingTenantId() === tenantId;
  }

  private confirmationTarget(tenant: TenantAdministrationTenantListItem): string {
    return `${tenant.name} (${tenant.code})`;
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }
}
