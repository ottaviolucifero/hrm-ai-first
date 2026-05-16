import { Component, OnDestroy, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize, forkJoin, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.models';
import { AppDateTimeFieldComponent } from '../../shared/components/date-time-field/app-date-time-field.component';
import {
  DETAIL_ACTION_BAR_STANDARD_ACTION_IDS,
  DetailActionBarAction,
  DetailActionBarComponent
} from '../../shared/components/detail-action-bar/detail-action-bar.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  DeviceAdministrationAssignment,
  DeviceAdministrationAssignmentRequest,
  DeviceAdministrationDeviceDetail,
  DeviceAdministrationEmployeeOption,
  DeviceAdministrationFormOptions,
  DeviceAdministrationReference,
  DeviceAdministrationReturnRequest
} from './device-administration.models';
import { DeviceAdministrationService } from './device-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

type DevicePendingAction = 'deactivate' | 'deletePhysical';
type DeviceAssignmentActionMode = 'assign' | 'reassign' | 'return';

interface PendingDeviceConfirmation {
  readonly action: DevicePendingAction | 'activate';
  readonly config: ConfirmDialogConfig;
}

@Component({
  selector: 'app-device-administration-detail',
  imports: [
    AppButtonComponent,
    AppDateTimeFieldComponent,
    AppInputComponent,
    ConfirmDialogComponent,
    DetailActionBarComponent,
    LookupSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './device-administration-detail.component.html',
  styleUrl: './device-administration-detail.component.scss'
})
export class DeviceAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deviceAdministrationService = inject(DeviceAdministrationService);
  protected readonly i18n = inject(I18nService);

  private contextSubscription?: Subscription;
  private assignmentHistorySubscription?: Subscription;
  private mutationSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly actionSaving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly assignmentHistoryLoading = signal(false);
  protected readonly assignmentHistoryError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly device = signal<DeviceAdministrationDeviceDetail | null>(null);
  protected readonly assignmentHistory = signal<readonly DeviceAdministrationAssignment[]>([]);
  protected readonly employeeLookupOptions = signal<readonly LookupOption[]>([]);
  protected readonly pendingConfirmation = signal<PendingDeviceConfirmation | null>(null);
  protected readonly assignmentActionMode = signal<DeviceAssignmentActionMode | null>(null);
  protected readonly assignmentSubmitted = signal(false);
  protected readonly returnSubmitted = signal(false);
  protected readonly employeeLookupClosedLabelBuilder = (option: LookupOption): string => option.name;
  protected readonly employeeLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;

  protected readonly assignmentForm = this.formBuilder.group({
    employeeId: ['', [Validators.required]],
    assignedFrom: [''],
    conditionOnAssign: ['', [Validators.maxLength(255)]],
    notes: ['', [Validators.maxLength(1000)]]
  });

  protected readonly returnForm = this.formBuilder.group({
    returnedAt: [''],
    conditionOnReturn: ['', [Validators.maxLength(255)]],
    returnNote: ['', [Validators.maxLength(1000)]],
    notes: ['', [Validators.maxLength(1000)]]
  });

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.contextSubscription?.unsubscribe();
    this.assignmentHistorySubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
  }

  protected detailTitle(): string {
    return this.device()?.name?.trim() || this.i18n.t('deviceAdministration.detail.title');
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/devices']);
  }

  protected editDevice(): void {
    const device = this.device();
    if (!device || !this.modulePermissions().canUpdate) {
      return;
    }

    void this.router.navigate(['/admin/devices', device.id, 'edit']);
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

    const detail = this.device();
    if (!detail) {
      return [];
    }

    const actions: DetailActionBarAction[] = [];
    if (this.modulePermissions().canUpdate) {
      if (this.hasAssignment(detail)) {
        actions.push({
          id: 'reassign',
          label: this.i18n.t('deviceAdministration.assignment.actions.reassign'),
          disabled: this.actionSaving() || this.loading(),
          icon: 'ki-filled ki-arrow-right-left'
        });
        actions.push({
          id: 'return',
          label: this.i18n.t('deviceAdministration.assignment.actions.return'),
          disabled: this.actionSaving() || this.loading(),
          icon: 'ki-filled ki-exit-right'
        });
      } else {
        actions.push({
          id: 'assign',
          label: this.i18n.t('deviceAdministration.assignment.actions.assign'),
          disabled: this.actionSaving() || this.loading(),
          icon: 'ki-filled ki-plus'
        });
      }
    }

    actions.push({
      id: detail.active
        ? DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate
        : DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate,
      label: this.i18n.t(this.activeActionLabelKey(detail)),
      loadingLabel: this.i18n.t(this.activeActionLoadingLabelKey(detail)),
      loading: this.actionSaving(),
      disabled: this.actionSaving() || !this.modulePermissions().canUpdate,
      icon: detail.active ? 'ki-filled ki-cross-circle' : 'ki-filled ki-check-circle',
      variant: detail.active ? 'outline' : 'secondary'
    });

    return actions;
  }

  protected detailPrimaryAction(): DetailActionBarAction | null {
    const detail = this.device();
    if (!detail || this.hasError()) {
      return null;
    }

    return {
      id: 'edit',
      label: this.i18n.t('deviceAdministration.actions.edit'),
      disabled: !this.modulePermissions().canUpdate || this.actionSaving(),
      icon: 'ki-filled ki-pencil'
    };
  }

  protected detailDestructiveActions(): readonly DetailActionBarAction[] {
    const detail = this.device();
    if (!detail || this.hasError()) {
      return [];
    }

    return [{
      id: 'deletePhysical',
      label: this.i18n.t('deviceAdministration.actions.deletePhysical'),
      loadingLabel: this.i18n.t('deviceAdministration.deletePhysical.processing'),
      loading: this.actionSaving(),
      disabled: this.actionSaving() || !this.canDelete(),
      icon: 'ki-filled ki-trash'
    }];
  }

  protected handleDetailAction(actionId: string): void {
    switch (actionId) {
      case 'edit':
        this.editDevice();
        return;
      case 'assign':
      case 'reassign':
      case 'return':
        this.openAssignmentAction(actionId);
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate:
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate:
        this.triggerActiveAction();
        return;
      case 'deletePhysical':
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

  protected activeActionLabelKey(device: DeviceAdministrationDeviceDetail): I18nKey {
    return device.active
      ? 'deviceAdministration.actions.deactivate'
      : 'deviceAdministration.actions.activate';
  }

  protected activeActionLoadingLabelKey(device: DeviceAdministrationDeviceDetail): I18nKey {
    return device.active
      ? 'deviceAdministration.lifecycle.deactivate.processing'
      : 'deviceAdministration.lifecycle.activate.processing';
  }

  protected triggerActiveAction(): void {
    const device = this.device();
    if (!device || this.actionSaving() || !this.modulePermissions().canUpdate) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction(device.active ? 'deactivate' : 'activate'));
  }

  protected triggerDeleteAction(): void {
    if (!this.device() || this.actionSaving() || !this.modulePermissions().canDelete) {
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

    switch (pending.action) {
      case 'deletePhysical':
        this.deleteDevice();
        return;
      case 'activate':
        this.toggleDevice(true);
        return;
      case 'deactivate':
      default:
        this.toggleDevice(false);
        return;
    }
  }

  protected identityFields(device: DeviceAdministrationDeviceDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.name', value: this.valueOrNone(device.name) },
      { labelKey: 'deviceAdministration.fields.assetCode', value: this.valueOrNone(device.assetCode) },
      { labelKey: 'deviceAdministration.fields.deviceType', value: this.referenceValue(device.type) },
      { labelKey: 'deviceAdministration.fields.deviceBrand', value: this.referenceValue(device.brand) },
      { labelKey: 'deviceAdministration.fields.model', value: this.valueOrNone(device.model) },
      { labelKey: 'deviceAdministration.fields.serialNumber', value: this.valueOrNone(device.serialNumber) }
    ];
  }

  protected ownershipFields(device: DeviceAdministrationDeviceDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'deviceAdministration.fields.tenant', value: this.referenceValue(device.tenant) },
      { labelKey: 'deviceAdministration.fields.companyProfile', value: this.referenceValue(device.companyProfile) }
    ];
  }

  protected lifecycleFields(device: DeviceAdministrationDeviceDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'deviceAdministration.fields.purchaseDate', value: this.dateValue(device.purchaseDate) },
      { labelKey: 'deviceAdministration.fields.warrantyEndDate', value: this.dateValue(device.warrantyEndDate) }
    ];
  }

  protected assignmentFields(device: DeviceAdministrationDeviceDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'deviceAdministration.fields.assignedTo', value: this.referenceValue(device.assignedTo) },
      { labelKey: 'deviceAdministration.fields.assignedAt', value: this.dateTimeValue(device.assignedAt) }
    ];
  }

  protected hasAssignment(device: DeviceAdministrationDeviceDetail): boolean {
    return device.assignedTo !== null;
  }

  protected auditFields(device: DeviceAdministrationDeviceDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.createdAt', value: this.dateTimeValue(device.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.dateTimeValue(device.updatedAt) }
    ];
  }

  protected deviceStatusLabel(device: DeviceAdministrationDeviceDetail): string {
    return this.referenceValue(device.deviceStatus);
  }

  protected activeBadgeLabel(device: DeviceAdministrationDeviceDetail): string {
    return device.active
      ? this.i18n.t('rolePermissions.badges.active')
      : this.i18n.t('rolePermissions.badges.inactive');
  }

  protected activeBadgeClass(device: DeviceAdministrationDeviceDetail): string {
    return device.active
      ? 'device-detail-badge device-detail-badge-valid'
      : 'device-detail-badge device-detail-badge-expired';
  }

  protected warrantyBadgeLabel(device: DeviceAdministrationDeviceDetail): string {
    if (!device.warrantyEndDate) {
      return this.i18n.t('deviceAdministration.warranty.unavailable');
    }

    const warrantyEndDate = new Date(`${device.warrantyEndDate}T00:00:00`);
    if (Number.isNaN(warrantyEndDate.getTime())) {
      return this.i18n.t('deviceAdministration.warranty.unavailable');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return warrantyEndDate >= today
      ? this.i18n.t('deviceAdministration.warranty.valid')
      : this.i18n.t('deviceAdministration.warranty.expired');
  }

  protected warrantyBadgeClass(device: DeviceAdministrationDeviceDetail): string {
    if (!device.warrantyEndDate) {
      return 'device-detail-badge';
    }

    const warrantyEndDate = new Date(`${device.warrantyEndDate}T00:00:00`);
    if (Number.isNaN(warrantyEndDate.getTime())) {
      return 'device-detail-badge';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return warrantyEndDate >= today
      ? 'device-detail-badge device-detail-badge-valid'
      : 'device-detail-badge device-detail-badge-expired';
  }

  protected barcodePreviewValue(device: DeviceAdministrationDeviceDetail): string {
    return device.barcodeValue?.trim() || device.assetCode?.trim() || this.i18n.t('deviceAdministration.values.none');
  }

  protected assignmentActionTitleKey(): I18nKey {
    const mode = this.assignmentActionMode();
    switch (mode) {
      case 'assign':
        return 'deviceAdministration.assignment.panel.assignTitle';
      case 'reassign':
        return 'deviceAdministration.assignment.panel.reassignTitle';
      case 'return':
        return 'deviceAdministration.assignment.panel.returnTitle';
      default:
        return 'deviceAdministration.detail.assignment';
    }
  }

  protected assignmentActionSubtitleKey(): I18nKey {
    const mode = this.assignmentActionMode();
    switch (mode) {
      case 'assign':
        return 'deviceAdministration.assignment.panel.assignSubtitle';
      case 'reassign':
        return 'deviceAdministration.assignment.panel.reassignSubtitle';
      case 'return':
        return 'deviceAdministration.assignment.panel.returnSubtitle';
      default:
        return 'deviceAdministration.detail.subtitle';
    }
  }

  protected assignmentActionSubmitLabelKey(): I18nKey {
    const mode = this.assignmentActionMode();
    switch (mode) {
      case 'assign':
        return 'deviceAdministration.assignment.actions.assign';
      case 'reassign':
        return 'deviceAdministration.assignment.actions.reassign';
      case 'return':
        return 'deviceAdministration.assignment.actions.return';
      default:
        return 'deviceAdministration.assignment.actions.assign';
    }
  }

  protected assignmentActionSubmitLoadingLabelKey(): I18nKey {
    const mode = this.assignmentActionMode();
    switch (mode) {
      case 'assign':
        return 'deviceAdministration.assignment.actions.assigning';
      case 'reassign':
        return 'deviceAdministration.assignment.actions.reassigning';
      case 'return':
        return 'deviceAdministration.assignment.actions.returning';
      default:
        return 'deviceAdministration.assignment.actions.assigning';
    }
  }

  protected assignmentEmployeeErrorText(): string {
    const control = this.assignmentForm.controls.employeeId;
    if (!this.assignmentSubmitted() && !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return this.i18n.t('deviceAdministration.form.validation.required');
    }

    return '';
  }

  protected assignmentInputErrorText(controlName: 'conditionOnAssign' | 'notes'): string {
    return this.controlErrorText(this.assignmentForm.controls[controlName]);
  }

  protected returnInputErrorText(controlName: 'conditionOnReturn' | 'returnNote' | 'notes'): string {
    return this.controlErrorText(this.returnForm.controls[controlName]);
  }

  protected showAssignOrReassignPanel(): boolean {
    const mode = this.assignmentActionMode();
    return mode === 'assign' || mode === 'reassign';
  }

  protected showReturnPanel(): boolean {
    return this.assignmentActionMode() === 'return';
  }

  protected cancelAssignmentAction(): void {
    if (this.actionSaving()) {
      return;
    }

    this.resetAssignmentActionState();
  }

  protected submitAssignmentAction(): void {
    const device = this.device();
    const mode = this.assignmentActionMode();
    if (!device || !mode || this.actionSaving()) {
      return;
    }

    if (mode === 'return') {
      this.submitReturnAction(device.id);
      return;
    }

    this.assignmentSubmitted.set(true);
    this.assignmentForm.markAllAsTouched();
    if (this.assignmentForm.invalid) {
      return;
    }

    this.actionSaving.set(true);
    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = this.deviceAdministrationService.assignDevice(device.id, this.buildAssignmentPayload())
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(mode === 'assign'
            ? 'deviceAdministration.assignment.feedback.assignSuccess'
            : 'deviceAdministration.assignment.feedback.reassignSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.resetAssignmentActionState();
          this.load();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, mode === 'assign'
            ? 'deviceAdministration.assignment.errors.assign'
            : 'deviceAdministration.assignment.errors.reassign'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected assignmentHistoryStatusLabel(assignment: DeviceAdministrationAssignment): string {
    return this.i18n.t(this.assignmentHistoryStatusLabelKey(assignment));
  }

  protected assignmentHistoryStatusClass(assignment: DeviceAdministrationAssignment): string {
    if (!assignment.assignedTo) {
      return 'device-detail-badge device-detail-badge-valid';
    }

    return 'device-detail-badge device-detail-badge-neutral';
  }

  protected assignmentHistoryEmployeeLabel(assignment: DeviceAdministrationAssignment): string {
    return this.referenceValue(assignment.employee);
  }

  protected assignmentHistoryFields(assignment: DeviceAdministrationAssignment): readonly ReadOnlyField[] {
    return [
      { labelKey: 'deviceAdministration.assignment.history.period', value: this.assignmentPeriodValue(assignment) },
      { labelKey: 'deviceAdministration.assignment.history.conditionOnAssign', value: this.valueOrNone(assignment.conditionOnAssign) },
      { labelKey: 'deviceAdministration.assignment.history.conditionOnReturn', value: this.valueOrNone(assignment.conditionOnReturn) },
      { labelKey: 'deviceAdministration.assignment.history.notes', value: this.valueOrNone(assignment.notes) },
      { labelKey: 'deviceAdministration.assignment.history.returnNote', value: this.valueOrNone(assignment.returnNote) }
    ];
  }

  protected assignmentHistoryEmpty(): boolean {
    return !this.assignmentHistoryLoading()
      && !this.assignmentHistoryError()
      && this.assignmentHistory().length === 0;
  }

  private load(): void {
    const deviceId = this.route.snapshot.paramMap.get('id');
    if (!deviceId) {
      this.hasError.set(true);
      return;
    }

    this.contextSubscription?.unsubscribe();
    this.assignmentHistorySubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.pendingConfirmation.set(null);
    this.assignmentHistory.set([]);
    this.assignmentHistoryError.set(false);
    this.assignmentHistoryLoading.set(false);
    this.resetAssignmentActionState();

    this.contextSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      detail: this.deviceAdministrationService.findDeviceById(deviceId),
      formOptions: this.deviceAdministrationService.findFormOptions()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, detail, formOptions }) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(authenticatedUser, 'devices'));
          this.device.set(detail);
          this.employeeLookupOptions.set(this.employeeLookupOptionsForDevice(formOptions, detail));
          this.loadAssignmentHistory(detail.id);
        },
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.device.set(null);
          this.employeeLookupOptions.set([]);
          this.assignmentHistory.set([]);
          this.hasError.set(true);
        }
      });
  }

  private loadAssignmentHistory(deviceId: string): void {
    this.assignmentHistorySubscription?.unsubscribe();
    this.assignmentHistoryLoading.set(true);
    this.assignmentHistoryError.set(false);
    this.assignmentHistorySubscription = this.deviceAdministrationService.findDeviceAssignments(deviceId)
      .pipe(finalize(() => this.assignmentHistoryLoading.set(false)))
      .subscribe({
        next: (assignments) => this.assignmentHistory.set(assignments),
        error: () => {
          this.assignmentHistory.set([]);
          this.assignmentHistoryError.set(true);
        }
      });
  }

  private openAssignmentAction(mode: DeviceAssignmentActionMode): void {
    const detail = this.device();
    if (!detail || !this.modulePermissions().canUpdate || this.actionSaving()) {
      return;
    }

    if (mode === 'assign' && this.hasAssignment(detail)) {
      return;
    }

    if ((mode === 'reassign' || mode === 'return') && !this.hasAssignment(detail)) {
      return;
    }

    this.assignmentActionMode.set(mode);
    this.assignmentSubmitted.set(false);
    this.returnSubmitted.set(false);
    this.assignmentForm.reset({
      employeeId: '',
      assignedFrom: '',
      conditionOnAssign: '',
      notes: ''
    });
    this.returnForm.reset({
      returnedAt: '',
      conditionOnReturn: '',
      returnNote: '',
      notes: ''
    });
  }

  private submitReturnAction(deviceId: string): void {
    this.returnSubmitted.set(true);
    this.returnForm.markAllAsTouched();
    if (this.returnForm.invalid) {
      return;
    }

    this.actionSaving.set(true);
    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = this.deviceAdministrationService.returnDevice(deviceId, this.buildReturnPayload())
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t('deviceAdministration.assignment.feedback.returnSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.resetAssignmentActionState();
          this.load();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'deviceAdministration.assignment.errors.return'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private buildAssignmentPayload(): DeviceAdministrationAssignmentRequest {
    const value = this.assignmentForm.getRawValue();
    return {
      employeeId: value.employeeId,
      assignedFrom: this.optionalOffsetDateTimeValue(value.assignedFrom),
      conditionOnAssign: this.optionalValue(value.conditionOnAssign),
      notes: this.optionalValue(value.notes)
    };
  }

  private buildReturnPayload(): DeviceAdministrationReturnRequest {
    const value = this.returnForm.getRawValue();
    return {
      returnedAt: this.optionalOffsetDateTimeValue(value.returnedAt),
      conditionOnReturn: this.optionalValue(value.conditionOnReturn),
      returnNote: this.optionalValue(value.returnNote),
      notes: this.optionalValue(value.notes)
    };
  }

  private toggleDevice(active: boolean): void {
    const device = this.device();
    if (!device) {
      return;
    }

    this.actionSaving.set(true);
    const request$ = active
      ? this.deviceAdministrationService.activateDevice(device.id)
      : this.deviceAdministrationService.deactivateDevice(device.id);

    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = request$
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: (updatedDevice) => {
          this.pendingConfirmation.set(null);
          this.device.set(updatedDevice);
          this.notificationService.success(this.i18n.t(active
            ? 'deviceAdministration.feedback.activateSuccess'
            : 'deviceAdministration.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, active
            ? 'deviceAdministration.errors.activate'
            : 'deviceAdministration.errors.deactivate'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteDevice(): void {
    const device = this.device();
    if (!device) {
      return;
    }

    this.actionSaving.set(true);
    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = this.deviceAdministrationService.deleteDevice(device.id)
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: () => {
          this.pendingConfirmation.set(null);
          this.notificationService.success(this.i18n.t('deviceAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/devices']);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'deviceAdministration.deletePhysical.error.generic', {
            401: 'deviceAdministration.deletePhysical.error.unauthorized',
            403: 'deviceAdministration.deletePhysical.error.forbidden',
            404: 'deviceAdministration.deletePhysical.error.notFound',
            409: 'deviceAdministration.deletePhysical.error.conflict'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private employeeLookupOptionsForDevice(
    formOptions: DeviceAdministrationFormOptions,
    device: DeviceAdministrationDeviceDetail
  ): readonly LookupOption[] {
    return formOptions.employees
      .filter((employee) => employee.companyProfileId === device.companyProfile.id)
      .map((employee) => this.toLookupOption(employee));
  }

  private toLookupOption(employee: DeviceAdministrationEmployeeOption): LookupOption {
    return {
      id: employee.id,
      code: employee.code,
      name: employee.name
    };
  }

  private assignmentHistoryStatusLabelKey(assignment: DeviceAdministrationAssignment): I18nKey {
    if (!assignment.assignedTo) {
      return 'deviceAdministration.assignment.history.status.inProgress';
    }

    return assignment.returnedAt
      ? 'deviceAdministration.assignment.history.status.returned'
      : 'deviceAdministration.assignment.history.status.reassigned';
  }

  protected assignmentPeriodValue(assignment: DeviceAdministrationAssignment): string {
    const start = this.dateTimeValue(assignment.assignedFrom);
    const end = assignment.returnedAt
      ? this.dateTimeValue(assignment.returnedAt)
      : assignment.assignedTo
        ? this.dateTimeValue(assignment.assignedTo)
        : this.i18n.t('deviceAdministration.assignment.history.status.inProgress');
    return `${start} -> ${end}`;
  }

  private referenceValue(reference: DeviceAdministrationReference | null | undefined): string {
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

  protected valueOrNone(value: string | null | undefined): string {
    const normalized = value?.trim();
    return normalized || this.i18n.t('deviceAdministration.values.none');
  }

  private dateValue(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('deviceAdministration.values.none');
    }

    const parsedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), { dateStyle: 'short' }).format(parsedDate);
  }

  private dateTimeValue(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('deviceAdministration.values.none');
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(parsedDate);
  }

  private controlErrorText(control: { errors: Record<string, unknown> | null; touched: boolean }): string {
    if ((!this.assignmentSubmitted() && !this.returnSubmitted()) && !control.touched) {
      return '';
    }

    if (control.errors?.['maxlength']) {
      return this.i18n.t('deviceAdministration.form.validation.maxLength');
    }

    return '';
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private optionalOffsetDateTimeValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    if (!normalized) {
      return null;
    }

    const localDateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!localDateTimeMatch) {
      return normalized;
    }

    const [, year, month, day, hours, minutes, seconds = '00'] = localDateTimeMatch;
    const localDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
      0
    );

    if (Number.isNaN(localDate.getTime())) {
      return normalized;
    }

    const timezoneOffsetMinutes = -localDate.getTimezoneOffset();
    const offsetSign = timezoneOffsetMinutes >= 0 ? '+' : '-';
    const absoluteOffsetMinutes = Math.abs(timezoneOffsetMinutes);
    const offsetHours = String(Math.floor(absoluteOffsetMinutes / 60)).padStart(2, '0');
    const offsetMinutes = String(absoluteOffsetMinutes % 60).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
  }

  private resetAssignmentActionState(): void {
    this.assignmentActionMode.set(null);
    this.assignmentSubmitted.set(false);
    this.returnSubmitted.set(false);
    this.assignmentForm.reset({
      employeeId: '',
      assignedFrom: '',
      conditionOnAssign: '',
      notes: ''
    });
    this.returnForm.reset({
      returnedAt: '',
      conditionOnReturn: '',
      returnNote: '',
      notes: ''
    });
  }

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }

  private confirmationConfigForAction(action: PendingDeviceConfirmation['action']): PendingDeviceConfirmation {
    const detail = this.device();
    const targetValue = detail?.name?.trim() || detail?.assetCode?.trim() || null;

    switch (action) {
      case 'activate':
        return {
          action,
          config: {
            titleKey: 'deviceAdministration.activate.confirmTitle',
            messageKey: 'deviceAdministration.activate.confirmMessage',
            confirmLabelKey: 'deviceAdministration.activate.confirmAction',
            severity: 'warning',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue
          }
        };
      case 'deletePhysical':
        return {
          action,
          config: {
            titleKey: 'deviceAdministration.deletePhysical.confirmTitle',
            messageKey: 'deviceAdministration.deletePhysical.confirmMessage',
            confirmLabelKey: 'deviceAdministration.deletePhysical.confirmAction',
            severity: 'danger',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue
          }
        };
      case 'deactivate':
      default:
        return {
          action: 'deactivate',
          config: {
            titleKey: 'deviceAdministration.deactivate.confirmTitle',
            messageKey: 'deviceAdministration.deactivate.confirmMessage',
            confirmLabelKey: 'deviceAdministration.deactivate.confirmAction',
            severity: 'warning',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue
          }
        };
    }
  }
}
