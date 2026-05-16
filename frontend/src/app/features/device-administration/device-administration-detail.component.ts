import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize, forkJoin, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from '../../shared/components/confirm-dialog/confirm-dialog.models';
import { DetailActionBarAction, DetailActionBarComponent } from '../../shared/components/detail-action-bar/detail-action-bar.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { DeviceAdministrationDeviceDetail, DeviceAdministrationReference } from './device-administration.models';
import { DeviceAdministrationService } from './device-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

type DevicePendingAction = 'deactivate' | 'deletePhysical';

interface PendingDeviceConfirmation {
  readonly action: DevicePendingAction | 'activate';
  readonly config: ConfirmDialogConfig;
}

@Component({
  selector: 'app-device-administration-detail',
  imports: [ConfirmDialogComponent, DetailActionBarComponent],
  templateUrl: './device-administration-detail.component.html',
  styleUrl: './device-administration-detail.component.scss'
})
export class DeviceAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly deviceAdministrationService = inject(DeviceAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly actionSaving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly device = signal<DeviceAdministrationDeviceDetail | null>(null);
  protected readonly pendingConfirmation = signal<PendingDeviceConfirmation | null>(null);

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
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

    return [{
      id: 'toggleActive',
      label: this.i18n.t(this.activeActionLabelKey(detail)),
      loadingLabel: this.i18n.t(this.activeActionLoadingLabelKey(detail)),
      loading: this.actionSaving(),
      disabled: this.actionSaving() || !this.modulePermissions().canUpdate,
      icon: detail.active ? 'ki-filled ki-cross-circle' : 'ki-filled ki-check-circle',
      variant: detail.active ? 'outline' : 'secondary'
    }];
  }

  protected detailPrimaryAction(): DetailActionBarAction | null {
    const detail = this.device();
    if (!detail || this.hasError()) {
      return null;
    }

    return {
      id: 'edit',
      label: this.i18n.t('deviceAdministration.actions.edit'),
      disabled: !this.modulePermissions().canUpdate,
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
      case 'toggleActive':
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

  private load(): void {
    const deviceId = this.route.snapshot.paramMap.get('id');
    if (!deviceId) {
      this.hasError.set(true);
      return;
    }

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.pendingConfirmation.set(null);

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      detail: this.deviceAdministrationService.findDeviceById(deviceId)
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, detail }) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(authenticatedUser, 'devices'));
          this.device.set(detail);
        },
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.device.set(null);
          this.hasError.set(true);
        }
      });
  }

  private toggleDevice(active: boolean): void {
    const device = this.device();
    if (!device) {
      return;
    }

    this.actionSaving.set(true);
    this.loadSubscription?.unsubscribe();
    const request$ = active
      ? this.deviceAdministrationService.activateDevice(device.id)
      : this.deviceAdministrationService.deactivateDevice(device.id);

    this.loadSubscription = request$
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
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.deviceAdministrationService.deleteDevice(device.id)
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
