import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, finalize, forkJoin, take } from 'rxjs';

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
  LeaveRequestAdministrationDetail,
  LeaveRequestAdministrationReference,
  LeaveRequestAdministrationStatus
} from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

interface PendingLeaveRequestConfirmation {
  readonly action: PendingLeaveRequestAction;
  readonly config: ConfirmDialogConfig;
}

type PendingLeaveRequestAction = 'approveRequest' | 'cancelRequest' | 'rejectRequest';

const LEAVE_REQUEST_STATUS_BADGE_TONES: Record<
  LeaveRequestAdministrationStatus,
  'neutral' | 'info' | 'success' | 'danger' | 'warning'
> = {
  DRAFT: 'neutral',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'warning'
};

function isMutableStatus(status: LeaveRequestAdministrationStatus): boolean {
  return status === 'DRAFT' || status === 'SUBMITTED';
}

@Component({
  selector: 'app-leave-request-administration-detail',
  imports: [ConfirmDialogComponent, DetailActionBarComponent],
  templateUrl: './leave-request-administration-detail.component.html',
  styleUrl: './leave-request-administration-detail.component.scss'
})
export class LeaveRequestAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveRequestAdministrationService = inject(LeaveRequestAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly actionSaving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly leaveRequest = signal<LeaveRequestAdministrationDetail | null>(null);
  protected readonly pendingConfirmation = signal<PendingLeaveRequestConfirmation | null>(null);

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  protected detailTitle(): string {
    const detail = this.leaveRequest();
    return detail?.employee
      ? this.referenceValue(detail.employee)
      : this.i18n.t('leaveRequestAdministration.detail.title');
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/leave-requests']);
  }

  protected editLeaveRequest(): void {
    const detail = this.leaveRequest();
    if (!detail || !this.canEdit(detail)) {
      return;
    }

    void this.router.navigate(['/admin/leave-requests', detail.id, 'edit']);
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

    const detail = this.leaveRequest();
    if (!detail) {
      return [];
    }

    const actions: DetailActionBarAction[] = [];
    if (this.canEdit(detail)) {
      actions.push({
        id: DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit,
        label: this.i18n.t('leaveRequestAdministration.actions.edit'),
        disabled: this.actionSaving(),
        icon: 'ki-filled ki-pencil'
      });
    }

    if (this.canCancel(detail)) {
      actions.push({
        id: 'cancelRequest',
        label: this.i18n.t('leaveRequestAdministration.actions.cancelRequest'),
        loadingLabel: this.i18n.t('leaveRequestAdministration.cancel.confirmAction'),
        disabled: this.actionSaving(),
        loading: this.isPendingAction('cancelRequest') && this.actionSaving(),
        icon: 'ki-filled ki-trash',
        variant: 'outline'
      });
    }

    if (this.canReject(detail)) {
      actions.push({
        id: 'rejectRequest',
        label: this.i18n.t('leaveRequestAdministration.actions.reject'),
        loadingLabel: this.i18n.t('leaveRequestAdministration.reject.confirmAction'),
        disabled: this.actionSaving(),
        loading: this.isPendingAction('rejectRequest') && this.actionSaving(),
        icon: 'ki-filled ki-cross-circle',
        variant: 'destructive'
      });
    }

    return actions;
  }

  protected detailPrimaryAction(): DetailActionBarAction | null {
    const detail = this.leaveRequest();
    if (this.hasError() || !detail) {
      return null;
    }

    if (this.canApprove(detail)) {
      return {
        id: 'approveRequest',
        label: this.i18n.t('leaveRequestAdministration.actions.approve'),
        loadingLabel: this.i18n.t('leaveRequestAdministration.approve.confirmAction'),
        disabled: this.actionSaving(),
        loading: this.isPendingAction('approveRequest') && this.actionSaving(),
        icon: 'ki-filled ki-check-circle'
      };
    }

    return null;
  }

  protected detailDestructiveActions(): readonly DetailActionBarAction[] {
    return [];
  }

  protected handleDetailAction(actionId: string): void {
    switch (actionId) {
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit:
        this.editLeaveRequest();
        return;
      case 'cancelRequest':
        this.triggerCancelAction();
        return;
      case 'approveRequest':
        this.triggerApproveAction();
        return;
      case 'rejectRequest':
        this.triggerRejectAction();
        return;
      case 'retry':
        this.retry();
        return;
      default:
        return;
    }
  }

  protected summaryFields(detail: LeaveRequestAdministrationDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [];

    if (detail.leaveRequestType) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.leaveRequestType',
        value: this.referenceValue(detail.leaveRequestType)
      });
    }

    fields.push(
      { labelKey: 'userAdministration.detail.createdAt', value: this.dateTimeValue(detail.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.dateTimeValue(detail.updatedAt) }
    );

    return fields;
  }

  protected employeeFields(detail: LeaveRequestAdministrationDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [];

    if (detail.employee) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.employee',
        value: this.referenceValue(detail.employee)
      });
    }

    if (detail.companyProfile) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.companyProfile',
        value: this.referenceValue(detail.companyProfile)
      });
    }

    return fields;
  }

  protected periodFields(detail: LeaveRequestAdministrationDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [
      { labelKey: 'leaveRequestAdministration.fields.startDate', value: this.dateValue(detail.startDate) },
      { labelKey: 'leaveRequestAdministration.fields.endDate', value: this.dateValue(detail.endDate) }
    ];

    if (detail.durationDays !== null) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.duration',
        value: String(detail.durationDays)
      });
    }

    if (detail.urgent !== null) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.urgent',
        value: this.booleanValue(detail.urgent)
      });
    }

    if (detail.deductFromBalance !== null) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.deductFromBalance',
        value: this.booleanValue(detail.deductFromBalance)
      });
    }

    return fields;
  }

  protected notesFields(detail: LeaveRequestAdministrationDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [];

    if (detail.reason?.trim()) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.reason',
        value: detail.reason.trim()
      });
    }

    if (detail.comments?.trim()) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.comments',
        value: detail.comments.trim()
      });
    }

    if (detail.urgentReason?.trim()) {
      fields.push({
        labelKey: 'leaveRequestAdministration.fields.urgentReason',
        value: detail.urgentReason.trim()
      });
    }

    return fields;
  }

  protected approvalFields(detail: LeaveRequestAdministrationDetail): readonly ReadOnlyField[] {
    if (!detail.approver) {
      return [];
    }

    return [{
      labelKey: 'leaveRequestAdministration.fields.approver',
      value: this.referenceValue(detail.approver)
    }];
  }

  protected hasNotesSection(detail: LeaveRequestAdministrationDetail): boolean {
    return this.notesFields(detail).length > 0;
  }

  protected hasApprovalSection(detail: LeaveRequestAdministrationDetail): boolean {
    return this.approvalFields(detail).length > 0;
  }

  protected isCancelled(detail: LeaveRequestAdministrationDetail): boolean {
    return detail.status === 'CANCELLED';
  }

  protected statusBadgeTone(detail: LeaveRequestAdministrationDetail): 'neutral' | 'info' | 'success' | 'danger' | 'warning' {
    return LEAVE_REQUEST_STATUS_BADGE_TONES[detail.status];
  }

  protected statusLabel(detail: LeaveRequestAdministrationDetail): string {
    return this.i18n.t(`leaveRequestAdministration.status.${detail.status}` as I18nKey);
  }

  protected cancelPendingAction(): void {
    if (this.actionSaving()) {
      return;
    }

    this.pendingConfirmation.set(null);
  }

  protected confirmPendingAction(): void {
    const pending = this.pendingConfirmation();
    const detail = this.leaveRequest();
    if (!pending || !detail || this.actionSaving()) {
      return;
    }

    switch (pending.action) {
      case 'approveRequest':
        this.approveLeaveRequest(detail.id);
        return;
      case 'rejectRequest':
        this.rejectLeaveRequest(detail.id);
        return;
      case 'cancelRequest':
      default:
        this.cancelLeaveRequest(detail.id);
        return;
    }
  }

  private load(): void {
    const leaveRequestId = this.route.snapshot.paramMap.get('id');
    if (!leaveRequestId) {
      this.hasError.set(true);
      this.leaveRequest.set(null);
      return;
    }

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.leaveRequest.set(null);
    this.pendingConfirmation.set(null);

    this.loadSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      detail: this.leaveRequestAdministrationService.findLeaveRequestById(leaveRequestId)
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, detail }) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(authenticatedUser, 'leave-requests'));
          this.leaveRequest.set(detail);
        },
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.leaveRequest.set(null);
          this.hasError.set(true);
        }
      });
  }

  private canEdit(detail: LeaveRequestAdministrationDetail): boolean {
    return this.modulePermissions().canUpdate && isMutableStatus(detail.status);
  }

  private canApprove(detail: LeaveRequestAdministrationDetail): boolean {
    return this.modulePermissions().canUpdate && detail.status === 'SUBMITTED';
  }

  private canReject(detail: LeaveRequestAdministrationDetail): boolean {
    return this.modulePermissions().canUpdate && detail.status === 'SUBMITTED';
  }

  private canCancel(detail: LeaveRequestAdministrationDetail): boolean {
    return this.modulePermissions().canDelete && isMutableStatus(detail.status);
  }

  private triggerApproveAction(): void {
    const detail = this.leaveRequest();
    if (!detail || !this.canApprove(detail) || this.actionSaving()) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction('approveRequest'));
  }

  private triggerRejectAction(): void {
    const detail = this.leaveRequest();
    if (!detail || !this.canReject(detail) || this.actionSaving()) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction('rejectRequest'));
  }

  private triggerCancelAction(): void {
    const detail = this.leaveRequest();
    if (!detail || !this.canCancel(detail) || this.actionSaving()) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction('cancelRequest'));
  }

  private approveLeaveRequest(leaveRequestId: string): void {
    this.executeMutation(
      'approveRequest',
      this.leaveRequestAdministrationService.approveLeaveRequest(leaveRequestId),
      'leaveRequestAdministration.feedback.approveSuccess',
      'leaveRequestAdministration.errors.approve'
    );
  }

  private rejectLeaveRequest(leaveRequestId: string): void {
    this.executeMutation(
      'rejectRequest',
      this.leaveRequestAdministrationService.rejectLeaveRequest(leaveRequestId),
      'leaveRequestAdministration.feedback.rejectSuccess',
      'leaveRequestAdministration.errors.reject'
    );
  }

  private cancelLeaveRequest(leaveRequestId: string): void {
    this.actionSaving.set(true);
    this.pendingConfirmation.set(this.confirmationConfigForAction('cancelRequest'));
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.leaveRequestAdministrationService.cancelLeaveRequest(leaveRequestId)
      .subscribe({
        next: () => {
          this.actionSaving.set(false);
          this.pendingConfirmation.set(null);
          this.notificationService.success(this.i18n.t('leaveRequestAdministration.feedback.cancelSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/leave-requests']);
        },
        error: (error) => {
          this.actionSaving.set(false);
          this.pendingConfirmation.set(this.confirmationConfigForAction('cancelRequest'));
          this.notificationService.error(this.resolveApiMessage(error, 'leaveRequestAdministration.errors.cancel'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private executeMutation(
    action: PendingLeaveRequestAction,
    request$: Observable<LeaveRequestAdministrationDetail>,
    successKey: I18nKey,
    errorKey: I18nKey
  ): void {
    this.actionSaving.set(true);
    this.pendingConfirmation.set(this.confirmationConfigForAction(action));
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = request$
      .subscribe({
        next: (detail) => {
          this.actionSaving.set(false);
          this.leaveRequest.set(detail);
          this.pendingConfirmation.set(null);
          this.notificationService.success(this.i18n.t(successKey), {
            titleKey: 'alert.title.success'
          });
        },
        error: (error) => {
          this.actionSaving.set(false);
          this.pendingConfirmation.set(this.confirmationConfigForAction(action));
          this.notificationService.error(this.resolveApiMessage(error, errorKey), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private confirmationConfigForAction(action: PendingLeaveRequestAction): PendingLeaveRequestConfirmation {
    const detail = this.leaveRequest();
    const targetValue = detail ? this.confirmationTargetValue(detail) : null;

    switch (action) {
      case 'approveRequest':
        return {
          action,
          config: {
            titleKey: 'leaveRequestAdministration.approve.confirmTitle',
            messageKey: 'leaveRequestAdministration.approve.confirmMessage',
            confirmLabelKey: 'leaveRequestAdministration.approve.confirmAction',
            cancelLabelKey: 'confirmDialog.actions.cancel',
            severity: 'success',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue,
            loading: this.actionSaving()
          }
        };
      case 'rejectRequest':
        return {
          action,
          config: {
            titleKey: 'leaveRequestAdministration.reject.confirmTitle',
            messageKey: 'leaveRequestAdministration.reject.confirmMessage',
            confirmLabelKey: 'leaveRequestAdministration.reject.confirmAction',
            cancelLabelKey: 'confirmDialog.actions.cancel',
            severity: 'danger',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue,
            loading: this.actionSaving()
          }
        };
      case 'cancelRequest':
      default:
        return {
          action: 'cancelRequest',
          config: {
            titleKey: 'leaveRequestAdministration.cancel.confirmTitle',
            messageKey: 'leaveRequestAdministration.cancel.confirmMessage',
            confirmLabelKey: 'leaveRequestAdministration.cancel.confirmAction',
            cancelLabelKey: 'confirmDialog.actions.cancel',
            severity: 'warning',
            mode: 'confirm',
            targetLabelKey: 'confirmDialog.target.selectedEntity',
            targetValue,
            loading: this.actionSaving()
          }
        };
    }
  }

  private isPendingAction(action: PendingLeaveRequestAction): boolean {
    return this.pendingConfirmation()?.action === action;
  }

  private referenceValue(reference: LeaveRequestAdministrationReference): string {
    const code = reference.code?.trim();
    const name = reference.name?.trim();
    if (code && name) {
      return `${code} - ${name}`;
    }

    return code || name || this.i18n.t('leaveRequestAdministration.values.notAvailable');
  }

  private booleanValue(value: boolean): string {
    return value
      ? this.i18n.t('dataTable.boolean.yes')
      : this.i18n.t('dataTable.boolean.no');
  }

  private dateValue(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('leaveRequestAdministration.values.notAvailable');
    }

    const parsedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), { dateStyle: 'short' }).format(parsedDate);
  }

  private dateTimeValue(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('leaveRequestAdministration.values.notAvailable');
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

  private confirmationTargetValue(detail: LeaveRequestAdministrationDetail): string {
    const primaryReference = detail.employee
      ?? detail.leaveRequestType
      ?? detail.tenant
      ?? detail.companyProfile;
    const referenceLabel = primaryReference
      ? this.referenceValue(primaryReference)
      : detail.id;

    return `${referenceLabel} - ${this.dateValue(detail.startDate)} - ${this.dateValue(detail.endDate)}`;
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }
}
