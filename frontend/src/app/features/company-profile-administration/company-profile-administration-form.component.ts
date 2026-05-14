import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize, map } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { EmailFieldComponent } from '../../shared/form-fields/email-field.component';
import { PhoneFieldComponent } from '../../shared/form-fields/phone-field.component';
import { LookupOption, LookupPage, LookupQuery } from '../../shared/lookup/lookup.models';
import { LookupService } from '../../shared/lookup/lookup.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  CompanyProfileAdministrationAreaOption,
  CompanyProfileAdministrationCompanyProfileDetail,
  CompanyProfileAdministrationCompanyProfileTypeOption,
  CompanyProfileAdministrationCreateRequest,
  CompanyProfileAdministrationFormOptions,
  CompanyProfileAdministrationGlobalZipCodeOption,
  CompanyProfileAdministrationRegionOption,
  CompanyProfileAdministrationUpdateRequest
} from './company-profile-administration.models';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

type CompanyProfileAdministrationFormMode = 'create' | 'edit';

@Component({
  selector: 'app-company-profile-administration-form',
  imports: [
    AppButtonComponent,
    AppCheckboxComponent,
    AppInputComponent,
    EmailFieldComponent,
    PhoneFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './company-profile-administration-form.component.html',
  styleUrl: './company-profile-administration-form.component.scss'
})
export class CompanyProfileAdministrationFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly companyProfileAdministrationService = inject(CompanyProfileAdministrationService);
  private readonly lookupService = inject(LookupService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;

  protected readonly mode = signal<CompanyProfileAdministrationFormMode>(this.route.snapshot.paramMap.get('id') ? 'edit' : 'create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly submitted = signal(false);
  protected readonly formOptions = signal<CompanyProfileAdministrationFormOptions | null>(null);
  protected readonly companyProfile = signal<CompanyProfileAdministrationCompanyProfileDetail | null>(null);
  protected readonly platformScope = signal(false);
  private readonly selectedTenantIdSignal = signal('');
  private readonly selectedCountryIdSignal = signal('');
  private readonly selectedRegionIdSignal = signal('');
  private readonly selectedAreaIdSignal = signal('');
  private readonly selectedGlobalZipCodeIdSignal = signal('');
  protected readonly countryPhoneLookup = (query: LookupQuery) =>
    this.lookupService.findCountryLookups(query).pipe(map((page) => this.toCountryPhoneLookupPage(page)));

  protected readonly form = this.formBuilder.group({
    codeLabel: [{ value: '', disabled: true }],
    tenantId: ['', [Validators.required]],
    tenantLabel: [{ value: '', disabled: true }],
    companyProfileTypeId: ['', [Validators.required]],
    legalName: ['', [Validators.required, Validators.maxLength(150)]],
    tradeName: ['', [Validators.required, Validators.maxLength(150)]],
    vatNumber: ['', [Validators.maxLength(50)]],
    taxIdentifier: ['', [Validators.maxLength(50)]],
    taxNumber: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    pecEmail: ['', [Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.required]],
    sdiCode: ['', [Validators.maxLength(50)]],
    countryId: ['', [Validators.required]],
    regionId: [''],
    areaId: [''],
    globalZipCodeId: ['', [Validators.required]],
    cityLabel: [{ value: '', disabled: true }],
    provinceLabel: [{ value: '', disabled: true }],
    street: ['', [Validators.required, Validators.maxLength(150)]],
    streetNumber: ['', [Validators.required, Validators.maxLength(30)]]
  });

  protected readonly filteredCompanyProfileTypes = computed<readonly CompanyProfileAdministrationCompanyProfileTypeOption[]>(() => {
    const tenantId = this.selectedTenantIdSignal();
    return this.formOptions()?.companyProfileTypes.filter((option) => option.tenantId === tenantId) ?? [];
  });
  protected readonly filteredRegions = computed<readonly CompanyProfileAdministrationRegionOption[]>(() => {
    const tenantId = this.selectedTenantIdSignal();
    const countryId = this.selectedCountryIdSignal();
    return this.formOptions()?.regions.filter((option) => option.tenantId === tenantId && option.countryId === countryId) ?? [];
  });
  protected readonly filteredAreas = computed<readonly CompanyProfileAdministrationAreaOption[]>(() => {
    const tenantId = this.selectedTenantIdSignal();
    const countryId = this.selectedCountryIdSignal();
    const regionId = this.selectedRegionIdSignal();
    return (this.formOptions()?.areas ?? []).filter((option) =>
      option.tenantId === tenantId
      && option.countryId === countryId
      && (!regionId || option.regionId === regionId)
    );
  });
  protected readonly filteredGlobalZipCodes = computed<readonly CompanyProfileAdministrationGlobalZipCodeOption[]>(() => {
    const tenantId = this.selectedTenantIdSignal();
    const countryId = this.selectedCountryIdSignal();
    const regionId = this.selectedRegionIdSignal();
    const areaId = this.selectedAreaIdSignal();
    return (this.formOptions()?.globalZipCodes ?? []).filter((option) =>
      (!option.tenantId || option.tenantId === tenantId)
      && option.countryId === countryId
      && (!regionId || !option.regionId || option.regionId === regionId)
      && (!areaId || !option.areaId || option.areaId === areaId)
    );
  });
  protected readonly showRegionField = computed(() =>
    this.filteredRegions().length > 0 || this.selectedRegionIdSignal().trim().length > 0
  );
  protected readonly orderedCountries = computed(() => {
    const countries = [...(this.formOptions()?.countries ?? [])];
    return countries.sort((leftCountry, rightCountry) => {
      const leftWeight = this.countryOrderWeight(leftCountry.code);
      const rightWeight = this.countryOrderWeight(rightCountry.code);
      if (leftWeight !== rightWeight) {
        return leftWeight - rightWeight;
      }

      return leftCountry.name.localeCompare(rightCountry.name, 'it', { sensitivity: 'base' });
    });
  });
  protected readonly showItalianFiscalFields = computed(() => this.isItalianCountryCode(this.selectedCountryCode()));
  protected readonly showForeignFiscalField = computed(() => {
    const countryCode = this.selectedCountryCode().trim();
    return countryCode.length > 0 && !this.isItalianCountryCode(countryCode);
  });

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected titleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'companyProfileAdministration.form.createTitle'
      : 'companyProfileAdministration.form.editTitle';
  }

  protected subtitleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'companyProfileAdministration.form.createSubtitle'
      : 'companyProfileAdministration.form.editSubtitle';
  }

  protected submitLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'companyProfileAdministration.form.actions.create'
      : 'companyProfileAdministration.form.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'companyProfileAdministration.form.actions.creating'
      : 'companyProfileAdministration.form.actions.saving';
  }

  protected canEditTenant(): boolean {
    return this.mode() === 'create' && this.platformScope();
  }

  protected activeValue(): boolean {
    return this.companyProfile()?.active ?? true;
  }

  protected areaLabelKey(): I18nKey {
    return this.selectedCountryCode() === 'IT'
      ? 'companyProfileAdministration.fields.province'
      : 'companyProfileAdministration.fields.area';
  }

  protected submitDisabled(): boolean {
    return this.loading() || this.saving() || this.form.invalid;
  }

  protected goBack(): void {
    if (this.mode() === 'edit' && this.companyProfile()) {
      void this.router.navigate(['/admin/company-profiles', this.companyProfile()?.id]);
      return;
    }

    void this.router.navigate(['/admin/company-profiles']);
  }

  protected retry(): void {
    this.load();
  }

  protected selectTenant(event: Event): void {
    const tenantId = (event.target as HTMLSelectElement).value;
    this.form.controls.tenantId.setValue(tenantId);
    this.form.controls.companyProfileTypeId.setValue('');
    this.form.controls.regionId.setValue('');
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.selectedTenantIdSignal.set(tenantId);
    this.selectedRegionIdSignal.set('');
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
    this.updateTenantLabel();
  }

  protected selectCountry(event: Event): void {
    const countryId = (event.target as HTMLSelectElement).value;
    this.form.controls.countryId.setValue(countryId);
    this.form.controls.regionId.setValue('');
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedCountryIdSignal.set(countryId);
    this.selectedRegionIdSignal.set('');
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
    this.applyCountryDependentValidators(countryId);
  }

  protected selectRegion(event: Event): void {
    const regionId = (event.target as HTMLSelectElement).value;
    this.form.controls.regionId.setValue(regionId);
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.selectedRegionIdSignal.set(regionId);
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
  }

  protected selectArea(event: Event): void {
    const areaId = (event.target as HTMLSelectElement).value;
    this.form.controls.areaId.setValue(areaId);
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.selectedAreaIdSignal.set(areaId);
    this.selectedGlobalZipCodeIdSignal.set('');
  }

  protected selectGlobalZipCode(event: Event): void {
    const globalZipCodeId = (event.target as HTMLSelectElement).value;
    this.form.controls.globalZipCodeId.setValue(globalZipCodeId);
    this.selectedGlobalZipCodeIdSignal.set(globalZipCodeId);
    this.syncAddressFromGlobalZipCode(globalZipCodeId);
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.submitDisabled()) {
      return;
    }

    this.saving.set(true);
    this.saveSubscription?.unsubscribe();

    if (this.mode() === 'create') {
      const payload = this.buildCreatePayload();
      this.saveSubscription = this.companyProfileAdministrationService.createCompanyProfile(payload)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (detail) => {
            this.notificationService.success(this.i18n.t('companyProfileAdministration.feedback.createSuccess'), {
              titleKey: 'alert.title.success'
            });
            void this.router.navigate(['/admin/company-profiles', detail.id]);
          },
          error: (error) => this.notifyApiError(error, 'companyProfileAdministration.errors.create')
        });
      return;
    }

    const detail = this.companyProfile();
    if (!detail) {
      this.saving.set(false);
      return;
    }

    const payload = this.buildUpdatePayload();
    this.saveSubscription = this.companyProfileAdministrationService.updateCompanyProfile(detail.id, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updatedDetail) => {
          this.notificationService.success(this.i18n.t('companyProfileAdministration.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/company-profiles', updatedDetail.id]);
        },
        error: (error) => this.notifyApiError(error, 'companyProfileAdministration.errors.update')
      });
  }

  protected validationMessage(
    controlName:
    | 'tenantId'
    | 'companyProfileTypeId'
    | 'legalName'
    | 'tradeName'
    | 'countryId'
    | 'vatNumber'
    | 'taxIdentifier'
    | 'phone'
    | 'globalZipCodeId'
    | 'street'
    | 'streetNumber'
  ): string {
    if (!this.submitted()) {
      return '';
    }

    const control = this.form.controls[controlName];
    if (controlName === 'phone' && control.hasError('phoneFormat')) {
      return this.i18n.t('companyProfileAdministration.form.validation.phoneFormat');
    }

    if (!control.hasError('required')) {
      return '';
    }

    const keyMap: Record<typeof controlName, I18nKey> = {
      tenantId: 'companyProfileAdministration.form.validation.tenantRequired',
      companyProfileTypeId: 'companyProfileAdministration.form.validation.companyProfileTypeRequired',
      legalName: 'companyProfileAdministration.form.validation.legalNameRequired',
      tradeName: 'companyProfileAdministration.form.validation.tradeNameRequired',
      countryId: 'companyProfileAdministration.form.validation.countryRequired',
      vatNumber: 'companyProfileAdministration.form.validation.vatNumberRequired',
      taxIdentifier: 'companyProfileAdministration.form.validation.taxIdentifierRequired',
      phone: 'companyProfileAdministration.form.validation.phoneNumberRequired',
      globalZipCodeId: 'companyProfileAdministration.form.validation.globalZipCodeRequired',
      street: 'companyProfileAdministration.form.validation.streetRequired',
      streetNumber: 'companyProfileAdministration.form.validation.streetNumberRequired'
    };

    return this.i18n.t(keyMap[controlName]);
  }

  private load(): void {
    const companyProfileId = this.route.snapshot.paramMap.get('id');
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.submitted.set(false);

    if (this.mode() === 'edit' && companyProfileId) {
      this.loadSubscription = forkJoin({
        authenticatedUser: this.authService.loadAuthenticatedUser(),
        formOptions: this.companyProfileAdministrationService.findFormOptions(),
        detail: this.companyProfileAdministrationService.findCompanyProfileById(companyProfileId)
      })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: ({ authenticatedUser, formOptions, detail }) => {
            this.platformScope.set(authenticatedUser.userType.startsWith('PLATFORM_'));
            this.formOptions.set(formOptions);
            this.companyProfile.set(detail);
            this.populateEditForm();
          },
          error: () => {
            this.companyProfile.set(null);
            this.hasError.set(true);
          }
        });
      return;
    }

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser(),
      formOptions: this.companyProfileAdministrationService.findFormOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, formOptions }) => {
          this.platformScope.set(authenticatedUser.userType.startsWith('PLATFORM_'));
          this.formOptions.set(formOptions);
          this.companyProfile.set(null);
          this.populateCreateForm(authenticatedUser.tenantId);
        },
        error: () => {
          this.companyProfile.set(null);
          this.hasError.set(true);
        }
      });
  }

  private populateCreateForm(authenticatedTenantId: string): void {
    const tenantId = this.platformScope() ? '' : authenticatedTenantId;
    this.form.reset({
      codeLabel: this.i18n.t('companyProfileAdministration.form.code.generated'),
      tenantId,
      tenantLabel: this.tenantLabel(tenantId),
      companyProfileTypeId: '',
      legalName: '',
      tradeName: '',
      vatNumber: '',
      taxIdentifier: '',
      taxNumber: '',
      email: '',
      pecEmail: '',
      phone: '',
      sdiCode: '',
      countryId: '',
      regionId: '',
      areaId: '',
      globalZipCodeId: '',
      cityLabel: '',
      provinceLabel: '',
      street: '',
      streetNumber: ''
    });
    this.selectedTenantIdSignal.set(tenantId);
    this.selectedCountryIdSignal.set('');
    this.selectedRegionIdSignal.set('');
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
    this.applyCountryDependentValidators('');

    if (this.platformScope()) {
      this.form.controls.tenantId.enable();
    } else {
      this.form.controls.tenantId.disable();
    }
  }

  private populateEditForm(): void {
    const detail = this.companyProfile();
    if (!detail) {
      return;
    }

    this.form.reset({
      codeLabel: detail.code,
      tenantId: detail.tenant.id,
      tenantLabel: this.referenceValue(detail.tenant),
      companyProfileTypeId: detail.companyProfileType.id,
      legalName: detail.legalName,
      tradeName: detail.tradeName,
      vatNumber: detail.vatNumber ?? '',
      taxIdentifier: detail.taxIdentifier ?? '',
      taxNumber: detail.taxNumber ?? '',
      email: detail.email ?? '',
      pecEmail: detail.pecEmail ?? '',
      phone: detail.phone ?? '',
      sdiCode: detail.sdiCode ?? '',
      countryId: detail.country.id,
      regionId: detail.region?.id ?? '',
      areaId: detail.area?.id ?? '',
      globalZipCodeId: detail.globalZipCode?.id ?? '',
      cityLabel: detail.globalZipCode?.name ?? '',
      provinceLabel: this.provinceLabelForEditDetail(detail),
      street: detail.street,
      streetNumber: detail.streetNumber
    });
    this.selectedTenantIdSignal.set(detail.tenant.id);
    this.selectedCountryIdSignal.set(detail.country.id);
    this.selectedRegionIdSignal.set(detail.region?.id ?? '');
    this.selectedAreaIdSignal.set(detail.area?.id ?? '');
    this.selectedGlobalZipCodeIdSignal.set(detail.globalZipCode?.id ?? '');
    this.applyCountryDependentValidators(detail.country.id);

    this.form.controls.tenantId.disable();
  }

  private updateTenantLabel(): void {
    this.form.controls.tenantLabel.setValue(this.tenantLabel(this.form.controls.tenantId.getRawValue()));
  }

  private tenantLabel(tenantId: string): string {
    const tenant = this.formOptions()?.tenants.find((option) => option.id === tenantId) ?? null;
    return this.referenceValue(tenant);
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

  private buildCreatePayload(): CompanyProfileAdministrationCreateRequest {
    const value = this.form.getRawValue();
    const fiscalValues = this.normalizedFiscalValues();

    return {
      tenantId: value.tenantId,
      companyProfileTypeId: value.companyProfileTypeId,
      legalName: value.legalName.trim(),
      tradeName: value.tradeName.trim(),
      ...fiscalValues,
      email: this.optionalValue(value.email),
      pecEmail: this.optionalValue(value.pecEmail),
      phone: this.optionalValue(value.phone),
      sdiCode: this.optionalValue(value.sdiCode),
      countryId: value.countryId,
      regionId: this.optionalValue(value.regionId),
      areaId: this.optionalValue(value.areaId),
      globalZipCodeId: this.optionalValue(value.globalZipCodeId),
      street: value.street.trim(),
      streetNumber: value.streetNumber.trim()
    };
  }

  private buildUpdatePayload(): CompanyProfileAdministrationUpdateRequest {
    const value = this.form.getRawValue();
    const fiscalValues = this.normalizedFiscalValues();

    return {
      companyProfileTypeId: value.companyProfileTypeId,
      legalName: value.legalName.trim(),
      tradeName: value.tradeName.trim(),
      ...fiscalValues,
      email: this.optionalValue(value.email),
      pecEmail: this.optionalValue(value.pecEmail),
      phone: this.optionalValue(value.phone),
      sdiCode: this.optionalValue(value.sdiCode),
      countryId: value.countryId,
      regionId: this.optionalValue(value.regionId),
      areaId: this.optionalValue(value.areaId),
      globalZipCodeId: this.optionalValue(value.globalZipCodeId),
      street: value.street.trim(),
      streetNumber: value.streetNumber.trim()
    };
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  protected selectedCountryCode(): string {
    const countryId = this.selectedCountryIdSignal();
    return this.formOptions()?.countries.find((country) => country.id === countryId)?.code ?? '';
  }

  private normalizedFiscalValues(): Pick<CompanyProfileAdministrationCreateRequest, 'vatNumber' | 'taxIdentifier' | 'taxNumber'> {
    const value = this.form.getRawValue();
    if (this.isItalianCountryCode(this.selectedCountryCode())) {
      return {
        vatNumber: this.optionalValue(value.vatNumber),
        taxIdentifier: null,
        taxNumber: this.optionalValue(value.taxNumber)
      };
    }

    return {
      vatNumber: null,
      taxIdentifier: this.optionalValue(value.taxIdentifier),
      taxNumber: null
    };
  }

  private isItalianCountryCode(countryCode: string | null | undefined): boolean {
    return countryCode?.trim().toUpperCase() === 'IT';
  }

  private cityLabelForZipCode(globalZipCodeId: string): string {
    return this.filteredGlobalZipCodes().find((option) => option.id === globalZipCodeId)?.name ?? '';
  }

  private provinceLabelForEditDetail(detail: CompanyProfileAdministrationCompanyProfileDetail): string {
    const globalZipCodeId = detail.globalZipCode?.id ?? '';
    if (globalZipCodeId) {
      const provinceFromZip = this.provinceLabelForZipId(globalZipCodeId);
      if (provinceFromZip) {
        return provinceFromZip;
      }
    }

    return detail.area ? this.referenceValue(detail.area) : '';
  }

  private syncAddressFromGlobalZipCode(globalZipCodeId: string): void {
    const zipCodeOption = this.filteredGlobalZipCodes().find((option) => option.id === globalZipCodeId);
    if (!zipCodeOption) {
      this.form.controls.cityLabel.setValue('');
      this.form.controls.provinceLabel.setValue('');
      this.form.controls.regionId.setValue('');
      this.form.controls.areaId.setValue('');
      this.selectedRegionIdSignal.set('');
      this.selectedAreaIdSignal.set('');
      return;
    }

    this.form.controls.cityLabel.setValue(zipCodeOption.name ?? '');
    const regionId = zipCodeOption.regionId ?? '';
    const areaId = zipCodeOption.areaId ?? '';
    this.form.controls.regionId.setValue(regionId);
    this.form.controls.areaId.setValue(areaId);
    this.selectedRegionIdSignal.set(regionId);
    this.selectedAreaIdSignal.set(areaId);
    const provinceLabel = this.provinceLabelForAreaId(areaId) || this.provinceLabelForZipOption(zipCodeOption);
    this.form.controls.provinceLabel.setValue(provinceLabel);
  }

  private provinceLabelForZipId(globalZipCodeId: string): string {
    const zipCodeOption = this.formOptions()?.globalZipCodes.find((option) => option.id === globalZipCodeId);
    if (!zipCodeOption) {
      return '';
    }

    return this.provinceLabelForAreaId(zipCodeOption.areaId ?? '') || this.provinceLabelForZipOption(zipCodeOption);
  }

  private provinceLabelForAreaId(areaId: string): string {
    if (!areaId) {
      return '';
    }

    const areaOption = this.formOptions()?.areas.find((option) => option.id === areaId);
    return areaOption ? this.referenceValue(areaOption) : '';
  }

  private provinceLabelForZipOption(zipCodeOption: CompanyProfileAdministrationGlobalZipCodeOption): string {
    const provinceName = zipCodeOption.provinceName?.trim() ?? '';
    const provinceCode = zipCodeOption.provinceCode?.trim() ?? '';
    if (provinceName && provinceCode) {
      return `${provinceName} (${provinceCode})`;
    }

    return provinceName || provinceCode;
  }

  private countryOrderWeight(countryCode: string): number {
    const normalizedCountryCode = countryCode.trim().toUpperCase();
    if (normalizedCountryCode === 'IT') {
      return 0;
    }

    if (normalizedCountryCode === 'TN') {
      return 1;
    }

    return 2;
  }

  private applyCountryDependentValidators(countryId: string): void {
    const countryCode = this.formOptions()?.countries.find((country) => country.id === countryId)?.code ?? '';
    if (!countryCode.trim()) {
      this.form.controls.vatNumber.setValidators([Validators.maxLength(50)]);
      this.form.controls.taxIdentifier.setValidators([Validators.maxLength(50)]);
      this.form.controls.vatNumber.updateValueAndValidity({ emitEvent: false });
      this.form.controls.taxIdentifier.updateValueAndValidity({ emitEvent: false });
      return;
    }

    const isItalianCountry = this.isItalianCountryCode(countryCode);
    const vatValidators = isItalianCountry
      ? [Validators.required, Validators.maxLength(50)]
      : [Validators.maxLength(50)];
    const taxIdentifierValidators = isItalianCountry
      ? [Validators.maxLength(50)]
      : [Validators.required, Validators.maxLength(50)];

    this.form.controls.vatNumber.setValidators(vatValidators);
    this.form.controls.taxIdentifier.setValidators(taxIdentifierValidators);
    this.form.controls.vatNumber.updateValueAndValidity({ emitEvent: false });
    this.form.controls.taxIdentifier.updateValueAndValidity({ emitEvent: false });
  }

  private notifyApiError(error: unknown, fallbackKey: I18nKey): void {
    this.notificationService.error(this.resolveApiMessage(error, fallbackKey), {
      titleKey: 'alert.title.danger',
      dismissible: true
    });
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }

  private toCountryPhoneLookupPage(page: LookupPage<LookupOption>): LookupPage<LookupOption> {
    return {
      ...page,
      content: page.content
        .map((option) => this.toCountryPhoneLookupOption(option))
        .filter((option): option is LookupOption => option !== null)
    };
  }

  private toCountryPhoneLookupOption(option: LookupOption): LookupOption | null {
    const phoneCode = option.metadata?.['phoneCode']?.trim() ?? '';
    if (!phoneCode) {
      return null;
    }

    return {
      id: phoneCode,
      code: phoneCode,
      name: option.name,
      extraLabel: option.code,
      metadata: {
        ...(option.metadata ?? {}),
        countryId: option.id,
        countryCode: option.code,
        phoneCode
      }
    };
  }
}
