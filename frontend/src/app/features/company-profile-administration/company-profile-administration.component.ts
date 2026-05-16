import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  CompanyProfileAdministrationColumn,
  CompanyProfileAdministrationCompanyProfileListItem,
  CompanyProfileAdministrationPage,
  CompanyProfileAdministrationQuery,
  CompanyProfileAdministrationRowAction,
  CompanyProfileAdministrationRowActionEvent,
  DEFAULT_COMPANY_PROFILE_ADMIN_PAGE_SIZE,
  EMPTY_COMPANY_PROFILE_ADMIN_PAGE
} from './company-profile-administration.models';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

@Component({
  selector: 'app-company-profile-administration',
  imports: [AppButtonComponent, DataTableComponent],
  templateUrl: './company-profile-administration.component.html',
  styleUrl: './company-profile-administration.component.scss'
})
export class CompanyProfileAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  private readonly companyProfileAdministrationService = inject(CompanyProfileAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadCompanyProfiles();
    });

  protected readonly columns = computed<readonly CompanyProfileAdministrationColumn[]>(() => [
    { key: 'code', labelKey: 'masterData.columns.code', minWidth: '8rem' },
    { key: 'legalName', labelKey: 'companyProfileAdministration.fields.legalName', minWidth: '16rem' },
    { key: 'tradeName', labelKey: 'companyProfileAdministration.fields.tradeName', minWidth: '14rem' },
    { key: 'tenant.name', labelKey: 'masterData.columns.tenant', minWidth: '12rem' },
    { key: 'companyProfileType.name', labelKey: 'companyProfileAdministration.fields.companyProfileType', minWidth: '12rem' },
    {
      key: 'taxIdentifier',
      labelKey: 'companyProfileAdministration.fields.fiscalIdentifier',
      minWidth: '11rem',
      formatter: (_value, row) => this.fiscalSummaryValue(row as CompanyProfileAdministrationCompanyProfileListItem)
    },
    { key: 'country.name', labelKey: 'masterData.columns.country', minWidth: '10rem' },
    { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean', minWidth: '7rem' },
    { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime', minWidth: '9rem' }
  ]);
  protected readonly rowActions = computed<readonly CompanyProfileAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: (row) => this.loading() || this.isBusy((row as CompanyProfileAdministrationCompanyProfileListItem).id) || !this.modulePermissions().canView
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      disabled: (row) => this.loading() || this.isBusy((row as CompanyProfileAdministrationCompanyProfileListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'activate',
      labelKey: 'companyProfileAdministration.actions.activate',
      visible: (row) => !(row as CompanyProfileAdministrationCompanyProfileListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as CompanyProfileAdministrationCompanyProfileListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deactivate',
      labelKey: 'companyProfileAdministration.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'companyProfileAdministration.deactivate.confirmTitle',
        messageKey: 'companyProfileAdministration.deactivate.confirmMessage',
        confirmLabelKey: 'companyProfileAdministration.deactivate.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as CompanyProfileAdministrationCompanyProfileListItem)
      },
      visible: (row) => (row as CompanyProfileAdministrationCompanyProfileListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as CompanyProfileAdministrationCompanyProfileListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deletePhysical',
      labelKey: 'companyProfileAdministration.actions.deletePhysical',
      tone: 'danger',
      confirmation: {
        titleKey: 'companyProfileAdministration.deletePhysical.confirmTitle',
        messageKey: 'companyProfileAdministration.deletePhysical.confirmMessage',
        confirmLabelKey: 'companyProfileAdministration.deletePhysical.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as CompanyProfileAdministrationCompanyProfileListItem)
      },
      disabled: (row) => this.loading() || this.isBusy((row as CompanyProfileAdministrationCompanyProfileListItem).id) || !this.modulePermissions().canDelete
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<CompanyProfileAdministrationPage<CompanyProfileAdministrationCompanyProfileListItem>>(
    EMPTY_COMPANY_PROFILE_ADMIN_PAGE
  );
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_COMPANY_PROFILE_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly deleting = signal(false);
  protected readonly hasError = signal(false);
  protected readonly actingCompanyProfileId = signal<string | null>(null);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(() =>
    this.appliedSearch() ? 'companyProfileAdministration.table.noResults' : 'companyProfileAdministration.table.empty'
  );

  constructor() {
    this.loadCompanyProfiles();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected createCompanyProfile(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }

    void this.router.navigate(['/admin/company-profiles/new']);
  }

  protected handleRowAction(event: CompanyProfileAdministrationRowActionEvent): void {
    const row = event.row as CompanyProfileAdministrationCompanyProfileListItem;

    if (event.action.id === 'view' && this.modulePermissions().canView) {
      void this.router.navigate(['/admin/company-profiles', row.id]);
      return;
    }

    if (event.action.id === 'edit' && this.modulePermissions().canUpdate) {
      void this.router.navigate(['/admin/company-profiles', row.id, 'edit']);
      return;
    }

    if (event.action.id === 'activate' && this.modulePermissions().canUpdate) {
      this.toggleCompanyProfile(row, true);
      return;
    }

    if (event.action.id === 'deactivate' && this.modulePermissions().canUpdate) {
      this.toggleCompanyProfile(row, false);
      return;
    }

    if (event.action.id === 'deletePhysical' && this.modulePermissions().canDelete) {
      this.deleteCompanyProfile(row);
    }
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadCompanyProfiles();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadCompanyProfiles();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadCompanyProfiles();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadCompanyProfiles();
  }

  private loadCompanyProfiles(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'company-profiles'));
          const platformScope = user.userType.startsWith('PLATFORM_');
          return this.companyProfileAdministrationService.findCompanyProfiles(
            platformScope ? null : user.tenantId,
            this.buildQuery()
          );
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

  private toggleCompanyProfile(companyProfile: CompanyProfileAdministrationCompanyProfileListItem, active: boolean): void {
    this.actingCompanyProfileId.set(companyProfile.id);
    this.loadSubscription?.unsubscribe();
    const request$ = active
      ? this.companyProfileAdministrationService.activateCompanyProfile(companyProfile.id)
      : this.companyProfileAdministrationService.deactivateCompanyProfile(companyProfile.id);

    this.loadSubscription = request$
      .pipe(finalize(() => this.actingCompanyProfileId.set(null)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(active
            ? 'companyProfileAdministration.feedback.activateSuccess'
            : 'companyProfileAdministration.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadCompanyProfiles();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, active
            ? 'companyProfileAdministration.errors.activate'
            : 'companyProfileAdministration.errors.deactivate'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteCompanyProfile(companyProfile: CompanyProfileAdministrationCompanyProfileListItem): void {
    this.deleting.set(true);
    this.actingCompanyProfileId.set(companyProfile.id);
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.companyProfileAdministrationService.deleteCompanyProfile(companyProfile.id)
      .pipe(finalize(() => {
        this.deleting.set(false);
        this.actingCompanyProfileId.set(null);
      }))
      .subscribe({
        next: () => {
          if (this.rows().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => Math.max(0, page - 1));
          }
          this.notificationService.success(this.i18n.t('companyProfileAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadCompanyProfiles();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'companyProfileAdministration.deletePhysical.error.generic', {
            401: 'companyProfileAdministration.deletePhysical.error.unauthorized',
            403: 'companyProfileAdministration.deletePhysical.error.forbidden',
            404: 'companyProfileAdministration.deletePhysical.error.notFound',
            409: 'companyProfileAdministration.deletePhysical.error.conflict'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private buildQuery(): CompanyProfileAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): CompanyProfileAdministrationPage<CompanyProfileAdministrationCompanyProfileListItem> {
    return {
      ...EMPTY_COMPANY_PROFILE_ADMIN_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private isBusy(companyProfileId: string): boolean {
    return this.deleting() || this.actingCompanyProfileId() === companyProfileId;
  }

  private confirmationTarget(companyProfile: CompanyProfileAdministrationCompanyProfileListItem): string {
    return `${companyProfile.tradeName || companyProfile.legalName} (${companyProfile.code})`;
  }

  private fiscalSummaryValue(companyProfile: CompanyProfileAdministrationCompanyProfileListItem): string {
    if (this.isItalianCompanyProfile(companyProfile)) {
      return this.displayValue(companyProfile.vatNumber)
        || this.displayValue(companyProfile.taxNumber)
        || this.i18n.t('companyProfileAdministration.values.none');
    }

    return this.displayValue(companyProfile.taxIdentifier) || this.i18n.t('companyProfileAdministration.values.none');
  }

  private isItalianCompanyProfile(companyProfile: CompanyProfileAdministrationCompanyProfileListItem): boolean {
    return companyProfile.country.code.trim().toUpperCase() === 'IT';
  }

  private displayValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized || null;
  }

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }
}
