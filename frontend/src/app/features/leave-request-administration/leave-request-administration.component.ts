import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { AppDateTimeFieldComponent } from '../../shared/components/date-time-field/app-date-time-field.component';
import { FilterPanelComponent } from '../../shared/components/filter-panel/filter-panel.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  DEFAULT_LEAVE_REQUEST_ADMIN_PAGE_SIZE,
  EMPTY_LEAVE_REQUEST_ADMIN_PAGE,
  LeaveRequestAdministrationColumn,
  LeaveRequestAdministrationListItem,
  LeaveRequestAdministrationPage,
  LeaveRequestAdministrationReference,
  LeaveRequestAdministrationRowAction,
  LeaveRequestAdministrationRowActionEvent,
  LeaveRequestAdministrationStatus
} from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

interface LeaveRequestStatusOption {
  readonly id: LeaveRequestAdministrationStatus;
  readonly labelKey: I18nKey;
}

const LEAVE_REQUEST_STATUS_OPTIONS: readonly LeaveRequestStatusOption[] = [
  { id: 'DRAFT', labelKey: 'leaveRequestAdministration.status.DRAFT' },
  { id: 'SUBMITTED', labelKey: 'leaveRequestAdministration.status.SUBMITTED' },
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

function isMutableStatus(status: LeaveRequestAdministrationStatus): boolean {
  return status === 'DRAFT' || status === 'SUBMITTED';
}

@Component({
  selector: 'app-leave-request-administration',
  imports: [
    FormsModule,
    AppButtonComponent,
    AppDateTimeFieldComponent,
    DataTableComponent,
    FilterPanelComponent,
    LookupSelectComponent
  ],
  templateUrl: './leave-request-administration.component.html',
  styleUrl: './leave-request-administration.component.scss'
})
export class LeaveRequestAdministrationComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  private readonly leaveRequestAdministrationService = inject(LeaveRequestAdministrationService);
  protected readonly i18n = inject(I18nService);

  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly loading = signal(false);
  protected readonly cancelling = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly allRows = signal<readonly LeaveRequestAdministrationListItem[]>([]);
  protected readonly typeFilterOption = signal<LookupOption | null>(null);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_LEAVE_REQUEST_ADMIN_PAGE_SIZE);
  protected readonly textFilter = signal('');
  protected readonly statusFilter = signal('');
  protected readonly typeFilter = signal('');
  protected readonly periodFrom = signal('');
  protected readonly periodTo = signal('');
  protected readonly typeLookupTenantId = signal<string | null>(null);
  protected readonly actingLeaveRequestId = signal<string | null>(null);

  protected readonly columns = computed<readonly LeaveRequestAdministrationColumn[]>(() => [
    {
      key: 'employee',
      labelKey: 'leaveRequestAdministration.fields.employee',
      minWidth: '14rem',
      formatter: (_value, row) => this.formatReference((row as LeaveRequestAdministrationListItem).employee)
    },
    {
      key: 'leaveRequestType',
      labelKey: 'leaveRequestAdministration.fields.leaveRequestType',
      minWidth: '12rem',
      formatter: (_value, row) => this.formatReference((row as LeaveRequestAdministrationListItem).leaveRequestType)
    },
    {
      key: 'period',
      labelKey: 'leaveRequestAdministration.fields.period',
      minWidth: '13rem',
      formatter: (_value, row) => this.formatPeriod(row as LeaveRequestAdministrationListItem)
    },
    {
      key: 'durationDays',
      labelKey: 'leaveRequestAdministration.fields.duration',
      type: 'decimal',
      minWidth: '8rem'
    },
    {
      key: 'status',
      labelKey: 'leaveRequestAdministration.fields.status',
      type: 'status',
      minWidth: '9rem',
      badgeTone: (value) => this.statusBadgeTone(String(value ?? '')),
      formatter: (value) => this.statusLabel(String(value ?? ''))
    },
    {
      key: 'requestedAt',
      labelKey: 'leaveRequestAdministration.fields.requestedAt',
      minWidth: '10rem',
      formatter: () => this.i18n.t('leaveRequestAdministration.values.notAvailable')
    }
  ]);
  protected readonly rowActions = computed<readonly LeaveRequestAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'leaveRequestAdministration.actions.view',
      visible: (row) => this.canView(row as LeaveRequestAdministrationListItem),
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as LeaveRequestAdministrationListItem).id)
        || !this.canView(row as LeaveRequestAdministrationListItem)
    },
    {
      id: 'edit',
      labelKey: 'leaveRequestAdministration.actions.edit',
      visible: (row) => this.canEdit(row as LeaveRequestAdministrationListItem),
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as LeaveRequestAdministrationListItem).id)
        || !this.canEdit(row as LeaveRequestAdministrationListItem)
    },
    {
      id: 'cancelRequest',
      labelKey: 'leaveRequestAdministration.actions.cancelRequest',
      tone: 'danger',
      confirmation: {
        titleKey: 'leaveRequestAdministration.cancel.confirmTitle',
        messageKey: 'leaveRequestAdministration.cancel.confirmMessage',
        confirmLabelKey: 'leaveRequestAdministration.cancel.confirmAction',
        cancelLabelKey: 'confirmDialog.actions.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as LeaveRequestAdministrationListItem)
      },
      visible: (row) => this.canCancel(row as LeaveRequestAdministrationListItem),
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as LeaveRequestAdministrationListItem).id)
        || !this.canCancel(row as LeaveRequestAdministrationListItem)
    }
  ]);
  protected readonly statusOptions = computed<readonly LookupOption[]>(() =>
    LEAVE_REQUEST_STATUS_OPTIONS.map((option) => ({
      id: option.id,
      code: option.id,
      name: this.i18n.t(option.labelKey)
    }))
  );
  protected readonly leaveRequestTypeLookup = (query: { page: number; size: number; search?: string }) =>
    this.leaveRequestAdministrationService.findLeaveRequestTypeLookups(query, this.typeLookupTenantId());
  protected readonly filteredRows = computed<readonly LeaveRequestAdministrationListItem[]>(() =>
    this.allRows().filter((row) => this.matchesFilters(row))
  );
  protected readonly rows = computed<readonly LeaveRequestAdministrationListItem[]>(() => {
    const page = this.pageIndex();
    const size = this.pageSize();
    const start = page * size;
    return this.filteredRows().slice(start, start + size);
  });
  protected readonly hasActiveFilters = computed(() =>
    this.textFilter().trim().length > 0
    || this.statusFilter().trim().length > 0
    || this.typeFilter().trim().length > 0
    || this.periodFrom().trim().length > 0
    || this.periodTo().trim().length > 0
  );
  protected readonly activeFilterCount = computed(() => {
    let count = 0;

    if (this.textFilter().trim().length > 0) {
      count += 1;
    }

    if (this.statusFilter().trim().length > 0) {
      count += 1;
    }

    if (this.typeFilter().trim().length > 0) {
      count += 1;
    }

    if (this.periodFrom().trim().length > 0) {
      count += 1;
    }

    if (this.periodTo().trim().length > 0) {
      count += 1;
    }

    return count;
  });
  protected readonly pageData = computed<LeaveRequestAdministrationPage<LeaveRequestAdministrationListItem>>(() => {
    const totalElements = this.filteredRows().length;
    const size = this.pageSize();
    const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
    const page = totalPages === 0 ? 0 : Math.min(this.pageIndex(), totalPages - 1);

    return {
      ...EMPTY_LEAVE_REQUEST_ADMIN_PAGE,
      content: this.rows(),
      page,
      size,
      totalElements,
      totalPages,
      first: page === 0,
      last: totalPages === 0 || page === totalPages - 1
    };
  });
  protected readonly tableEmptyMessageKey = computed<I18nKey>(() =>
    this.hasActiveFilters()
      ? 'leaveRequestAdministration.table.noResults'
      : 'leaveRequestAdministration.table.empty'
  );

  constructor() {
    this.loadLeaveRequests();
  }

  protected createLeaveRequest(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }

    void this.router.navigate(['/admin/leave-requests/new']);
  }

  protected updateTextFilter(value: string): void {
    this.textFilter.set(value);
    this.pageIndex.set(0);
  }

  protected updateTextFilterFromEvent(event: Event): void {
    this.updateTextFilter((event.target as HTMLInputElement).value);
  }

  protected updateStatusFilter(value: string): void {
    this.statusFilter.set(value.trim());
    this.pageIndex.set(0);
  }

  protected updateTypeFilter(value: string): void {
    this.typeFilter.set(value.trim());
    this.pageIndex.set(0);
  }

  protected rememberTypeFilterOption(option: LookupOption | null): void {
    this.typeFilterOption.set(option);
  }

  protected updatePeriodFrom(value: string): void {
    this.periodFrom.set(value.trim());
    this.pageIndex.set(0);
  }

  protected updatePeriodTo(value: string): void {
    this.periodTo.set(value.trim());
    this.pageIndex.set(0);
  }

  protected resetFilters(): void {
    this.textFilter.set('');
    this.statusFilter.set('');
    this.typeFilter.set('');
    this.typeFilterOption.set(null);
    this.periodFrom.set('');
    this.periodTo.set('');
    this.pageIndex.set(0);
  }

  protected handleRowAction(event: LeaveRequestAdministrationRowActionEvent): void {
    const row = event.row as LeaveRequestAdministrationListItem;

    if (event.action.id === 'view' && this.canView(row)) {
      void this.router.navigate(['/admin/leave-requests', row.id]);
      return;
    }

    if (event.action.id === 'edit' && this.canEdit(row)) {
      void this.router.navigate(['/admin/leave-requests', row.id, 'edit']);
      return;
    }

    if (event.action.id === 'cancelRequest' && this.canCancel(row)) {
      this.cancelLeaveRequest(row);
    }
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
  }

  private loadLeaveRequests(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'leave-requests'));
          this.typeLookupTenantId.set(user.userType.startsWith('PLATFORM_') ? null : user.tenantId);
          return this.leaveRequestAdministrationService.findLeaveRequests();
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (rows) => this.allRows.set(rows),
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.typeLookupTenantId.set(null);
          this.allRows.set([]);
          this.hasError.set(true);
        }
      });
  }

  private cancelLeaveRequest(row: LeaveRequestAdministrationListItem): void {
    this.cancelling.set(true);
    this.actingLeaveRequestId.set(row.id);

    this.leaveRequestAdministrationService.cancelLeaveRequest(row.id)
      .pipe(finalize(() => {
        this.cancelling.set(false);
        this.actingLeaveRequestId.set(null);
      }))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t('leaveRequestAdministration.feedback.cancelSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadLeaveRequests();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'leaveRequestAdministration.errors.cancel'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private matchesFilters(row: LeaveRequestAdministrationListItem): boolean {
    const textFilter = this.textFilter().trim().toLowerCase();
    const statusFilter = this.statusFilter();
    const typeFilter = this.typeFilter();
    const periodFrom = this.periodFrom();
    const periodTo = this.periodTo();

    if (textFilter && !this.matchesTextFilter(row, textFilter)) {
      return false;
    }

    if (statusFilter && row.status !== statusFilter) {
      return false;
    }

    if (typeFilter && row.leaveRequestType?.id !== typeFilter) {
      return false;
    }

    if (periodFrom && row.endDate < periodFrom) {
      return false;
    }

    if (periodTo && row.startDate > periodTo) {
      return false;
    }

    return true;
  }

  private matchesTextFilter(row: LeaveRequestAdministrationListItem, textFilter: string): boolean {
    return [
      row.employee?.code ?? '',
      row.employee?.name ?? '',
      row.leaveRequestType?.code ?? '',
      row.leaveRequestType?.name ?? '',
      row.reason ?? ''
    ]
      .some((value) => value.toLowerCase().includes(textFilter));
  }

  private formatReference(reference: LeaveRequestAdministrationReference | null): string {
    if (!reference) {
      return this.i18n.t('leaveRequestAdministration.values.notAvailable');
    }

    return `${reference.code} - ${reference.name}`;
  }

  private formatPeriod(row: LeaveRequestAdministrationListItem): string {
    return `${this.formatDate(row.startDate)} - ${this.formatDate(row.endDate)}`;
  }

  private formatDate(value: string): string {
    const parsedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), { dateStyle: 'short' }).format(parsedDate);
  }

  private statusLabel(status: string): string {
    const key = `leaveRequestAdministration.status.${status}` as I18nKey;
    return this.i18n.t(key);
  }

  private statusBadgeTone(status: string): 'neutral' | 'info' | 'success' | 'danger' | 'warning' {
    return LEAVE_REQUEST_STATUS_BADGE_TONES[status as LeaveRequestAdministrationStatus] ?? 'neutral';
  }

  private canView(_row: LeaveRequestAdministrationListItem): boolean {
    return this.modulePermissions().canView;
  }

  private canEdit(row: LeaveRequestAdministrationListItem): boolean {
    return this.modulePermissions().canUpdate && isMutableStatus(row.status);
  }

  private canCancel(row: LeaveRequestAdministrationListItem): boolean {
    return this.modulePermissions().canDelete && isMutableStatus(row.status);
  }

  private referenceToLookupOption(reference: LeaveRequestAdministrationReference | null): LookupOption | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      code: reference.code,
      name: reference.name
    };
  }

  private isBusy(leaveRequestId: string): boolean {
    return this.cancelling() || this.actingLeaveRequestId() === leaveRequestId;
  }

  private confirmationTarget(row: LeaveRequestAdministrationListItem): string {
    const employee = this.formatReference(row.employee);
    return `${employee} - ${this.formatPeriod(row)}`;
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }
}
