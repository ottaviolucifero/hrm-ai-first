import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
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

@Component({
  selector: 'app-company-profile-administration-detail',
  imports: [AppButtonComponent],
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
  protected readonly pendingAction = signal<CompanyProfilePendingAction | null>(null);

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

  protected hasPendingAction(): boolean {
    return this.pendingAction() !== null;
  }

  protected pendingActionTitle(): string {
    return this.i18n.t(this.pendingAction() === 'deletePhysical'
      ? 'companyProfileAdministration.deletePhysical.confirmTitle'
      : 'companyProfileAdministration.deactivate.confirmTitle');
  }

  protected pendingActionMessage(): string {
    return this.i18n.t(this.pendingAction() === 'deletePhysical'
      ? 'companyProfileAdministration.deletePhysical.confirmMessage'
      : 'companyProfileAdministration.deactivate.confirmMessage');
  }

  protected pendingActionConfirmKey(): I18nKey {
    return this.pendingAction() === 'deletePhysical'
      ? 'companyProfileAdministration.deletePhysical.confirmAction'
      : 'companyProfileAdministration.deactivate.confirmAction';
  }

  protected pendingActionLoadingKey(): I18nKey {
    return this.pendingAction() === 'deletePhysical'
      ? 'companyProfileAdministration.deletePhysical.processing'
      : 'companyProfileAdministration.lifecycle.deactivate.processing';
  }

  protected triggerActiveAction(): void {
    const detail = this.companyProfile();
    if (!detail || this.actionSaving() || !this.modulePermissions().canUpdate) {
      return;
    }

    if (detail.active) {
      this.pendingAction.set('deactivate');
      return;
    }

    this.toggleCompanyProfile(true);
  }

  protected triggerDeleteAction(): void {
    if (!this.companyProfile() || this.actionSaving() || !this.modulePermissions().canDelete) {
      return;
    }

    this.pendingAction.set('deletePhysical');
  }

  protected cancelPendingAction(): void {
    if (this.actionSaving()) {
      return;
    }

    this.pendingAction.set(null);
  }

  protected confirmPendingAction(): void {
    if (this.pendingAction() === 'deletePhysical') {
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
      { labelKey: 'companyProfileAdministration.fields.phone', value: this.displayValue(detail.phone) }
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
    this.pendingAction.set(null);

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
          this.pendingAction.set(null);
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
          this.pendingAction.set(null);
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
      return this.referenceValue(detail.area);
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
    if (!zipCodeOption?.areaId) {
      return null;
    }

    const provinceOption = this.formOptions()?.areas.find((option) => option.id === zipCodeOption.areaId);
    if (!provinceOption) {
      return null;
    }

    return this.referenceValue(provinceOption as CompanyProfileAdministrationAreaOption);
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
}
