import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, map, of, Subscription, switchMap, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthenticatedUser } from '../../core/auth/auth.models';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { CompanyProfileAdministrationCompanyProfileListItem, CompanyProfileAdministrationQuery } from '../company-profile-administration/company-profile-administration.models';
import { CompanyProfileAdministrationService } from '../company-profile-administration/company-profile-administration.service';
import { TenantAdministrationQuery, TenantAdministrationTenantListItem } from '../tenant-administration/tenant-administration.models';
import { TenantAdministrationService } from '../tenant-administration/tenant-administration.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption, LookupQuery } from '../../shared/lookup/lookup.models';
import { LookupService } from '../../shared/lookup/lookup.service';
import {
  HolidayCalendarAdministrationCalendarCreateRequest,
  HolidayCalendarAdministrationCalendarDetail,
  HolidayCalendarAdministrationCalendarUpdateRequest,
  HolidayCalendarScope
} from './holiday-calendar-administration.models';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

type HolidayCalendarAdministrationFormMode = 'create' | 'edit';

const TENANT_LOOKUP_QUERY: TenantAdministrationQuery = { page: 0, size: 100 };
const COMPANY_PROFILE_LOOKUP_QUERY: CompanyProfileAdministrationQuery = { page: 0, size: 100 };

function yearRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const normalizedValue = String(control.value ?? '').trim();
    if (!normalizedValue) {
      return null;
    }

    const parsedYear = Number(normalizedValue);
    if (!Number.isFinite(parsedYear) || parsedYear < 1900 || parsedYear > 9999) {
      return { invalidYearRange: true };
    }

    return null;
  };
}

function calendarScopeValidator(platformScope: () => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const scope = String(control.get('scope')?.value ?? '').trim() as HolidayCalendarScope | '';
    const tenantId = String(control.get('tenantId')?.value ?? '').trim();
    const companyProfileId = String(control.get('companyProfileId')?.value ?? '').trim();

    if (!scope) {
      return { scopeRequired: true };
    }

    if (!platformScope() && scope === 'GLOBAL') {
      return { globalScopeForbidden: true };
    }

    if (scope === 'GLOBAL') {
      if (tenantId || companyProfileId) {
        return { invalidGlobalContext: true };
      }
      return null;
    }

    if (!tenantId) {
      return { tenantRequired: true };
    }

    if (scope === 'TENANT') {
      return companyProfileId ? { invalidTenantContext: true } : null;
    }

    if (!companyProfileId) {
      return { companyProfileRequired: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-holiday-calendar-administration-form',
  imports: [
    AppButtonComponent,
    AppCheckboxComponent,
    AppInputComponent,
    LookupSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './holiday-calendar-administration-form.component.html',
  styleUrl: './holiday-calendar-administration-form.component.scss'
})
export class HolidayCalendarAdministrationFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly holidayCalendarAdministrationService = inject(HolidayCalendarAdministrationService);
  private readonly lookupService = inject(LookupService);
  private readonly tenantAdministrationService = inject(TenantAdministrationService);
  private readonly companyProfileAdministrationService = inject(CompanyProfileAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private companyProfilesSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private authenticatedUser: AuthenticatedUser | null = null;

  protected readonly mode = signal<HolidayCalendarAdministrationFormMode>(this.route.snapshot.paramMap.get('id') ? 'edit' : 'create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly submitted = signal(false);
  protected readonly platformScope = signal(false);
  protected readonly currentTenantId = signal('');
  protected readonly currentTenantLabel = signal('');
  protected readonly calendar = signal<HolidayCalendarAdministrationCalendarDetail | null>(null);
  protected readonly tenantOptions = signal<readonly LookupOption[]>([]);
  protected readonly companyProfileOptions = signal<readonly LookupOption[]>([]);
  protected readonly tenantsUnavailable = signal(false);
  protected readonly companyProfilesLoading = signal(false);
  protected readonly companyProfilesUnavailable = signal(false);
  protected readonly activeValue = computed(() => this.calendar()?.active ?? true);
  protected readonly scopeOptions = computed<readonly LookupOption[]>(() => {
    this.i18n.language();
    const baseOptions: LookupOption[] = [];

    if (this.platformScope()) {
      baseOptions.push({
        id: 'GLOBAL',
        code: 'GLOBAL',
        name: this.i18n.t('holidayCalendar.scope.global')
      });
    }

    baseOptions.push(
      {
        id: 'TENANT',
        code: 'TENANT',
        name: this.i18n.t('holidayCalendar.scope.tenant')
      },
      {
        id: 'COMPANY_PROFILE',
        code: 'COMPANY_PROFILE',
        name: this.i18n.t('holidayCalendar.scope.companyProfile')
      }
    );

    return baseOptions;
  });
  protected readonly countryLookup = (query: LookupQuery) => this.lookupService.findCountryLookups(query);
  protected readonly referenceLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly referenceLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    countryId: ['', [Validators.required]],
    year: ['', [Validators.required, Validators.pattern(/^\d{4}$/), yearRangeValidator()]],
    scope: ['' as HolidayCalendarScope | '', [Validators.required]],
    tenantId: [''],
    tenantLabel: [{ value: '', disabled: true }],
    companyProfileId: ['']
  }, {
    validators: calendarScopeValidator(() => this.platformScope())
  });

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.companyProfilesSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected titleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'holidayCalendar.form.createTitle'
      : 'holidayCalendar.form.editTitle';
  }

  protected subtitleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'holidayCalendar.form.createSubtitle'
      : 'holidayCalendar.form.editSubtitle';
  }

  protected submitLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'holidayCalendar.form.actions.create'
      : 'holidayCalendar.form.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'holidayCalendar.form.actions.creating'
      : 'holidayCalendar.form.actions.saving';
  }

  protected canEditTenant(): boolean {
    return this.platformScope();
  }

  protected showsTenantField(): boolean {
    return this.selectedScope() !== 'GLOBAL';
  }

  protected showsCompanyProfileField(): boolean {
    return this.selectedScope() === 'COMPANY_PROFILE';
  }

  protected submitDisabled(): boolean {
    return this.loading() || this.saving() || this.form.invalid;
  }

  protected goBack(): void {
    const detail = this.calendar();
    if (this.mode() === 'edit' && detail) {
      void this.router.navigate(['/admin/holiday-calendars', detail.id]);
      return;
    }

    void this.router.navigate(['/admin/holiday-calendars']);
  }

  protected retry(): void {
    this.load();
  }

  protected selectScope(value: string | Event): void {
    const scope = this.lookupValue(value) as HolidayCalendarScope | '';
    this.form.controls.scope.setValue(scope);
    this.form.controls.companyProfileId.setValue('');

    if (scope === 'GLOBAL') {
      this.form.controls.tenantId.setValue('');
      this.form.controls.tenantLabel.setValue('');
      this.companyProfileOptions.set([]);
      this.companyProfilesUnavailable.set(false);
      this.form.updateValueAndValidity({ emitEvent: false });
      return;
    }

    if (!this.platformScope()) {
      const tenantId = this.currentTenantId();
      this.form.controls.tenantId.setValue(tenantId);
      this.form.controls.tenantLabel.setValue(this.currentTenantLabel());
      this.loadCompanyProfilesForTenant(tenantId);
      this.form.updateValueAndValidity({ emitEvent: false });
      return;
    }

    const tenantId = this.form.controls.tenantId.getRawValue().trim();
    if (tenantId) {
      this.loadCompanyProfilesForTenant(tenantId);
    } else {
      this.companyProfileOptions.set([]);
    }
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  protected selectTenant(value: string | Event): void {
    const tenantId = this.lookupValue(value);
    this.form.controls.tenantId.setValue(tenantId);
    this.form.controls.companyProfileId.setValue('');
    this.form.controls.tenantLabel.setValue(this.referenceLabel(this.tenantOptions(), tenantId));

    if (tenantId && this.selectedScope() !== 'GLOBAL') {
      this.loadCompanyProfilesForTenant(tenantId);
    } else {
      this.companyProfileOptions.set([]);
      this.companyProfilesUnavailable.set(false);
    }

    this.form.updateValueAndValidity({ emitEvent: false });
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
      this.saveSubscription = this.holidayCalendarAdministrationService.createHolidayCalendar(this.buildCreatePayload())
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (calendar) => {
            this.notificationService.success(this.i18n.t('holidayCalendar.feedback.createSuccess'), {
              titleKey: 'alert.title.success'
            });
            void this.router.navigate(['/admin/holiday-calendars', calendar.id]);
          },
          error: (error) => this.notifyApiError(error, 'holidayCalendar.errors.create', {
            400: 'holidayCalendar.errors.invalidForm',
            404: 'holidayCalendar.errors.referenceNotFound',
            409: 'holidayCalendar.errors.duplicate'
          })
        });
      return;
    }

    const detail = this.calendar();
    if (!detail) {
      this.saving.set(false);
      return;
    }

    this.saveSubscription = this.holidayCalendarAdministrationService.updateHolidayCalendar(detail.id, this.buildUpdatePayload())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (calendar) => {
          this.notificationService.success(this.i18n.t('holidayCalendar.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/holiday-calendars', calendar.id]);
        },
        error: (error) => this.notifyApiError(error, 'holidayCalendar.errors.update', {
          400: 'holidayCalendar.errors.invalidForm',
          404: 'holidayCalendar.errors.referenceNotFound',
          409: 'holidayCalendar.errors.duplicate'
        })
      });
  }

  protected validationMessage(controlName: 'name' | 'countryId' | 'year' | 'scope' | 'tenantId' | 'companyProfileId'): string {
    const control = this.form.controls[controlName];
    if (!(this.submitted() || control.touched)) {
      return '';
    }

    if (control.hasError('required')) {
      return this.i18n.t('holidayCalendar.form.validation.required');
    }

    if (control.hasError('maxlength')) {
      return this.i18n.t('holidayCalendar.form.validation.maxLength');
    }

    if (controlName === 'year') {
      if (control.hasError('pattern')) {
        return this.i18n.t('holidayCalendar.form.validation.yearFormat');
      }
      if (control.hasError('invalidYearRange')) {
        return this.i18n.t('holidayCalendar.form.validation.yearRange');
      }
    }

    if (controlName === 'scope' && this.form.hasError('globalScopeForbidden')) {
      return this.i18n.t('holidayCalendar.form.validation.globalScopeForbidden');
    }

    if (controlName === 'tenantId') {
      if (this.form.hasError('tenantRequired')) {
        return this.i18n.t('holidayCalendar.form.validation.tenantRequired');
      }
      if (this.form.hasError('invalidTenantContext') || this.form.hasError('invalidGlobalContext')) {
        return this.i18n.t('holidayCalendar.form.validation.invalidScopeContext');
      }
    }

    if (controlName === 'companyProfileId') {
      if (this.form.hasError('companyProfileRequired')) {
        return this.i18n.t('holidayCalendar.form.validation.companyProfileRequired');
      }
      if (this.form.hasError('invalidGlobalContext') || this.form.hasError('invalidTenantContext')) {
        return this.i18n.t('holidayCalendar.form.validation.invalidScopeContext');
      }
    }

    return '';
  }

  protected tenantHelpText(): string {
    if (!this.platformScope()) {
      return this.i18n.t('holidayCalendar.form.tenantCurrent');
    }

    if (this.tenantsUnavailable()) {
      return this.i18n.t('holidayCalendar.form.tenantLookupUnavailable');
    }

    return '';
  }

  protected companyProfileHelpText(): string {
    if (this.companyProfilesLoading()) {
      return this.i18n.t('holidayCalendar.form.companyProfileLoading');
    }

    if (this.companyProfilesUnavailable()) {
      return this.i18n.t('holidayCalendar.form.companyProfileLookupUnavailable');
    }

    return this.i18n.t('holidayCalendar.form.companyProfileHint');
  }

  protected scopeHelpText(): string {
    return this.i18n.t('holidayCalendar.form.scopeHelp');
  }

  protected selectedCountryInitialOption(): LookupOption | null {
    const selectedCountryId = this.form.controls.countryId.getRawValue().trim();
    const country = this.calendar()?.country;

    if (!selectedCountryId || !country || country.id !== selectedCountryId) {
      return null;
    }

    return {
      id: country.id,
      code: country.code,
      name: country.name
    };
  }

  private load(): void {
    const calendarId = this.route.snapshot.paramMap.get('id');
    this.loadSubscription?.unsubscribe();
    this.companyProfilesSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.submitted.set(false);
    this.tenantsUnavailable.set(false);
    this.companyProfilesUnavailable.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((authenticatedUser) => {
          this.authenticatedUser = authenticatedUser;
          const isPlatformScope = authenticatedUser.userType.startsWith('PLATFORM_');
          this.platformScope.set(isPlatformScope);
          this.currentTenantId.set(authenticatedUser.tenantId);

          return forkJoin({
            tenantOptions: isPlatformScope ? this.loadTenantOptions() : of<readonly LookupOption[]>([]),
            detail: calendarId
              ? this.holidayCalendarAdministrationService.findHolidayCalendarById(calendarId)
              : of<HolidayCalendarAdministrationCalendarDetail | null>(null)
          }).pipe(
            switchMap(({ tenantOptions, detail }) => {
              this.tenantOptions.set(tenantOptions);
              this.calendar.set(detail);

              const tenantIdForProfiles = detail?.tenant?.id
                ?? (isPlatformScope ? '' : authenticatedUser.tenantId);

              this.currentTenantLabel.set(detail?.tenant
                ? this.referenceValue(detail.tenant)
                : (isPlatformScope ? '' : authenticatedUser.tenantId));

              return this.loadCompanyProfilesOptions(tenantIdForProfiles, detail?.companyProfile ?? null)
                .pipe(
                  map((companyProfileOptions) => ({
                    authenticatedUser,
                    tenantOptions,
                    detail,
                    companyProfileOptions
                  }))
                );
            })
          );
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: ({ authenticatedUser, detail, companyProfileOptions }) => {
          this.companyProfileOptions.set(companyProfileOptions);
          if (detail) {
            this.populateEditForm(authenticatedUser, detail);
            return;
          }
          this.populateCreateForm(authenticatedUser);
        },
        error: () => {
          this.calendar.set(null);
          this.hasError.set(true);
        }
      });
  }

  private populateCreateForm(authenticatedUser: AuthenticatedUser): void {
    const scope: HolidayCalendarScope = this.platformScope() ? 'GLOBAL' : 'TENANT';
    const tenantId = this.platformScope() ? '' : authenticatedUser.tenantId;
    const currentYear = String(new Date().getFullYear());

    this.form.reset({
      name: '',
      countryId: '',
      year: currentYear,
      scope,
      tenantId,
      tenantLabel: this.platformScope() ? '' : this.currentTenantLabel(),
      companyProfileId: ''
    });

    if (!this.platformScope() && tenantId) {
      this.loadCompanyProfilesForTenant(tenantId);
    }
  }

  private populateEditForm(authenticatedUser: AuthenticatedUser, detail: HolidayCalendarAdministrationCalendarDetail): void {
    this.form.reset({
      name: detail.name,
      countryId: detail.country.id,
      year: String(detail.year),
      scope: detail.scope,
      tenantId: detail.tenant?.id ?? (!this.platformScope() ? authenticatedUser.tenantId : ''),
      tenantLabel: detail.tenant ? this.referenceValue(detail.tenant) : this.currentTenantLabel(),
      companyProfileId: detail.companyProfile?.id ?? ''
    });

    if (!this.platformScope()) {
      this.form.controls.tenantId.setValue(detail.tenant?.id ?? authenticatedUser.tenantId);
      this.form.controls.tenantLabel.setValue(detail.tenant ? this.referenceValue(detail.tenant) : this.currentTenantLabel());
    }
  }

  private loadTenantOptions() {
    return this.tenantAdministrationService.findTenants(TENANT_LOOKUP_QUERY).pipe(
      map((page) => page.content.map((tenant: TenantAdministrationTenantListItem) => ({
        id: tenant.id,
        code: tenant.code,
        name: tenant.name
      }))),
      catchError(() => {
        this.tenantsUnavailable.set(true);
        return of<readonly LookupOption[]>([]);
      })
    );
  }

  private loadCompanyProfilesOptions(
    tenantId: string,
    initialCompanyProfile: HolidayCalendarAdministrationCalendarDetail['companyProfile']
  ) {
    if (!tenantId.trim()) {
      return of<readonly LookupOption[]>(initialCompanyProfile ? [this.toReferenceOption(initialCompanyProfile)] : []);
    }

    return this.companyProfileAdministrationService.findCompanyProfiles(tenantId, COMPANY_PROFILE_LOOKUP_QUERY).pipe(
      map((page) => {
        const options = page.content.map((companyProfile: CompanyProfileAdministrationCompanyProfileListItem) => ({
          id: companyProfile.id,
          code: companyProfile.code,
          name: companyProfile.tradeName || companyProfile.legalName
        }));

        if (initialCompanyProfile && !options.some((option) => option.id === initialCompanyProfile.id)) {
          return [this.toReferenceOption(initialCompanyProfile), ...options];
        }

        return options;
      }),
      catchError(() => {
        this.companyProfilesUnavailable.set(true);
        return of<readonly LookupOption[]>(initialCompanyProfile ? [this.toReferenceOption(initialCompanyProfile)] : []);
      })
    );
  }

  private loadCompanyProfilesForTenant(tenantId: string): void {
    const normalizedTenantId = tenantId.trim();
    this.companyProfilesSubscription?.unsubscribe();
    this.companyProfilesUnavailable.set(false);

    if (!normalizedTenantId) {
      this.companyProfileOptions.set([]);
      this.companyProfilesLoading.set(false);
      return;
    }

    this.companyProfilesLoading.set(true);
    this.companyProfilesSubscription = this.companyProfileAdministrationService.findCompanyProfiles(
      normalizedTenantId,
      COMPANY_PROFILE_LOOKUP_QUERY
    )
      .pipe(finalize(() => this.companyProfilesLoading.set(false)))
      .subscribe({
        next: (page) => {
          const options = page.content.map((companyProfile) => ({
            id: companyProfile.id,
            code: companyProfile.code,
            name: companyProfile.tradeName || companyProfile.legalName
          }));
          this.companyProfileOptions.set(options);
          const selectedCompanyProfileId = this.form.controls.companyProfileId.getRawValue().trim();
          if (selectedCompanyProfileId && !options.some((option) => option.id === selectedCompanyProfileId)) {
            this.form.controls.companyProfileId.setValue('');
          }
        },
        error: () => {
          this.companyProfileOptions.set([]);
          this.companyProfilesUnavailable.set(true);
        }
      });
  }

  private buildCreatePayload(): HolidayCalendarAdministrationCalendarCreateRequest {
    const value = this.form.getRawValue();
    return {
      countryId: value.countryId,
      year: Number(value.year),
      name: value.name.trim(),
      scope: value.scope as HolidayCalendarScope,
      tenantId: this.optionalValue(value.tenantId),
      companyProfileId: this.optionalValue(value.companyProfileId)
    };
  }

  private buildUpdatePayload(): HolidayCalendarAdministrationCalendarUpdateRequest {
    const value = this.form.getRawValue();
    return {
      countryId: value.countryId,
      year: Number(value.year),
      name: value.name.trim(),
      scope: value.scope as HolidayCalendarScope,
      tenantId: this.optionalValue(value.tenantId),
      companyProfileId: this.optionalValue(value.companyProfileId)
    };
  }

  private selectedScope(): HolidayCalendarScope | '' {
    return this.form.controls.scope.getRawValue();
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private referenceValue(reference: { code: string; name: string }): string {
    return `${reference.name} (${reference.code})`;
  }

  private toReferenceOption(reference: { id: string; code: string; name: string }): LookupOption {
    return {
      id: reference.id,
      code: reference.code,
      name: reference.name
    };
  }

  private referenceLabel(options: readonly LookupOption[], id: string): string {
    const match = options.find((option) => option.id === id);
    return match ? this.referenceValue(match) : id;
  }

  private notifyApiError(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): void {
    this.notificationService.error(this.resolveApiMessage(error, fallbackKey, statusKeys), {
      titleKey: 'alert.title.danger',
      dismissible: true
    });
  }

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }

  private lookupValue(value: string | Event): string {
    if (typeof value === 'string') {
      return value;
    }

    return (value.target as HTMLSelectElement).value;
  }
}
