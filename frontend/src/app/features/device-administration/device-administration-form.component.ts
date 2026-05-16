import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppDateTimeFieldComponent } from '../../shared/components/date-time-field/app-date-time-field.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  DeviceAdministrationCreateRequest,
  DeviceAdministrationDeviceDetail,
  DeviceAdministrationEmployeeOption,
  DeviceAdministrationFormOptions,
  DeviceAdministrationReference,
  DeviceAdministrationUpdateRequest
} from './device-administration.models';
import { DeviceAdministrationService } from './device-administration.service';

type DeviceAdministrationFormMode = 'create' | 'edit';

function deviceAdministrationFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const assignedToEmployeeId = String(control.get('assignedToEmployeeId')?.value ?? '').trim();
    const assignedAt = String(control.get('assignedAt')?.value ?? '').trim();
    const purchaseDate = String(control.get('purchaseDate')?.value ?? '').trim();
    const warrantyEndDate = String(control.get('warrantyEndDate')?.value ?? '').trim();

    if (assignedAt && !assignedToEmployeeId) {
      return { assignedAtRequiresEmployee: true };
    }

    if (purchaseDate && warrantyEndDate && warrantyEndDate < purchaseDate) {
      return { invalidWarrantyRange: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-device-administration-form',
  imports: [
    AppButtonComponent,
    AppCheckboxComponent,
    AppDateTimeFieldComponent,
    AppInputComponent,
    LookupSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './device-administration-form.component.html',
  styleUrl: './device-administration-form.component.scss'
})
export class DeviceAdministrationFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deviceAdministrationService = inject(DeviceAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;

  protected readonly mode = signal<DeviceAdministrationFormMode>(this.route.snapshot.paramMap.get('id') ? 'edit' : 'create');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly submitted = signal(false);
  protected readonly formOptions = signal<DeviceAdministrationFormOptions | null>(null);
  protected readonly device = signal<DeviceAdministrationDeviceDetail | null>(null);
  protected readonly platformScope = signal(false);

  protected readonly form = this.formBuilder.group({
    assetCodeLabel: [{ value: '', disabled: true }],
    barcodeValueLabel: [{ value: '', disabled: true }],
    tenantId: ['', [Validators.required]],
    tenantLabel: [{ value: '', disabled: true }],
    companyProfileId: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    deviceTypeId: ['', [Validators.required]],
    deviceBrandId: ['', [Validators.required]],
    model: ['', [Validators.maxLength(100)]],
    serialNumber: ['', [Validators.required, Validators.maxLength(100)]],
    purchaseDate: [''],
    warrantyEndDate: [''],
    deviceStatusId: ['', [Validators.required]],
    assignedToEmployeeId: [''],
    assignedAt: ['']
  }, { validators: deviceAdministrationFormValidator() });

  protected readonly tenantLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly companyProfileLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly deviceTypeLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly deviceBrandLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly deviceStatusLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly employeeLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly tenantLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly tenantLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly referenceLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly referenceLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly employeeLookupClosedLabelBuilder = (option: LookupOption): string => option.name;
  protected readonly employeeLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected titleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'deviceAdministration.form.createTitle'
      : 'deviceAdministration.form.editTitle';
  }

  protected subtitleKey(): I18nKey {
    return this.mode() === 'create'
      ? 'deviceAdministration.form.createSubtitle'
      : 'deviceAdministration.form.editSubtitle';
  }

  protected submitLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'deviceAdministration.form.actions.create'
      : 'deviceAdministration.form.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'deviceAdministration.form.actions.creating'
      : 'deviceAdministration.form.actions.saving';
  }

  protected canEditTenant(): boolean {
    return this.mode() === 'create' && this.platformScope();
  }

  protected activeValue(): boolean {
    return this.device()?.active ?? true;
  }

  protected submitDisabled(): boolean {
    return this.loading() || this.saving() || this.form.invalid;
  }

  protected assignedAtDisabled(): boolean {
    return !this.form.controls.assignedToEmployeeId.getRawValue().trim();
  }

  protected goBack(): void {
    if (this.mode() === 'edit' && this.device()) {
      void this.router.navigate(['/admin/devices', this.device()?.id]);
      return;
    }

    void this.router.navigate(['/admin/devices']);
  }

  protected retry(): void {
    this.load();
  }

  protected selectTenant(value: string | Event): void {
    const tenantId = this.lookupValue(value);
    this.form.controls.tenantId.setValue(tenantId);
    this.form.controls.tenantLabel.setValue(this.referenceLabel(this.findReference(this.formOptions()?.tenants, tenantId)));
  }

  protected selectCompanyProfile(value: string | Event): void {
    const companyProfileId = this.lookupValue(value);
    this.form.controls.companyProfileId.setValue(companyProfileId);
    this.refreshEmployeeOptions(companyProfileId);

    const assignedEmployeeId = this.form.controls.assignedToEmployeeId.getRawValue().trim();
    if (assignedEmployeeId && !this.currentEmployeeOptions().some((employee) => employee.id === assignedEmployeeId)) {
      this.form.controls.assignedToEmployeeId.setValue('');
      this.form.controls.assignedAt.setValue('');
    }
  }

  protected selectAssignedEmployee(value: string | Event): void {
    const employeeId = this.lookupValue(value);
    this.form.controls.assignedToEmployeeId.setValue(employeeId);
    if (!employeeId) {
      this.form.controls.assignedAt.setValue('');
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
      this.saveSubscription = this.deviceAdministrationService.createDevice(this.buildCreatePayload())
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (device) => {
            this.notificationService.success(this.i18n.t('deviceAdministration.form.feedback.createSuccess'), {
              titleKey: 'alert.title.success'
            });
            void this.router.navigate(['/admin/devices', device.id]);
          },
          error: (error) => this.notifyApiError(error, 'deviceAdministration.form.errors.create')
        });
      return;
    }

    const device = this.device();
    if (!device) {
      this.saving.set(false);
      return;
    }

    this.saveSubscription = this.deviceAdministrationService.updateDevice(device.id, this.buildUpdatePayload())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updatedDevice) => {
          this.notificationService.success(this.i18n.t('deviceAdministration.form.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/devices', updatedDevice.id]);
        },
        error: (error) => this.notifyApiError(error, 'deviceAdministration.form.errors.update')
      });
  }

  protected validationMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) {
      return '';
    }

    const shouldShow = this.submitted() || control.touched;
    if (!shouldShow) {
      return '';
    }

    if (control.hasError('required')) {
      return this.i18n.t('deviceAdministration.form.validation.required');
    }

    if (control.hasError('maxlength')) {
      return this.i18n.t('deviceAdministration.form.validation.maxLength');
    }

    if (controlName === 'assignedAt' && this.form.hasError('assignedAtRequiresEmployee')) {
      return this.i18n.t('deviceAdministration.form.validation.assignedAtRequiresEmployee');
    }

    if (controlName === 'warrantyEndDate' && this.form.hasError('invalidWarrantyRange')) {
      return this.i18n.t('deviceAdministration.form.validation.invalidWarrantyRange');
    }

    return '';
  }

  private load(): void {
    const deviceId = this.route.snapshot.paramMap.get('id');
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.submitted.set(false);

    if (this.mode() === 'edit' && deviceId) {
      this.loadSubscription = forkJoin({
        authenticatedUser: this.authService.loadAuthenticatedUser(),
        formOptions: this.deviceAdministrationService.findFormOptions(),
        device: this.deviceAdministrationService.findDeviceById(deviceId)
      })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: ({ authenticatedUser, formOptions, device }) => {
            this.platformScope.set(authenticatedUser.userType.startsWith('PLATFORM_'));
            this.formOptions.set(formOptions);
            this.device.set(device);
            this.initializeLookupOptions(formOptions);
            this.populateEditForm(authenticatedUser.tenantId, device);
          },
          error: () => {
            this.hasError.set(true);
            this.device.set(null);
          }
        });
      return;
    }

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser(),
      formOptions: this.deviceAdministrationService.findFormOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, formOptions }) => {
          this.platformScope.set(authenticatedUser.userType.startsWith('PLATFORM_'));
          this.formOptions.set(formOptions);
          this.device.set(null);
          this.initializeLookupOptions(formOptions);
          this.populateCreateForm(authenticatedUser.tenantId);
        },
        error: () => {
          this.hasError.set(true);
          this.device.set(null);
        }
      });
  }

  private initializeLookupOptions(formOptions: DeviceAdministrationFormOptions): void {
    this.tenantLookupOptions.set(this.toLookupOptions(formOptions.tenants));
    this.companyProfileLookupOptions.set(this.toLookupOptions(formOptions.companyProfiles));
    this.deviceTypeLookupOptions.set(this.toLookupOptions(formOptions.deviceTypes));
    this.deviceBrandLookupOptions.set(this.toLookupOptions(formOptions.deviceBrands));
    this.deviceStatusLookupOptions.set(this.toLookupOptions(formOptions.deviceStatuses));
    this.refreshEmployeeOptions('');
  }

  private populateCreateForm(authenticatedTenantId: string): void {
    const tenantId = this.platformScope() ? '' : authenticatedTenantId;
    this.form.reset({
      assetCodeLabel: '',
      barcodeValueLabel: '',
      tenantId,
      tenantLabel: this.referenceLabel(this.findReference(this.formOptions()?.tenants, tenantId)),
      companyProfileId: '',
      name: '',
      deviceTypeId: '',
      deviceBrandId: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyEndDate: '',
      deviceStatusId: '',
      assignedToEmployeeId: '',
      assignedAt: ''
    });

    if (this.platformScope()) {
      this.form.controls.tenantId.enable();
    } else {
      this.form.controls.tenantId.disable();
    }
  }

  private populateEditForm(authenticatedTenantId: string, device: DeviceAdministrationDeviceDetail): void {
    this.form.reset({
      assetCodeLabel: device.assetCode,
      barcodeValueLabel: device.barcodeValue,
      tenantId: device.tenant.id,
      tenantLabel: this.referenceLabel(device.tenant),
      companyProfileId: device.companyProfile.id,
      name: device.name,
      deviceTypeId: device.type.id,
      deviceBrandId: device.brand.id,
      model: device.model ?? '',
      serialNumber: device.serialNumber,
      purchaseDate: this.toLocalDateInput(device.purchaseDate),
      warrantyEndDate: this.toLocalDateInput(device.warrantyEndDate),
      deviceStatusId: device.deviceStatus.id,
      assignedToEmployeeId: device.assignedTo?.id ?? '',
      assignedAt: this.toLocalDateTimeInput(device.assignedAt)
    });

    this.form.controls.tenantId.disable();
    this.platformScope.set(this.platformScope() && authenticatedTenantId.length > 0);
    this.refreshEmployeeOptions(device.companyProfile.id);
  }

  private buildCreatePayload(): DeviceAdministrationCreateRequest {
    const value = this.form.getRawValue();
    return {
      tenantId: value.tenantId,
      companyProfileId: value.companyProfileId,
      name: value.name.trim(),
      deviceTypeId: value.deviceTypeId,
      deviceBrandId: value.deviceBrandId,
      model: this.optionalValue(value.model),
      serialNumber: value.serialNumber.trim(),
      purchaseDate: this.optionalValue(value.purchaseDate),
      warrantyEndDate: this.optionalValue(value.warrantyEndDate),
      deviceStatusId: value.deviceStatusId,
      assignedToEmployeeId: this.optionalValue(value.assignedToEmployeeId),
      assignedAt: this.toOffsetDateTime(value.assignedAt)
    };
  }

  private buildUpdatePayload(): DeviceAdministrationUpdateRequest {
    const value = this.form.getRawValue();
    return {
      companyProfileId: value.companyProfileId,
      name: value.name.trim(),
      deviceTypeId: value.deviceTypeId,
      deviceBrandId: value.deviceBrandId,
      model: this.optionalValue(value.model),
      serialNumber: value.serialNumber.trim(),
      purchaseDate: this.optionalValue(value.purchaseDate),
      warrantyEndDate: this.optionalValue(value.warrantyEndDate),
      deviceStatusId: value.deviceStatusId,
      assignedToEmployeeId: this.optionalValue(value.assignedToEmployeeId),
      assignedAt: this.toOffsetDateTime(value.assignedAt)
    };
  }

  private refreshEmployeeOptions(companyProfileId: string): void {
    const employees = this.currentEmployeeOptions(companyProfileId).map((employee) => ({
      id: employee.id,
      code: employee.code,
      name: employee.name
    }));
    this.employeeLookupOptions.set(employees);
  }

  private currentEmployeeOptions(companyProfileId = this.form.controls.companyProfileId.getRawValue()): readonly DeviceAdministrationEmployeeOption[] {
    const normalizedCompanyProfileId = companyProfileId.trim();
    if (!normalizedCompanyProfileId) {
      return [];
    }

    return (this.formOptions()?.employees ?? []).filter((employee) => employee.companyProfileId === normalizedCompanyProfileId);
  }

  private toLookupOptions(references: readonly DeviceAdministrationReference[] | null | undefined): readonly LookupOption[] {
    return (references ?? []).map((reference) => ({
      id: reference.id,
      code: reference.code,
      name: reference.name
    }));
  }

  private findReference(
    references: readonly DeviceAdministrationReference[] | null | undefined,
    referenceId: string
  ): DeviceAdministrationReference | null {
    if (!referenceId.trim()) {
      return null;
    }

    return references?.find((reference) => reference.id === referenceId) ?? null;
  }

  private referenceLabel(reference: DeviceAdministrationReference | null | undefined): string {
    if (!reference) {
      return this.i18n.t('deviceAdministration.values.none');
    }

    const name = reference.name?.trim();
    const code = reference.code?.trim();
    if (name && code) {
      return `${name} (${code})`;
    }

    return name || code || this.i18n.t('deviceAdministration.values.none');
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private toLocalDateInput(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
  }

  private toLocalDateTimeInput(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const offsetDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  }

  private toOffsetDateTime(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    if (!normalized) {
      return null;
    }

    const parsedDate = new Date(normalized);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString();
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
