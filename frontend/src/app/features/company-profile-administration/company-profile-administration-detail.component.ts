import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.models';
import {
  DETAIL_ACTION_BAR_STANDARD_ACTION_IDS,
  DetailActionBarAction,
  DetailActionBarComponent
} from '../../shared/components/detail-action-bar/detail-action-bar.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  CompanyProfileAdministrationAreaOption,
  CompanyProfileAdministrationCompanyProfileDetail,
  CompanyProfileAdministrationFormOptions
} from './company-profile-administration.models';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

type CompanyProfilePendingAction = 'deactivate' | 'deletePhysical';

interface PendingCompanyProfileConfirmation {
  readonly action: CompanyProfilePendingAction;
  readonly config: ConfirmDialogConfig;
}

@Component({
  selector: 'app-company-profile-administration-detail',
  imports: [ConfirmDialogComponent, DetailActionBarComponent],
  templateUrl: './company-profile-administration-detail.component.html',
  styleUrl: './company-profile-administration-detail.component.scss'
})
export class CompanyProfileAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly companyProfileAdministrationService = inject(CompanyProfileAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly actionSaving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly companyProfile = signal<CompanyProfileAdministrationCompanyProfileDetail | null>(null);
  protected readonly formOptions = signal<CompanyProfileAdministrationFormOptions | null>(null);
  protected readonly pendingConfirmation = signal<PendingCompanyProfileConfirmation | null>(null);

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  protected detailTitle(): string {
    const detail = this.companyProfile();
    if (!detail) {
      return this.i18n.t('companyProfileAdministration.detail.title');
    }

    return detail.tradeName?.trim() || detail.legalName?.trim() || detail.code;
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/company-profiles']);
  }

  protected editCompanyProfile(): void {
    const detail = this.companyProfile();
    if (!detail || !this.modulePermissions().canUpdate) {
      return;
    }

    void this.router.navigate(['/admin/company-profiles', detail.id, 'edit']);
  }

  protected retry(): void {
    this.load();
  }

  protected detailSecondaryActions(): readonly DetailActionBarAction[] {
    if (this.hasError()) {
      return [{
        id: 'retry',
        label: this.i18n.t('rolePermissions.actions.retry'),
        icon: 'ki-filled ki-arrows-circle'
      }];
    }

    const detail = this.companyProfile();
    if (!detail) {
      return [];
    }

    return [{
      id: detail.active
        ? DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate
        : DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate,
      label: this.i18n.t(this.activeActionLabelKey(detail)),
      loadingLabel: this.i18n.t(this.activeActionLoadingLabelKey(detail)),
      loading: this.actionSaving(),
      disabled: this.actionSaving() || !this.modulePermissions().canUpdate,
      icon: detail.active ? 'ki-filled ki-cross-circle' : 'ki-filled ki-check-circle',
      variant: detail.active ? 'outline' : 'secondary'
    }];
  }

  protected detailPrimaryAction(): DetailActionBarAction | null {
    if (this.hasError() || !this.companyProfile()) {
      return null;
    }

    return {
      id: DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit,
      label: this.i18n.t('companyProfileAdministration.actions.edit'),
      disabled: !this.modulePermissions().canUpdate,
      icon: 'ki-filled ki-pencil'
    };
  }

  protected detailDestructiveActions(): readonly DetailActionBarAction[] {
    if (this.hasError() || !this.companyProfile()) {
      return [];
    }

    return [{
      id: DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deletePhysical,
      label: this.i18n.t('companyProfileAdministration.actions.deletePhysical'),
      loadingLabel: this.i18n.t('companyProfileAdministration.deletePhysical.processing'),
      loading: this.actionSaving(),
      disabled: this.actionSaving() || !this.canDelete(),
      icon: 'ki-filled ki-trash'
    }];
  }

  protected handleDetailAction(actionId: string): void {
    switch (actionId) {
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit:
        this.editCompanyProfile();
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate:
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate:
        this.triggerActiveAction();
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deletePhysical:
        this.triggerDeleteAction();
        return;
      case 'retry':
        this.retry();
        return;
      default:
        return;
    }
  }

  protected canDelete(): boolean {
    return this.modulePermissions().canDelete;
  }

  protected activeActionLabelKey(detail: CompanyProfileAdministrationCompanyProfileDetail): I18nKey {
    return detail.active
      ? 'companyProfileAdministration.actions.deactivate'
      : 'companyProfileAdministration.actions.activate';
  }

  protected activeActionLoadingLabelKey(detail: CompanyProfileAdministrationCompanyProfileDetail): I18nKey {
    return detail.active
      ? 'companyProfileAdministration.lifecycle.deactivate.processing'
      : 'companyProfileAdministration.lifecycle.activate.processing';
  }

  protected triggerActiveAction(): void {
    const detail = this.companyProfile();
    if (!detail || this.actionSaving() || !this.modulePermissions().canUpdate) {
      return;
    }

    if (detail.active) {
      this.pendingConfirmation.set(this.confirmationConfigForAction('deactivate'));
      return;
    }

    this.toggleCompanyProfile(true);
  }

  protected triggerDeleteAction(): void {
    if (!this.companyProfile() || this.actionSaving() || !this.modulePermissions().canDelete) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction('deletePhysical'));
  }

  protected cancelPendingAction(): void {
    if (this.actionSaving()) {
      return;
    }

    this.pendingConfirmation.set(null);
  }

  protected confirmPendingAction(): void {
    const pending = this.pendingConfirmation();
    if (!pending) {
      return;
    }

    this.pendingConfirmation.set(null);

    if (pending.action === 'deletePhysical') {
      this.deleteCompanyProfile();
      return;
    }

    this.toggleCompanyProfile(false);
  }

  protected mainFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.code', value: detail.code },
      { labelKey: 'companyProfileAdministration.fields.legalName', value: this.displayValue(detail.legalName) },
      { labelKey: 'companyProfileAdministration.fields.tradeName', value: this.displayValue(detail.tradeName) },
      { labelKey: 'masterData.columns.active', value: this.booleanValue(detail.active) }
    ];
  }

  protected tenantTypeFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.tenant', value: this.referenceValue(detail.tenant) },
      { labelKey: 'companyProfileAdministration.fields.companyProfileType', value: this.referenceValue(detail.companyProfileType) }
    ];
  }

  protected fiscalFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = this.isItalianCountryCode(detail.country.code)
      ? [
        { labelKey: 'companyProfileAdministration.fields.vatNumber', value: this.displayValue(detail.vatNumber) },
        { labelKey: 'companyProfileAdministration.fields.taxNumber', value: this.displayValue(detail.taxNumber) }
      ]
      : [
        { labelKey: 'companyProfileAdministration.fields.taxIdentifier', value: this.displayValue(detail.taxIdentifier) }
      ];

    fields.push(
      { labelKey: 'companyProfile.fields.pecEmail', value: this.displayValue(detail.pecEmail) },
      { labelKey: 'companyProfile.fields.sdiCode', value: this.displayValue(detail.sdiCode) }
    );

    return fields;
  }

  protected contactFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.columns.email', value: this.displayValue(detail.email) },
      { labelKey: 'companyProfileAdministration.fields.phone', value: this.displayValue(this.phoneValue(detail)) }
    ];
  }

  protected addressFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [
      { labelKey: 'masterData.columns.country', value: this.referenceValue(detail.country) },
      { labelKey: 'companyProfileAdministration.fields.street', value: this.displayValue(detail.street) },
      { labelKey: 'companyProfileAdministration.fields.streetNumber', value: this.displayValue(detail.streetNumber) },
      { labelKey: 'masterData.columns.postalCode', value: this.referenceValue(detail.globalZipCode) },
      { labelKey: 'masterData.columns.city', value: this.displayValue(detail.globalZipCode?.name) },
      { labelKey: this.areaLabelKey(detail), value: this.provinceValue(detail) }
    ];

    return fields;
  }

  protected auditFields(detail: CompanyProfileAdministrationCompanyProfileDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.createdAt', value: this.formatDateTime(detail.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.formatDateTime(detail.updatedAt) }
    ];
  }

  private load(): void {
    const companyProfileId = this.route.snapshot.paramMap.get('id');
    if (!companyProfileId) {
      this.hasError.set(true);
      return;
    }

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.pendingConfirmation.set(null);

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      detail: this.companyProfileAdministrationService.findCompanyProfileById(companyProfileId),
      formOptions: this.companyProfileAdministrationService.findFormOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, detail, formOptions }) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(authenticatedUser, 'company-profiles'));
          this.companyProfile.set(detail);
          this.formOptions.set(formOptions);
        },
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.companyProfile.set(null);
          this.formOptions.set(null);
          this.hasError.set(true);
        }
      });
  }

  private toggleCompanyProfile(active: boolean): void {
    const detail = this.companyProfile();
    if (!detail) {
      return;
    }

    this.actionSaving.set(true);
    this.loadSubscription?.unsubscribe();
    const request$ = active
      ? this.companyProfileAdministrationService.activateCompanyProfile(detail.id)
      : this.companyProfileAdministrationService.deactivateCompanyProfile(detail.id);

    this.loadSubscription = request$
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: (updatedDetail) => {
          this.pendingConfirmation.set(null);
          this.companyProfile.set(updatedDetail);
          this.notificationService.success(this.i18n.t(active
            ? 'companyProfileAdministration.feedback.activateSuccess'
            : 'companyProfileAdministration.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
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

  private deleteCompanyProfile(): void {
    const detail = this.companyProfile();
    if (!detail) {
      return;
    }

    this.actionSaving.set(true);
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.companyProfileAdministrationService.deleteCompanyProfile(detail.id)
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: () => {
          this.pendingConfirmation.set(null);
          this.notificationService.success(this.i18n.t('companyProfileAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/company-profiles']);
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

  private areaLabelKey(detail: CompanyProfileAdministrationCompanyProfileDetail): I18nKey {
    return this.isItalianCountryCode(detail.country.code)
      ? 'companyProfileAdministration.fields.province'
      : 'companyProfileAdministration.fields.area';
  }

	private provinceValue(detail: CompanyProfileAdministrationCompanyProfileDetail): string {
		if (!this.isItalianCountryCode(detail.country.code)) {
			return detail.area
				? this.referenceValue(detail.area)
				: this.provinceFromZipCode(detail.globalZipCode?.id ?? '') ?? this.referenceValue(null);
		}

    const zipCodeId = detail.globalZipCode?.id ?? '';
    const provinceFromZipCode = this.provinceFromZipCode(zipCodeId);
    if (provinceFromZipCode) {
      return provinceFromZipCode;
    }

    return this.referenceValue(detail.area);
  }

  private provinceFromZipCode(globalZipCodeId: string): string | null {
    if (!globalZipCodeId) {
      return null;
    }

    const zipCodeOption = this.formOptions()?.globalZipCodes.find((option) => option.id === globalZipCodeId);
    if (!zipCodeOption) {
      return null;
    }

    if (zipCodeOption.areaId) {
      const provinceOption = this.formOptions()?.areas.find((option) => option.id === zipCodeOption.areaId);
      if (provinceOption) {
        return this.referenceValue(provinceOption as CompanyProfileAdministrationAreaOption);
      }
    }

    return this.provinceLabelForZipOption(zipCodeOption);
  }

  private provinceLabelForZipOption(zipCodeOption: { provinceName?: string | null; provinceCode?: string | null }): string | null {
    const provinceName = zipCodeOption.provinceName?.trim() ?? '';
    const provinceCode = zipCodeOption.provinceCode?.trim() ?? '';
    if (provinceName && provinceCode) {
      return `${provinceName} (${provinceCode})`;
    }

    return provinceName || provinceCode || null;
  }

  private isItalianCountryCode(countryCode: string | null | undefined): boolean {
    return countryCode?.trim().toUpperCase() === 'IT';
  }

  private referenceValue(reference: { code: string; name: string } | null | undefined): string {
    if (!reference) {
      return this.i18n.t('companyProfileAdministration.values.none');
    }

    const name = reference.name?.trim();
    const code = reference.code?.trim();
    if (name && code) {
      return `${name} (${code})`;
    }

    return name || code || this.i18n.t('companyProfileAdministration.values.none');
  }

  private displayValue(value: string | null | undefined): string {
    const normalized = value?.trim();
    return normalized || this.i18n.t('companyProfileAdministration.values.none');
  }

  private phoneValue(detail: CompanyProfileAdministrationCompanyProfileDetail): string | null {
    const legacyPhone = detail.phone?.trim();
    if (legacyPhone) {
      return legacyPhone;
    }

    const phoneNationalNumber = detail.phoneNationalNumber?.trim();
    if (!phoneNationalNumber) {
      return null;
    }

    const phoneDialCode = detail.phoneDialCode?.trim();
    return phoneDialCode
      ? `${phoneDialCode} ${phoneNationalNumber}`
      : phoneNationalNumber;
  }

  private booleanValue(value: boolean): string {
    return value ? this.i18n.t('masterData.boolean.yes') : this.i18n.t('masterData.boolean.no');
  }

  private formatDateTime(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('companyProfileAdministration.values.none');
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString();
  }

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }

  private confirmationConfigForAction(action: PendingCompanyProfileConfirmation['action']): PendingCompanyProfileConfirmation {
    const detail = this.companyProfile();
    const targetValue = detail?.tradeName?.trim() || detail?.legalName?.trim() || detail?.code?.trim() || null;

    switch (action) {
      case 'deletePhysical':
        return {
          action,
          config: {
            titleKey: 'companyProfileAdministration.deletePhysical.confirmTitle',
            messageKey: 'companyProfileAdministration.deletePhysical.confirmMessage',
            confirmLabelKey: 'companyProfileAdministration.deletePhysical.confirmAction',
            cancelLabelKey: 'masterData.form.cancel',
            severity: 'danger',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue,
            loading: this.actionSaving()
          }
        };
      case 'deactivate':
      default:
        return {
          action: 'deactivate',
          config: {
            titleKey: 'companyProfileAdministration.deactivate.confirmTitle',
            messageKey: 'companyProfileAdministration.deactivate.confirmMessage',
            confirmLabelKey: 'companyProfileAdministration.deactivate.confirmAction',
            cancelLabelKey: 'masterData.form.cancel',
            severity: 'warning',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue,
            loading: this.actionSaving()
          }
        };
    }
  }
}
