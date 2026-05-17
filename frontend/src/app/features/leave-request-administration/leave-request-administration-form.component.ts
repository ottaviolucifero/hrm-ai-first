import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize, forkJoin, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthenticatedUser } from '../../core/auth/auth.models';
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
  LeaveRequestAdministrationCreateRequest,
  LeaveRequestAdministrationDetail,
  LeaveRequestAdministrationEmployeeOption,
  LeaveRequestAdministrationReference,
  LeaveRequestAdministrationStatus,
  LeaveRequestAdministrationUpdateRequest
} from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

type LeaveRequestAdministrationFormMode = 'create' | 'edit' | 'view';

interface LeaveRequestStatusOption {
  readonly id: LeaveRequestAdministrationStatus;
  readonly labelKey: I18nKey;
}

const OPEN_STATUS_OPTIONS: readonly LeaveRequestStatusOption[] = [
  { id: 'DRAFT', labelKey: 'leaveRequestAdministration.status.DRAFT' },
  { id: 'SUBMITTED', labelKey: 'leaveRequestAdministration.status.SUBMITTED' }
] as const;

const CLOSED_STATUS_OPTIONS: readonly LeaveRequestStatusOption[] = [
  { id: 'APPROVED', labelKey: 'leaveRequestAdministration.status.APPROVED' },
  { id: 'REJECTED', labelKey: 'leaveRequestAdministration.status.REJECTED' },
  { id: 'CANCELLED', labelKey: 'leaveRequestAdministration.status.CANCELLED' }
] as const;

const LEAVE_REQUEST_STATUS_BADGE_TONES: Record<LeaveRequestAdministrationStatus, 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'warning'
};

function optionalNonNegativeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const normalizedValue = String(control.value ?? '').trim();
    if (!normalizedValue) {
      return null;
    }

    const parsedValue = Number(normalizedValue);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return { nonNegativeNumber: true };
    }

    return null;
  };
}

function leaveRequestAdministrationFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = String(control.get('startDate')?.value ?? '').trim();
    const endDate = String(control.get('endDate')?.value ?? '').trim();
    const urgent = control.get('urgent')?.value === true;
    const urgentReason = String(control.get('urgentReason')?.value ?? '').trim();
    const errors: ValidationErrors = {};

    if (startDate && endDate && endDate < startDate) {
      errors['invalidDateRange'] = true;
    }

    if (urgent && !urgentReason) {
      errors['urgentReasonRequired'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

function isClosedStatus(status: LeaveRequestAdministrationStatus): boolean {
  return status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED';
}

const BALANCE_FIELDS_HELPER_KEY = 'leaveRequestAdministration.form.balanceHelper' as const;

@Component({
  selector: 'app-leave-request-administration-form',
  imports: [
    AppButtonComponent,
    AppCheckboxComponent,
    AppDateTimeFieldComponent,
    AppInputComponent,
    LookupSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './leave-request-administration-form.component.html',
  styleUrl: './leave-request-administration-form.component.scss'
})
export class LeaveRequestAdministrationFormComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveRequestAdministrationService = inject(LeaveRequestAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private authenticatedUser: AuthenticatedUser | null = null;
  private allEmployees: readonly LeaveRequestAdministrationEmployeeOption[] = [];

  protected readonly mode = signal<LeaveRequestAdministrationFormMode>(this.resolveFormMode());
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly submitted = signal(false);
  protected readonly platformScope = signal(false);
  protected readonly readOnlyClosed = signal(false);
  protected readonly leaveRequest = signal<LeaveRequestAdministrationDetail | null>(null);
  protected readonly employeeOptions = signal<readonly LookupOption[]>([]);
  protected readonly selectedEmployee = signal<LeaveRequestAdministrationEmployeeOption | null>(null);
  protected readonly selectedLeaveRequestTypeOption = signal<LookupOption | null>(null);
  protected readonly statusOptions = computed<readonly LookupOption[]>(() => {
    const currentStatus = this.leaveRequest()?.status;
    const options = [...OPEN_STATUS_OPTIONS];

    if (currentStatus && isClosedStatus(currentStatus)) {
      const closedStatus = CLOSED_STATUS_OPTIONS.find((option) => option.id === currentStatus);
      if (closedStatus) {
        options.push(closedStatus);
      }
    }

    return options.map((option) => ({
      id: option.id,
      code: option.id,
      name: this.i18n.t(option.labelKey)
    }));
  });
  protected readonly currentTenantId = computed(() => {
    const detailTenantId = this.leaveRequest()?.tenant?.id?.trim();
    if (detailTenantId) {
      return detailTenantId;
    }

    const selectedEmployeeTenantId = this.selectedEmployee()?.tenant?.id?.trim();
    if (selectedEmployeeTenantId) {
      return selectedEmployeeTenantId;
    }

    if (!this.platformScope()) {
      return this.authenticatedUser?.tenantId?.trim() ?? '';
    }

    return '';
  });
  protected readonly leaveRequestTypeLookup = (query: { page: number; size: number; search?: string }) =>
    this.leaveRequestAdministrationService.findLeaveRequestTypeLookups(query, this.currentTenantId() || null);
  protected readonly employeeLookupClosedLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly employeeLookupOptionLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly referenceLookupClosedLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly referenceLookupOptionLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly statusLookupClosedLabelBuilder = (option: LookupOption): string => option.name;
  protected readonly statusLookupOptionLabelBuilder = (option: LookupOption): string => option.name;

  protected readonly form = this.formBuilder.group({
    employeeId: ['', [Validators.required]],
    leaveRequestTypeId: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    durationDays: ['', [optionalNonNegativeNumberValidator()]],
    deductFromBalance: [false],
    deductedDays: ['', [optionalNonNegativeNumberValidator()]],
    reason: ['', [Validators.maxLength(1000)]],
    status: ['DRAFT'],
    comments: ['', [Validators.maxLength(1000)]],
    urgent: [false],
    urgentReason: ['', [Validators.maxLength(1000)]]
  }, {
    validators: leaveRequestAdministrationFormValidator()
  });

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected titleKey(): I18nKey {
    switch (this.mode()) {
      case 'create':
        return 'leaveRequestAdministration.form.createTitle';
      case 'view':
        return 'leaveRequestAdministration.form.viewTitle';
      case 'edit':
      default:
        return 'leaveRequestAdministration.form.editTitle';
    }
  }

  protected subtitleKey(): I18nKey {
    switch (this.mode()) {
      case 'create':
        return 'leaveRequestAdministration.form.createSubtitle';
      case 'view':
        return 'leaveRequestAdministration.form.viewSubtitle';
      case 'edit':
      default:
        return 'leaveRequestAdministration.form.editSubtitle';
    }
  }

  protected submitLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'leaveRequestAdministration.actions.create'
      : 'leaveRequestAdministration.form.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.mode() === 'create'
      ? 'leaveRequestAdministration.form.actions.creating'
      : 'leaveRequestAdministration.form.actions.saving';
  }

  protected submitDisabled(): boolean {
    return this.loading() || this.saving() || this.isReadOnlyMode() || this.form.invalid;
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/leave-requests']);
  }

  protected retry(): void {
    this.load();
  }

  protected isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected isReadOnlyMode(): boolean {
    return this.isViewMode() || this.readOnlyClosed();
  }

  protected selectEmployee(employeeId: string | Event): void {
    const nextEmployeeId = this.lookupValue(employeeId);
    const previousTenantId = this.currentTenantId();
    const nextEmployee = this.allEmployees.find((employee) => employee.id === nextEmployeeId) ?? null;

    this.form.controls.employeeId.setValue(nextEmployeeId);
    this.selectedEmployee.set(nextEmployee);

    if (previousTenantId !== this.currentTenantId()) {
      const selectedTypeTenantId = this.selectedLeaveRequestTypeOption()?.metadata?.['tenantId']?.trim() ?? '';
      if (selectedTypeTenantId && selectedTypeTenantId !== this.currentTenantId()) {
        this.form.controls.leaveRequestTypeId.setValue('');
        this.selectedLeaveRequestTypeOption.set(null);
      }
    }
  }

  protected rememberLeaveRequestType(option: LookupOption | null): void {
    this.selectedLeaveRequestTypeOption.set(option);
  }

  protected handleUrgentChange(urgent: boolean): void {
    if (!urgent) {
      this.form.controls.urgentReason.setValue('');
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
      const payload = this.buildCreatePayload();
      if (!payload) {
        this.saving.set(false);
        this.notificationService.error(this.i18n.t('leaveRequestAdministration.form.errors.tenantUnavailable'), {
          titleKey: 'alert.title.danger',
          dismissible: true
        });
        return;
      }

      this.saveSubscription = this.leaveRequestAdministrationService.createLeaveRequest(payload)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => {
            this.notificationService.success(this.i18n.t('leaveRequestAdministration.feedback.createSuccess'), {
              titleKey: 'alert.title.success'
            });
            void this.router.navigate(['/admin/leave-requests']);
          },
          error: (error) => this.notifyApiError(error, 'leaveRequestAdministration.form.errors.create')
        });
      return;
    }

    const leaveRequestId = this.leaveRequest()?.id;
    if (!leaveRequestId) {
      this.saving.set(false);
      return;
    }

    this.saveSubscription = this.leaveRequestAdministrationService.updateLeaveRequest(
      leaveRequestId,
      this.buildUpdatePayload()
    )
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t('leaveRequestAdministration.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/leave-requests']);
        },
        error: (error) => this.notifyApiError(error, 'leaveRequestAdministration.form.errors.update')
      });
  }

  protected validationMessage(
    controlName:
      | 'employeeId'
      | 'leaveRequestTypeId'
      | 'startDate'
      | 'endDate'
      | 'durationDays'
      | 'deductedDays'
      | 'reason'
      | 'comments'
      | 'urgentReason'
  ): string {
    const control = this.form.controls[controlName];
    if (!(this.submitted() || control.touched)) {
      return '';
    }

    if (control.hasError('required')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.required');
    }

    if (control.hasError('maxlength')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.maxLength');
    }

    if (control.hasError('nonNegativeNumber')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.nonNegativeNumber');
    }

    if (controlName === 'endDate' && this.form.hasError('invalidDateRange')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.dateRange');
    }

    if (controlName === 'urgentReason' && this.form.hasError('urgentReasonRequired')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.urgentReasonRequired');
    }

    return '';
  }

  protected commentsErrorText(): string {
    const control = this.form.controls.comments;
    if (!(this.submitted() || control.touched)) {
      return '';
    }

    if (control.hasError('maxlength')) {
      return this.i18n.t('leaveRequestAdministration.form.validation.maxLength');
    }

    return '';
  }

  protected balanceHelperText(): string {
    return this.i18n.t(BALANCE_FIELDS_HELPER_KEY);
  }

  protected currentStatusLabel(): string {
    const status = this.leaveRequest()?.status;
    if (!status) {
      return '';
    }

    return this.i18n.t(`leaveRequestAdministration.status.${status}` as I18nKey);
  }

  protected currentStatusTone(): 'neutral' | 'info' | 'success' | 'danger' | 'warning' {
    const status = this.leaveRequest()?.status;
    return status ? LEAVE_REQUEST_STATUS_BADGE_TONES[status] : 'neutral';
  }

  protected selectedEmployeeOption(): LookupOption | null {
    const employee = this.selectedEmployee();
    if (!employee) {
      return null;
    }

    return {
      id: employee.id,
      code: employee.code,
      name: employee.name
    };
  }

  private load(): void {
    const leaveRequestId = this.route.snapshot.paramMap.get('id');
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.submitted.set(false);
    this.leaveRequest.set(null);
    this.readOnlyClosed.set(false);

    if (this.mode() !== 'create' && leaveRequestId) {
      this.loadSubscription = forkJoin({
        authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
        employees: this.leaveRequestAdministrationService.findEmployeeOptions(),
        leaveRequest: this.leaveRequestAdministrationService.findLeaveRequestById(leaveRequestId)
      })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: ({ authenticatedUser, employees, leaveRequest }) => {
            this.initializeUserContext(authenticatedUser);
            this.allEmployees = employees;
            this.leaveRequest.set(leaveRequest);
            this.employeeOptions.set(this.buildEmployeeOptions(employees, authenticatedUser, leaveRequest));
            this.selectedEmployee.set(this.toEmployeeOption(leaveRequest.employee, leaveRequest.tenant, leaveRequest.companyProfile));
            this.selectedLeaveRequestTypeOption.set(this.toLookupOption(leaveRequest.leaveRequestType));
            this.populateEditForm(leaveRequest);
          },
          error: () => this.hasError.set(true)
        });
      return;
    }

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      employees: this.leaveRequestAdministrationService.findEmployeeOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, employees }) => {
          this.initializeUserContext(authenticatedUser);
          this.allEmployees = employees;
          this.employeeOptions.set(this.buildEmployeeOptions(employees, authenticatedUser, null));
          this.selectedEmployee.set(null);
          this.selectedLeaveRequestTypeOption.set(null);
          this.populateCreateForm();
        },
        error: () => this.hasError.set(true)
      });
  }

  private initializeUserContext(authenticatedUser: AuthenticatedUser): void {
    this.authenticatedUser = authenticatedUser;
    this.platformScope.set(authenticatedUser.userType.startsWith('PLATFORM_'));
  }

  private populateCreateForm(): void {
    this.form.reset({
      employeeId: '',
      leaveRequestTypeId: '',
      startDate: '',
      endDate: '',
      durationDays: '',
      deductFromBalance: false,
      deductedDays: '',
      reason: '',
      status: 'DRAFT',
      comments: '',
      urgent: false,
      urgentReason: ''
    });
    this.form.enable({ emitEvent: false });
    this.lockBalanceFields();
  }

  private populateEditForm(leaveRequest: LeaveRequestAdministrationDetail): void {
    this.form.reset({
      employeeId: leaveRequest.employee?.id ?? '',
      leaveRequestTypeId: leaveRequest.leaveRequestType?.id ?? '',
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      durationDays: this.numericValue(leaveRequest.durationDays),
      deductFromBalance: false,
      deductedDays: '',
      reason: leaveRequest.reason ?? '',
      status: leaveRequest.status,
      comments: leaveRequest.comments ?? '',
      urgent: leaveRequest.urgent ?? false,
      urgentReason: leaveRequest.urgentReason ?? ''
    });

    if (isClosedStatus(leaveRequest.status)) {
      this.readOnlyClosed.set(true);
      this.form.disable({ emitEvent: false });
      return;
    }

    if (this.isViewMode()) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });
    this.lockBalanceFields();
  }

  private buildEmployeeOptions(
    employees: readonly LeaveRequestAdministrationEmployeeOption[],
    authenticatedUser: AuthenticatedUser,
    leaveRequest: LeaveRequestAdministrationDetail | null
  ): readonly LookupOption[] {
    const fixedTenantId = leaveRequest?.tenant?.id ?? (this.platformScope() ? '' : authenticatedUser.tenantId);
    const selectedEmployeeId = leaveRequest?.employee?.id ?? '';

    return employees
      .filter((employee) => (employee.active === true || employee.id === selectedEmployeeId))
      .filter((employee) => !fixedTenantId || employee.tenant?.id === fixedTenantId)
      .map((employee) => ({
        id: employee.id,
        code: employee.code,
        name: employee.name,
        metadata: {
          tenantId: employee.tenant?.id ?? '',
          companyProfileId: employee.companyProfile?.id ?? ''
        }
      }))
      .sort((left, right) => left.name.localeCompare(right.name, this.i18n.language()));
  }

  private buildCreatePayload(): LeaveRequestAdministrationCreateRequest | null {
    const tenantId = this.currentTenantId();
    if (!tenantId) {
      return null;
    }

    const value = this.form.getRawValue();

    return {
      tenantId,
      employeeId: value.employeeId,
      leaveRequestTypeId: value.leaveRequestTypeId,
      startDate: value.startDate,
      endDate: value.endDate,
      durationDays: this.optionalNumber(value.durationDays),
      deductFromBalance: false,
      deductedDays: null,
      reason: this.optionalValue(value.reason),
      status: this.optionalStatus(value.status),
      comments: this.optionalValue(value.comments),
      urgent: value.urgent,
      urgentReason: this.optionalValue(value.urgentReason)
    };
  }

  private buildUpdatePayload(): LeaveRequestAdministrationUpdateRequest {
    const value = this.form.getRawValue();

    return {
      employeeId: value.employeeId,
      leaveRequestTypeId: value.leaveRequestTypeId,
      startDate: value.startDate,
      endDate: value.endDate,
      durationDays: this.optionalNumber(value.durationDays),
      deductFromBalance: false,
      deductedDays: null,
      reason: this.optionalValue(value.reason),
      status: value.status as LeaveRequestAdministrationStatus,
      comments: this.optionalValue(value.comments),
      urgent: value.urgent,
      urgentReason: this.optionalValue(value.urgentReason)
    };
  }

  private notifyApiError(error: unknown, fallbackKey: I18nKey): void {
    this.notificationService.error(this.resolveApiMessage(error, fallbackKey), {
      titleKey: 'alert.title.danger',
      dismissible: true
    });
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, {
      fallbackKey,
      statusKeys: {
        400: fallbackKey,
        404: 'leaveRequestAdministration.form.errors.notFound'
      }
    });
  }

  private toEmployeeOption(
    reference: LeaveRequestAdministrationReference | null,
    tenant: LeaveRequestAdministrationReference | null,
    companyProfile: LeaveRequestAdministrationReference | null
  ): LeaveRequestAdministrationEmployeeOption | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      code: reference.code,
      name: reference.name,
      tenant,
      companyProfile,
      active: true
    };
  }

  private toLookupOption(reference: LeaveRequestAdministrationReference | null): LookupOption | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      code: reference.code,
      name: reference.name
    };
  }

  private numericValue(value: number | string | null): string {
    return value == null ? '' : String(value);
  }

  private lockBalanceFields(): void {
    this.form.controls.deductFromBalance.setValue(false, { emitEvent: false });
    this.form.controls.deductFromBalance.disable({ emitEvent: false });
    this.form.controls.deductedDays.setValue('', { emitEvent: false });
    this.form.controls.deductedDays.disable({ emitEvent: false });
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private optionalNumber(value: string | number | null | undefined): number | null {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
      return null;
    }

    const parsedValue = Number(normalized);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  private optionalStatus(value: string | null | undefined): LeaveRequestAdministrationStatus | null {
    const normalized = value?.trim();
    if (!normalized) {
      return null;
    }

    return normalized as LeaveRequestAdministrationStatus;
  }

  private lookupValue(value: string | Event): string {
    if (typeof value === 'string') {
      return value;
    }

    return (value.target as HTMLSelectElement).value;
  }

  private resolveFormMode(): LeaveRequestAdministrationFormMode {
    const routeMode = this.route.snapshot.data['formMode'];
    if (routeMode === 'create' || routeMode === 'edit' || routeMode === 'view') {
      return routeMode;
    }

    return this.route.snapshot.paramMap.get('id') ? 'edit' : 'create';
  }
}
