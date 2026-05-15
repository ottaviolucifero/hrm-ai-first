import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize, map, of } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { EmailFieldComponent } from '../../shared/form-fields/email-field.component';
import { PhoneFieldComponent } from '../../shared/form-fields/phone-field.component';
import { PhoneFieldValue } from '../../shared/form-fields/phone-field.models';
import { LookupOption, LookupPage, LookupQuery } from '../../shared/lookup/lookup.models';
import { LookupService } from '../../shared/lookup/lookup.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  CompanyProfileGeographyCreateDialogComponent,
  CompanyProfileGeographyCreateDialogConfig,
  CompanyProfileGeographyCreateSubmitEvent
} from './company-profile-geography-create-dialog.component';
import {
  CompanyProfileAdministrationAreaOption,
  CompanyProfileAdministrationAreaRecord,
  CompanyProfileAdministrationCompanyProfileDetail,
  CompanyProfileAdministrationCompanyProfileTypeOption,
  CompanyProfileAdministrationCreateAreaRequest,
  CompanyProfileAdministrationCreateGlobalZipCodeRequest,
  CompanyProfileAdministrationCreateRequest,
  CompanyProfileAdministrationCreateRegionRequest,
  CompanyProfileAdministrationFormOptions,
  CompanyProfileAdministrationGlobalZipCodeOption,
  CompanyProfileAdministrationGlobalZipCodeRecord,
  CompanyProfileAdministrationRegionOption,
  CompanyProfileAdministrationRegionRecord,
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
    CompanyProfileGeographyCreateDialogComponent,
    LookupSelectComponent,
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
  protected readonly geographyCreateEnabled = signal(false);
  protected readonly geographyDialog = signal<CompanyProfileGeographyCreateDialogConfig | null>(null);
  protected readonly geographyDialogSubmitting = signal(false);
  private readonly selectedTenantIdSignal = signal('');
  private readonly selectedCountryIdSignal = signal('');
  private readonly selectedRegionIdSignal = signal('');
  private readonly selectedAreaIdSignal = signal('');
  private readonly selectedGlobalZipCodeIdSignal = signal('');
  protected readonly countryPhoneLookup = (query: LookupQuery) =>
    this.lookupService.findCountryLookups(query).pipe(map((page) => this.toCountryPhoneLookupPage(page)));
  protected readonly zipCodeLookup = (query: LookupQuery) => {
    const countryId = this.selectedCountryIdSignal().trim();
    if (!countryId) {
      return of(this.emptyLookupPage(query));
    }

    return this.lookupService.findZipCodeLookups(query, this.optionalValue(this.selectedTenantIdSignal()), {
      countryId,
      regionId: this.optionalValue(this.selectedRegionIdSignal()),
      areaId: this.optionalValue(this.selectedAreaIdSignal())
    });
  };

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
    phone: this.formBuilder.control<PhoneFieldValue>(this.emptyPhoneValue()),
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
  protected readonly selectedGlobalZipCodeInitialOption = computed<LookupOption | null>(() => {
    const globalZipCodeId = this.selectedGlobalZipCodeIdSignal();
    if (!globalZipCodeId) {
      return null;
    }

    const zipCode = this.formOptions()?.globalZipCodes.find((option) => option.id === globalZipCodeId) ?? null;
    return zipCode ? this.toZipLookupOption(zipCode) : null;
  });
  protected readonly selectedRegionInitialOption = computed<LookupOption | null>(() => {
    const regionId = this.selectedRegionIdSignal();
    if (!regionId) {
      return null;
    }

    const region = this.filteredRegions().find((option) => option.id === regionId) ?? null;
    return region ? this.toRegionLookupOption(region) : null;
  });
  protected readonly selectedAreaInitialOption = computed<LookupOption | null>(() => {
    const areaId = this.selectedAreaIdSignal();
    if (!areaId) {
      return null;
    }

    const area = this.filteredAreas().find((option) => option.id === areaId) ?? null;
    return area ? this.toAreaLookupOption(area) : null;
  });
  protected readonly regionLookupOptions = computed<readonly LookupOption[]>(() =>
    this.filteredRegions().map((option) => this.toRegionLookupOption(option))
  );
  protected readonly areaLookupOptions = computed<readonly LookupOption[]>(() =>
    this.filteredAreas().map((option) => this.toAreaLookupOption(option))
  );
  protected readonly isForeignCountrySelected = computed(() => {
    const countryCode = this.selectedCountryCode().trim();
    return countryCode.length > 0 && !this.isItalianCountryCode(countryCode);
  });
  protected readonly showItalianProvinceField = computed(() => !this.isForeignCountrySelected());
  protected readonly canCreateRegion = computed(() =>
    this.geographyCreateEnabled()
    && this.isForeignCountrySelected()
    && this.selectedTenantIdSignal().trim().length > 0
    && this.selectedCountryIdSignal().trim().length > 0
  );
  protected readonly canCreateArea = computed(() =>
    this.canCreateRegion()
    && this.selectedRegionIdSignal().trim().length > 0
  );
  protected readonly canCreateZipCode = computed(() =>
    this.canCreateArea()
    && this.selectedAreaIdSignal().trim().length > 0
  );
  protected readonly hasSelectedRegion = computed(() => this.selectedRegionIdSignal().trim().length > 0);
  protected readonly zipLookupDisabled = computed(() =>
    !this.selectedCountryIdSignal().trim()
    || (this.isForeignCountrySelected() && !this.selectedAreaIdSignal().trim())
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
  protected readonly tenantLookupOptions = computed<readonly LookupOption[]>(() =>
    (this.formOptions()?.tenants ?? []).map((tenant) => ({
      id: tenant.id,
      code: tenant.code,
      name: tenant.name
    })));
  protected readonly companyProfileTypeLookupOptions = computed<readonly LookupOption[]>(() =>
    this.filteredCompanyProfileTypes().map((type) => ({
      id: type.id,
      code: type.code,
      name: type.name
    })));
  protected readonly countryLookupOptions = computed<readonly LookupOption[]>(() =>
    this.orderedCountries().map((country) => ({
      id: country.id,
      code: country.code,
      name: country.name
    })));
  protected readonly tenantLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly tenantLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly companyProfileTypeClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly companyProfileTypeOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly countryLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly countryLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
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

  protected selectTenant(value: string | Event): void {
    const tenantId = this.lookupValue(value);
    this.form.controls.tenantId.setValue(tenantId);
    this.form.controls.companyProfileTypeId.setValue('');
    this.form.controls.regionId.setValue('');
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedTenantIdSignal.set(tenantId);
    this.selectedRegionIdSignal.set('');
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
    this.updateTenantLabel();
  }

  protected selectCountry(value: string | Event): void {
    const countryId = this.lookupValue(value);
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

  protected selectRegionOption(option: LookupOption | null): void {
    const regionId = option?.id ?? '';
    this.form.controls.regionId.setValue(regionId);
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedRegionIdSignal.set(regionId);
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
  }

  protected selectAreaOption(option: LookupOption | null): void {
    const areaId = option?.id ?? '';
    this.form.controls.areaId.setValue(areaId);
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedAreaIdSignal.set(areaId);
    this.selectedGlobalZipCodeIdSignal.set('');
  }

  protected selectGlobalZipCodeOption(option: LookupOption | null): void {
    if (!option) {
      this.form.controls.globalZipCodeId.setValue('');
      this.selectedGlobalZipCodeIdSignal.set('');
      this.form.controls.cityLabel.setValue('');
      this.form.controls.provinceLabel.setValue('');
      return;
    }

    this.form.controls.globalZipCodeId.setValue(option.id);
    this.selectedGlobalZipCodeIdSignal.set(option.id);
    this.syncAddressFromGlobalZipCodeOption(this.toZipCodeOption(option));
  }

  protected openRegionCreateDialog(): void {
    if (!this.canCreateRegion()) {
      return;
    }

    this.geographyDialog.set({
      mode: 'region',
      countryName: this.selectedCountryLabel(),
      areaLabel: this.i18n.t(this.areaLabelKey())
    });
  }

  protected openAreaCreateDialog(): void {
    if (!this.canCreateArea()) {
      return;
    }

    this.geographyDialog.set({
      mode: 'area',
      countryName: this.selectedCountryLabel(),
      regionName: this.selectedRegionLabel(),
      areaLabel: this.i18n.t(this.areaLabelKey())
    });
  }

  protected openZipCreateDialog(): void {
    if (!this.canCreateZipCode()) {
      return;
    }

    this.geographyDialog.set({
      mode: 'zip',
      countryName: this.selectedCountryLabel(),
      regionName: this.selectedRegionLabel(),
      areaName: this.selectedAreaLabel(),
      areaLabel: this.i18n.t(this.areaLabelKey())
    });
  }

  protected closeGeographyDialog(): void {
    if (this.geographyDialogSubmitting()) {
      return;
    }

    this.geographyDialog.set(null);
  }

  protected submitGeographyCreateDialog(event: CompanyProfileGeographyCreateSubmitEvent): void {
    const tenantId = this.selectedTenantIdSignal().trim();
    const countryId = this.selectedCountryIdSignal().trim();
    if (!tenantId || !countryId) {
      return;
    }

    this.geographyDialogSubmitting.set(true);

    if (event.mode === 'region') {
      const payload: CompanyProfileAdministrationCreateRegionRequest = {
        tenantId,
        countryId,
        name: event.name,
        active: true
      };
      this.companyProfileAdministrationService.createRegion(payload)
        .pipe(finalize(() => this.geographyDialogSubmitting.set(false)))
        .subscribe({
          next: (region) => this.handleCreatedRegion(region),
          error: (error) => this.notifyApiError(error, 'companyProfileAdministration.geography.errors.createRegion')
        });
      return;
    }

    const regionId = this.selectedRegionIdSignal().trim();
    if (event.mode === 'area') {
      if (!regionId) {
        this.geographyDialogSubmitting.set(false);
        return;
      }

      const payload: CompanyProfileAdministrationCreateAreaRequest = {
        tenantId,
        countryId,
        regionId,
        name: event.name,
        active: true
      };
      this.companyProfileAdministrationService.createArea(payload)
        .pipe(finalize(() => this.geographyDialogSubmitting.set(false)))
        .subscribe({
          next: (area) => this.handleCreatedArea(area),
          error: (error) => this.notifyApiError(error, 'companyProfileAdministration.geography.errors.createArea')
        });
      return;
    }

    const areaId = this.selectedAreaIdSignal().trim();
    if (!regionId || !areaId) {
      this.geographyDialogSubmitting.set(false);
      return;
    }

    const payload: CompanyProfileAdministrationCreateGlobalZipCodeRequest = {
      tenantId,
      countryId,
      regionId,
      areaId,
      city: event.city,
      postalCode: event.postalCode,
      sourceType: 'MANUAL',
      active: true
    };
    this.companyProfileAdministrationService.createGlobalZipCode(payload)
      .pipe(finalize(() => this.geographyDialogSubmitting.set(false)))
      .subscribe({
        next: (zipCode) => this.handleCreatedZipCode(zipCode),
        error: (error) => this.notifyApiError(error, 'companyProfileAdministration.geography.errors.createZip')
      });
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
    | 'regionId'
    | 'areaId'
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
      regionId: 'companyProfileAdministration.form.validation.regionRequired',
      areaId: 'companyProfileAdministration.form.validation.areaRequired',
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
            this.geographyCreateEnabled.set(this.hasMasterDataCreatePermission(authenticatedUser));
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
          this.geographyCreateEnabled.set(this.hasMasterDataCreatePermission(authenticatedUser));
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
      phone: this.emptyPhoneValue(),
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
      phone: this.detailPhoneValue(detail),
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
      phoneDialCode: this.optionalValue(value.phone.dialCode),
      phoneNationalNumber: this.optionalValue(value.phone.nationalNumber),
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
      phoneDialCode: this.optionalValue(value.phone.dialCode),
      phoneNationalNumber: this.optionalValue(value.phone.nationalNumber),
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

  private emptyPhoneValue(): PhoneFieldValue {
    return {
      dialCode: null,
      nationalNumber: null,
      fullNumber: null
    };
  }

  private detailPhoneValue(detail: CompanyProfileAdministrationCompanyProfileDetail): PhoneFieldValue {
    const phoneDialCode = this.optionalValue(detail.phoneDialCode);
    const phoneNationalNumber = this.optionalValue(detail.phoneNationalNumber);
    if (phoneDialCode || phoneNationalNumber) {
      return {
        dialCode: phoneDialCode,
        nationalNumber: phoneNationalNumber,
        fullNumber: this.composePhone(phoneDialCode, phoneNationalNumber)
      };
    }

    return this.legacyPhoneValue(detail.phone);
  }

  private legacyPhoneValue(legacyPhone: string | null | undefined): PhoneFieldValue {
    const normalizedLegacyPhone = this.optionalValue(legacyPhone);
    if (!normalizedLegacyPhone) {
      return this.emptyPhoneValue();
    }

    const phoneMatch = normalizedLegacyPhone.match(/^(\+\d+)\s+(.+)$/);
    if (!phoneMatch) {
      return {
        dialCode: null,
        nationalNumber: normalizedLegacyPhone,
        fullNumber: normalizedLegacyPhone
      };
    }

    const phoneDialCode = this.optionalValue(phoneMatch[1]);
    const phoneNationalNumber = this.optionalValue(phoneMatch[2]);
    return {
      dialCode: phoneDialCode,
      nationalNumber: phoneNationalNumber,
      fullNumber: this.composePhone(phoneDialCode, phoneNationalNumber)
    };
  }

  private composePhone(phoneDialCode: string | null, phoneNationalNumber: string | null): string | null {
    const normalizedPhoneNationalNumber = this.optionalValue(phoneNationalNumber);
    if (!normalizedPhoneNationalNumber) {
      return null;
    }

    const normalizedPhoneDialCode = this.optionalValue(phoneDialCode);
    return normalizedPhoneDialCode
      ? `${normalizedPhoneDialCode} ${normalizedPhoneNationalNumber}`
      : normalizedPhoneNationalNumber;
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

  private selectedCountryLabel(): string {
    const country = this.formOptions()?.countries.find((option) => option.id === this.selectedCountryIdSignal()) ?? null;
    return this.referenceValue(country);
  }

  private selectedRegionLabel(): string {
    const region = this.filteredRegions().find((option) => option.id === this.selectedRegionIdSignal()) ?? null;
    return this.referenceValue(region);
  }

  private selectedAreaLabel(): string {
    const area = this.filteredAreas().find((option) => option.id === this.selectedAreaIdSignal()) ?? null;
    return this.referenceValue(area);
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
    this.syncAddressFromGlobalZipCodeOption(zipCodeOption);
  }

  private syncAddressFromGlobalZipCodeOption(zipCodeOption: CompanyProfileAdministrationGlobalZipCodeOption): void {
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
    const areaName = zipCodeOption.areaName?.trim() ?? '';
    const areaCode = zipCodeOption.areaCode?.trim() ?? '';
    if (areaName && areaCode) {
      return `${areaName} (${areaCode})`;
    }
    if (areaName || areaCode) {
      return areaName || areaCode;
    }

    const provinceName = zipCodeOption.provinceName?.trim() ?? '';
    const provinceCode = zipCodeOption.provinceCode?.trim() ?? '';
    if (provinceName && provinceCode) {
      return `${provinceName} (${provinceCode})`;
    }

    return provinceName || provinceCode;
  }

  private toZipCodeOption(option: LookupOption): CompanyProfileAdministrationGlobalZipCodeOption {
    const metadata = option.metadata ?? {};
    return {
      id: option.id,
      code: option.code,
      name: option.name,
      tenantId: metadata['tenantId'] ?? null,
      countryId: metadata['countryId'] ?? '',
      countryName: metadata['countryName'] ?? null,
      regionId: metadata['regionId'] ?? null,
      regionName: metadata['regionName'] ?? null,
      areaId: metadata['areaId'] ?? null,
      areaCode: metadata['areaCode'] ?? null,
      areaName: metadata['areaName'] ?? null,
      provinceName: metadata['provinceName'] ?? null,
      provinceCode: metadata['provinceCode'] ?? null
    };
  }

  private toZipLookupOption(zipCode: CompanyProfileAdministrationGlobalZipCodeOption): LookupOption {
    return {
      id: zipCode.id,
      code: zipCode.code,
      name: zipCode.name,
      extraLabel: this.provinceLabelForZipOption(zipCode),
      metadata: {
        tenantId: zipCode.tenantId ?? '',
        countryId: zipCode.countryId,
        countryName: zipCode.countryName ?? '',
        regionId: zipCode.regionId ?? '',
        regionName: zipCode.regionName ?? '',
        areaId: zipCode.areaId ?? '',
        areaCode: zipCode.areaCode ?? '',
        areaName: zipCode.areaName ?? '',
        provinceName: zipCode.provinceName ?? '',
        provinceCode: zipCode.provinceCode ?? ''
      }
    };
  }

  private emptyLookupPage(query: LookupQuery): LookupPage<LookupOption> {
    return {
      content: [],
      page: query.page,
      size: query.size,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    };
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
      this.form.controls.regionId.setValidators([]);
      this.form.controls.areaId.setValidators([]);
      this.form.controls.vatNumber.updateValueAndValidity({ emitEvent: false });
      this.form.controls.taxIdentifier.updateValueAndValidity({ emitEvent: false });
      this.form.controls.regionId.updateValueAndValidity({ emitEvent: false });
      this.form.controls.areaId.updateValueAndValidity({ emitEvent: false });
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
    this.form.controls.regionId.setValidators(isItalianCountry ? [] : [Validators.required]);
    this.form.controls.areaId.setValidators(isItalianCountry ? [] : [Validators.required]);
    this.form.controls.vatNumber.updateValueAndValidity({ emitEvent: false });
    this.form.controls.taxIdentifier.updateValueAndValidity({ emitEvent: false });
    this.form.controls.regionId.updateValueAndValidity({ emitEvent: false });
    this.form.controls.areaId.updateValueAndValidity({ emitEvent: false });
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

  private lookupValue(value: string | Event): string {
    if (typeof value === 'string') {
      return value;
    }

    return (value.target as HTMLSelectElement).value;
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

  private toRegionLookupOption(region: CompanyProfileAdministrationRegionOption): LookupOption {
    return {
      id: region.id,
      code: region.code,
      name: region.name,
      extraLabel: null,
      metadata: {
        tenantId: region.tenantId,
        countryId: region.countryId
      }
    };
  }

  private toAreaLookupOption(area: CompanyProfileAdministrationAreaOption): LookupOption {
    return {
      id: area.id,
      code: area.code,
      name: area.name,
      extraLabel: null,
      metadata: {
        tenantId: area.tenantId,
        countryId: area.countryId,
        regionId: area.regionId
      }
    };
  }

  private handleCreatedRegion(region: CompanyProfileAdministrationRegionRecord): void {
    const nextRegion: CompanyProfileAdministrationRegionOption = {
      id: region.id,
      tenantId: region.tenantId,
      countryId: region.country.id,
      code: region.code,
      name: region.name
    };
    this.updateFormOptions((formOptions) => ({
      ...formOptions,
      regions: this.sortByCode([...formOptions.regions.filter((option) => option.id !== nextRegion.id), nextRegion])
    }));
    this.form.controls.regionId.setValue(nextRegion.id);
    this.form.controls.areaId.setValue('');
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedRegionIdSignal.set(nextRegion.id);
    this.selectedAreaIdSignal.set('');
    this.selectedGlobalZipCodeIdSignal.set('');
    this.notificationService.success(this.i18n.t('companyProfileAdministration.geography.feedback.regionCreated'), {
      titleKey: 'alert.title.success'
    });
    this.geographyDialog.set(null);
  }

  private handleCreatedArea(area: CompanyProfileAdministrationAreaRecord): void {
    const nextArea: CompanyProfileAdministrationAreaOption = {
      id: area.id,
      tenantId: area.tenantId,
      countryId: area.country.id,
      regionId: area.region.id,
      code: area.code,
      name: area.name
    };
    this.updateFormOptions((formOptions) => ({
      ...formOptions,
      areas: this.sortByCode([...formOptions.areas.filter((option) => option.id !== nextArea.id), nextArea])
    }));
    this.form.controls.areaId.setValue(nextArea.id);
    this.form.controls.globalZipCodeId.setValue('');
    this.form.controls.cityLabel.setValue('');
    this.form.controls.provinceLabel.setValue('');
    this.selectedAreaIdSignal.set(nextArea.id);
    this.selectedGlobalZipCodeIdSignal.set('');
    this.notificationService.success(this.i18n.t('companyProfileAdministration.geography.feedback.areaCreated'), {
      titleKey: 'alert.title.success'
    });
    this.geographyDialog.set(null);
  }

  private handleCreatedZipCode(zipCode: CompanyProfileAdministrationGlobalZipCodeRecord): void {
    const nextZipCode: CompanyProfileAdministrationGlobalZipCodeOption = {
      id: zipCode.id,
      tenantId: zipCode.tenantId,
      countryId: zipCode.country.id,
      countryName: zipCode.country.name,
      regionId: zipCode.region?.id ?? null,
      regionName: zipCode.region?.name ?? null,
      areaId: zipCode.area?.id ?? null,
      areaCode: zipCode.area?.code ?? null,
      areaName: zipCode.area?.name ?? null,
      code: zipCode.postalCode,
      name: zipCode.city,
      provinceCode: zipCode.provinceCode,
      provinceName: zipCode.provinceName
    };
    this.updateFormOptions((formOptions) => ({
      ...formOptions,
      globalZipCodes: this.sortZipCodes([...formOptions.globalZipCodes.filter((option) => option.id !== nextZipCode.id), nextZipCode])
    }));
    this.form.controls.globalZipCodeId.setValue(nextZipCode.id);
    this.selectedGlobalZipCodeIdSignal.set(nextZipCode.id);
    this.syncAddressFromGlobalZipCodeOption(nextZipCode);
    this.notificationService.success(this.i18n.t('companyProfileAdministration.geography.feedback.zipCreated'), {
      titleKey: 'alert.title.success'
    });
    this.geographyDialog.set(null);
  }

  private updateFormOptions(
    updater: (formOptions: CompanyProfileAdministrationFormOptions) => CompanyProfileAdministrationFormOptions
  ): void {
    const currentFormOptions = this.formOptions();
    if (!currentFormOptions) {
      return;
    }

    this.formOptions.set(updater(currentFormOptions));
  }

  private sortByCode<T extends { code: string }>(options: readonly T[]): readonly T[] {
    return [...options].sort((leftOption, rightOption) =>
      leftOption.code.localeCompare(rightOption.code, 'it', { sensitivity: 'base' })
    );
  }

  private sortZipCodes(options: readonly CompanyProfileAdministrationGlobalZipCodeOption[]): readonly CompanyProfileAdministrationGlobalZipCodeOption[] {
    return [...options].sort((leftOption, rightOption) => {
      const postalCodeComparison = leftOption.code.localeCompare(rightOption.code, 'it', { sensitivity: 'base' });
      if (postalCodeComparison !== 0) {
        return postalCodeComparison;
      }

      return leftOption.name.localeCompare(rightOption.name, 'it', { sensitivity: 'base' });
    });
  }

  private hasMasterDataCreatePermission(user: { permissions?: readonly string[]; authorities?: readonly string[] } | null): boolean {
    const normalizedCodes = [
      ...(user?.permissions ?? []),
      ...(user?.authorities ?? [])
    ].map((code) => code.trim().toUpperCase());

    return normalizedCodes.includes('TENANT.MASTER_DATA.CREATE')
      || normalizedCodes.includes('TENANT.MASTER_DATA.MANAGE')
      || normalizedCodes.includes('PLATFORM.MASTER_DATA.CREATE')
      || normalizedCodes.includes('PLATFORM.MASTER_DATA.MANAGE');
  }
}
