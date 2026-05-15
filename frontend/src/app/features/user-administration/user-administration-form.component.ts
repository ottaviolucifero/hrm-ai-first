import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { EmailFieldComponent } from '../../shared/form-fields/email-field.component';
import { PasswordFieldComponent } from '../../shared/form-fields/password-field.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  UserAdministrationCompanyProfileOption,
  UserAdministrationFormOptions,
  UserAdministrationUserDetail
} from './user-administration.models';
import { UserAdministrationService } from './user-administration.service';

type UserAdministrationFormMode = 'create' | 'edit';

@Component({
  selector: 'app-user-administration-form',
  imports: [
    AppButtonComponent,
    AppCheckboxComponent,
    AppInputComponent,
    LookupSelectComponent,
    EmailFieldComponent,
    PasswordFieldComponent,
    ReactiveFormsModule
  ],
  templateUrl: './user-administration-form.component.html',
  styleUrl: './user-administration-form.component.scss'
})
export class UserAdministrationFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;

  protected readonly mode = signal<UserAdministrationFormMode>(this.route.snapshot.paramMap.get('id') ? 'edit' : 'create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly submitted = signal(false);
  protected readonly formOptions = signal<UserAdministrationFormOptions | null>(null);
  protected readonly user = signal<UserAdministrationUserDetail | null>(null);
  protected readonly platformScope = signal(false);

  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    userTypeId: ['', [Validators.required]],
    tenantId: ['', [Validators.required]],
    companyProfileId: [''],
    initialPassword: [''],
    confirmPassword: [''],
    authenticationMethodLabel: [{ value: '', disabled: true }],
    userTypeLabel: [{ value: '', disabled: true }],
    tenantLabel: [{ value: '', disabled: true }],
    employeeLabel: [{ value: '', disabled: true }]
  });
  protected readonly tenantLookupOptions = computed<readonly LookupOption[]>(() =>
    (this.formOptions()?.tenants ?? []).map((tenant) => ({
      id: tenant.id,
      code: tenant.code,
      name: tenant.name
    })));
  protected readonly companyProfileLookupOptions = computed<readonly LookupOption[]>(() =>
    this.filteredCompanyProfiles().map((companyProfile) => ({
      id: companyProfile.id,
      code: companyProfile.code,
      name: companyProfile.tradeName || companyProfile.legalName,
      extraLabel: companyProfile.legalName
    })));
  protected readonly userTypeLookupOptions = computed<readonly LookupOption[]>(() =>
    (this.formOptions()?.userTypes ?? []).map((userType) => ({
      id: userType.id,
      code: userType.code,
      name: userType.name
    })));
  protected readonly tenantClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly tenantOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly userTypeClosedLabelBuilder = (option: LookupOption): string => option.name || option.code;
  protected readonly userTypeOptionLabelBuilder = (option: LookupOption): string => option.name || option.code;
  protected readonly companyProfileClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly companyProfileOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;

  constructor() {
    this.configureModeValidators();
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected titleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'userAdministration.form.create.title'
      : 'userAdministration.form.edit.title';
  }

  protected subtitleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'userAdministration.form.create.subtitle'
      : 'userAdministration.form.edit.subtitle';
  }

  protected submitLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'userAdministration.form.actions.create'
      : 'userAdministration.form.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'userAdministration.form.actions.creating'
      : 'userAdministration.form.actions.saving';
  }

  protected filteredCompanyProfiles(): readonly UserAdministrationCompanyProfileOption[] {
    const tenantId = this.form.controls.tenantId.getRawValue();
    return this.formOptions()?.companyProfiles.filter((companyProfile) => companyProfile.tenantId === tenantId) ?? [];
  }

  protected canEditTenant(): boolean {
    return this.mode() === 'create' && this.platformScope();
  }

  protected shouldShowEmployee(): boolean {
    return this.mode() === 'edit' && Boolean(this.user()?.employee);
  }

  protected hasPasswordConfirmationMismatch(): boolean {
    if (this.mode() !== 'create') {
      return false;
    }

    const { initialPassword, confirmPassword } = this.form.getRawValue();
    return Boolean(confirmPassword) && initialPassword !== confirmPassword;
  }

  protected confirmPasswordErrorText(): string {
    return this.hasPasswordConfirmationMismatch()
      ? this.i18n.t('userAdministration.form.validation.passwordMismatch')
      : '';
  }

  protected submitDisabled(): boolean {
    return this.loading() || this.saving() || this.form.invalid || this.hasPasswordConfirmationMismatch();
  }

  protected goBack(): void {
    if (this.mode() === 'edit' && this.user()) {
      void this.router.navigate(['/admin/users', this.user()?.id]);
      return;
    }

    void this.router.navigate(['/admin/users']);
  }

  protected retry(): void {
    this.load();
  }

  protected selectTenant(value: string | Event): void {
    const tenantId = this.lookupValue(value);
    this.form.controls.tenantId.setValue(tenantId);
    this.form.controls.companyProfileId.setValue('');
    this.updateTenantDisplayFields();
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
      const formValue = this.form.getRawValue();
      this.saveSubscription = this.userAdministrationService.createUser({
        email: formValue.email,
        userTypeId: formValue.userTypeId,
        tenantId: formValue.tenantId,
        companyProfileId: formValue.companyProfileId || null,
        initialPassword: formValue.initialPassword.trim()
      })
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (user) => {
            this.notificationService.success(this.i18n.t('userAdministration.form.feedback.createSuccess'), {
              titleKey: 'alert.title.success'
            });
            void this.router.navigate(['/admin/users', user.id]);
          },
          error: (error) => this.notifyApiError(error, 'userAdministration.form.errors.create')
        });
      return;
    }

    const user = this.user();
    if (!user) {
      this.saving.set(false);
      return;
    }

    const formValue = this.form.getRawValue();
    this.saveSubscription = this.userAdministrationService.updateUser(user.id, {
      email: formValue.email,
      companyProfileId: formValue.companyProfileId || null
    })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updatedUser) => {
          this.notificationService.success(this.i18n.t('userAdministration.form.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/users', updatedUser.id]);
        },
        error: (error) => this.notifyApiError(error, 'userAdministration.form.errors.update')
      });
  }

  private load(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.submitted.set(false);

    if (this.mode() === 'edit' && userId) {
      this.loadSubscription = forkJoin({
        authenticatedUser: this.authService.loadAuthenticatedUser(),
        formOptions: this.userAdministrationService.findFormOptions(),
        user: this.userAdministrationService.findUserById(userId)
      })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (result) => {
            this.platformScope.set(result.authenticatedUser.userType.startsWith('PLATFORM_'));
            this.formOptions.set(result.formOptions);
            this.user.set(result.user);
            this.populateForm(result.authenticatedUser.tenantId);
          },
          error: () => {
            this.hasError.set(true);
            this.user.set(null);
          }
        });
      return;
    }

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser(),
      formOptions: this.userAdministrationService.findFormOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.platformScope.set(result.authenticatedUser.userType.startsWith('PLATFORM_'));
          this.formOptions.set(result.formOptions);
          this.user.set(null);
          this.populateForm(result.authenticatedUser.tenantId);
        },
        error: () => {
          this.hasError.set(true);
          this.user.set(null);
        }
      });
  }

  private populateForm(authenticatedTenantId: string): void {
    if (this.mode() === 'edit') {
      this.populateEditForm();
      return;
    }

    const options = this.formOptions();
    const tenantId = this.platformScope()
      ? ''
      : authenticatedTenantId;
    this.form.reset({
      email: '',
      userTypeId: '',
      tenantId,
      companyProfileId: '',
      initialPassword: '',
      confirmPassword: '',
      authenticationMethodLabel: this.referenceName(options?.authenticationMethod ?? null),
      userTypeLabel: '',
      tenantLabel: this.tenantLabel(tenantId),
      employeeLabel: this.i18n.t('userAdministration.values.none')
    });

    if (this.platformScope()) {
      this.form.controls.tenantId.enable();
    } else {
      this.form.controls.tenantId.disable();
    }
    this.form.controls.userTypeId.enable();
    this.form.controls.companyProfileId.enable();
    this.form.controls.email.enable();
  }

  private populateEditForm(): void {
    const user = this.user();
    if (!user) {
      return;
    }

    this.form.reset({
      email: user.email,
      userTypeId: user.userType.id,
      tenantId: user.tenant.id,
      companyProfileId: user.companyProfile?.id ?? '',
      initialPassword: '',
      confirmPassword: '',
      authenticationMethodLabel: this.referenceName(user.authenticationMethod),
      userTypeLabel: this.referenceName(user.userType),
      tenantLabel: this.referenceNameWithCode(user.tenant),
      employeeLabel: user.employee
        ? `${user.employee.employeeCode} - ${user.employee.firstName} ${user.employee.lastName}`
        : this.i18n.t('userAdministration.values.none')
    });

    this.form.controls.email.enable();
    this.form.controls.companyProfileId.enable();
    this.form.controls.userTypeId.disable();
    this.form.controls.tenantId.disable();
  }

  private configureModeValidators(): void {
    if (this.mode() !== 'create') {
      this.form.controls.initialPassword.clearValidators();
      this.form.controls.confirmPassword.clearValidators();
      this.form.controls.initialPassword.updateValueAndValidity();
      this.form.controls.confirmPassword.updateValueAndValidity();
      return;
    }

    this.form.controls.initialPassword.setValidators([Validators.required, Validators.maxLength(255)]);
    this.form.controls.confirmPassword.setValidators([Validators.required]);
    this.form.controls.initialPassword.updateValueAndValidity();
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  private updateTenantDisplayFields(): void {
    const tenantId = this.form.controls.tenantId.getRawValue();
    const label = this.tenantLabel(tenantId);
    this.form.controls.tenantLabel.setValue(label);
  }

  private tenantLabel(tenantId: string): string {
    const tenant = this.formOptions()?.tenants.find((option) => option.id === tenantId) ?? null;
    return tenant ? this.referenceNameWithCode(tenant) : this.i18n.t('userAdministration.values.none');
  }

  private referenceName(reference: { code: string; name: string } | null): string {
    if (!reference) {
      return this.i18n.t('userAdministration.values.none');
    }

    if (reference.code === 'PASSWORD_ONLY') {
      return this.i18n.t('userAdministration.authenticationMethod.passwordOnly');
    }

    return reference.name?.trim() || reference.code?.trim() || this.i18n.t('userAdministration.values.none');
  }

  private referenceNameWithCode(reference: { code: string; name: string } | null): string {
    if (!reference) {
      return this.i18n.t('userAdministration.values.none');
    }

    const name = reference.name?.trim();
    const code = reference.code?.trim();
    if (name && code) {
      return `${name} (${code})`;
    }

    return name || code || this.i18n.t('userAdministration.values.none');
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
}
