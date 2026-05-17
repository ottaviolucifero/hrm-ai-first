import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
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
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { DataTableAction, DataTableRow, DataTableRowActionEvent } from '../../shared/components/data-table/data-table.models';
import {
  DETAIL_ACTION_BAR_STANDARD_ACTION_IDS,
  DetailActionBarAction,
  DetailActionBarComponent
} from '../../shared/components/detail-action-bar/detail-action-bar.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_HOLIDAY_PAGE_SIZE,
  HolidayCalendarAdministrationCalendarDetail,
  HolidayCalendarAdministrationColumn,
  HolidayCalendarAdministrationHolidayCreateRequest,
  HolidayCalendarAdministrationHolidayListItem,
  HolidayCalendarAdministrationPage
} from './holiday-calendar-administration.models';
import {
  HolidayCalendarHolidayFormDialogComponent,
  HolidayCalendarHolidayFormDialogConfig
} from './holiday-calendar-holiday-form-dialog.component';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

type PendingAction = 'activate' | 'deactivate' | 'delete';

interface PendingHolidayCalendarConfirmation {
  readonly action: PendingAction;
  readonly config: ConfirmDialogConfig;
}

@Component({
  selector: 'app-holiday-calendar-administration-detail',
  imports: [
    AppButtonComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    DetailActionBarComponent,
    HolidayCalendarHolidayFormDialogComponent
  ],
  templateUrl: './holiday-calendar-administration-detail.component.html',
  styleUrl: './holiday-calendar-administration-detail.component.scss'
})
export class HolidayCalendarAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly holidayCalendarAdministrationService = inject(HolidayCalendarAdministrationService);
  protected readonly i18n = inject(I18nService);

  private detailSubscription?: Subscription;
  private holidaysSubscription?: Subscription;
  private mutationSubscription?: Subscription;
  private holidayMutationSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly actionSaving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly holidaysLoading = signal(false);
  protected readonly holidaysError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly calendar = signal<HolidayCalendarAdministrationCalendarDetail | null>(null);
  protected readonly holidays = signal<readonly HolidayCalendarAdministrationHolidayListItem[]>([]);
  protected readonly pendingConfirmation = signal<PendingHolidayCalendarConfirmation | null>(null);
  protected readonly holidayDialog = signal<HolidayCalendarHolidayFormDialogConfig | null>(null);
  protected readonly holidayDialogSaving = signal(false);
  protected readonly holidaysPageIndex = signal(0);
  protected readonly holidaysPageSize = signal(DEFAULT_HOLIDAY_PAGE_SIZE);
  protected readonly holidaysPageSizeOptions = [5, 10, 20] as const;

  protected readonly holidayColumns = computed<readonly HolidayCalendarAdministrationColumn[]>(() => [
    { key: 'name', labelKey: 'masterData.columns.name', minWidth: '13rem' },
    { key: 'startDate', labelKey: 'holidayCalendar.holidays.startDate', type: 'date', minWidth: '9rem' },
    { key: 'endDate', labelKey: 'holidayCalendar.holidays.endDate', type: 'date', minWidth: '9rem' },
    {
      key: 'type',
      labelKey: 'holidayCalendar.holidays.type',
      minWidth: '9rem',
      formatter: (value) => this.holidayTypeLabel(String(value ?? ''))
    },
    {
      key: 'generationRule',
      labelKey: 'holidayCalendar.holidays.generationRule',
      minWidth: '11rem',
      formatter: (value) => this.generationRuleLabel(String(value ?? ''))
    },
    { key: 'description', labelKey: 'masterData.columns.description', minWidth: '14rem' },
    { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime', minWidth: '10rem' }
  ]);
  protected readonly holidayRowActions = computed<readonly DataTableAction[]>(() => [
    {
      id: 'edit',
      labelKey: 'holidayCalendar.actions.edit',
      visible: () => this.modulePermissions().canUpdate,
      disabled: () => this.holidayDialogSaving()
    },
    {
      id: 'delete',
      labelKey: 'holidayCalendar.actions.delete',
      tone: 'danger' as const,
      visible: () => this.modulePermissions().canDelete,
      disabled: () => this.holidayDialogSaving(),
      confirmation: {
        titleKey: 'holidayCalendar.holidays.delete.confirmTitle',
        messageKey: 'holidayCalendar.holidays.delete.confirmMessage',
        confirmLabelKey: 'holidayCalendar.holidays.delete.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger' as const,
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row: DataTableRow) => String(row['name'] ?? '')
      }
    }
  ]);

  protected readonly pagedHolidays = computed(() => {
    const start = this.holidaysPageIndex() * this.holidaysPageSize();
    return this.holidays().slice(start, start + this.holidaysPageSize());
  });

  protected readonly holidaysPageData = computed<HolidayCalendarAdministrationPage<HolidayCalendarAdministrationHolidayListItem>>(() => {
    const content = this.pagedHolidays();
    const totalElements = this.holidays().length;
    const size = this.holidaysPageSize();
    const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
    const page = this.holidaysPageIndex();

    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      first: page <= 0,
      last: totalPages === 0 || page >= totalPages - 1
    };
  });

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    this.detailSubscription?.unsubscribe();
    this.holidaysSubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
    this.holidayMutationSubscription?.unsubscribe();
  }

  protected detailTitle(): string {
    return this.calendar()?.name?.trim() || this.i18n.t('holidayCalendar.detail.title');
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/holiday-calendars']);
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

    const detail = this.calendar();
    if (!detail || !this.modulePermissions().canUpdate) {
      return [];
    }

    return [{
      id: detail.active
        ? DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate
        : DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate,
      label: detail.active
        ? this.i18n.t('holidayCalendar.actions.deactivate')
        : this.i18n.t('holidayCalendar.actions.activate'),
      loadingLabel: detail.active
        ? this.i18n.t('holidayCalendar.deactivate.processing')
        : this.i18n.t('holidayCalendar.activate.processing'),
      loading: this.actionSaving(),
      disabled: this.actionSaving(),
      icon: detail.active ? 'ki-filled ki-cross-circle' : 'ki-filled ki-check-circle',
      variant: detail.active ? 'outline' : 'secondary'
    }];
  }

  protected detailPrimaryAction(): DetailActionBarAction | null {
    const detail = this.calendar();
    if (this.hasError() || !detail || !this.modulePermissions().canUpdate) {
      return null;
    }

    return {
      id: DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit,
      label: this.i18n.t('holidayCalendar.actions.edit'),
      disabled: this.actionSaving(),
      icon: 'ki-filled ki-pencil'
    };
  }

  protected detailDestructiveActions(): readonly DetailActionBarAction[] {
    const detail = this.calendar();
    if (this.hasError() || !detail || !this.modulePermissions().canDelete) {
      return [];
    }

    return [{
      id: DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deletePhysical,
      label: this.i18n.t('holidayCalendar.actions.delete'),
      loadingLabel: this.i18n.t('holidayCalendar.delete.processing'),
      loading: this.actionSaving(),
      disabled: this.actionSaving(),
      icon: 'ki-filled ki-trash'
    }];
  }

  protected handleDetailAction(actionId: string): void {
    switch (actionId) {
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.edit:
        this.editCalendar();
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.activate:
        this.triggerAction('activate');
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deactivate:
        this.triggerAction('deactivate');
        return;
      case DETAIL_ACTION_BAR_STANDARD_ACTION_IDS.deletePhysical:
        this.triggerAction('delete');
        return;
      case 'retry':
        this.retry();
        return;
      default:
        return;
    }
  }

  protected cancelPendingAction(): void {
    if (!this.actionSaving()) {
      this.pendingConfirmation.set(null);
    }
  }

  protected confirmPendingAction(): void {
    const pending = this.pendingConfirmation();
    if (!pending) {
      return;
    }

    this.pendingConfirmation.set(null);
    if (pending.action === 'delete') {
      this.deleteCalendar();
      return;
    }

    this.toggleCalendar(pending.action === 'activate');
  }

  protected identityFields(calendar: HolidayCalendarAdministrationCalendarDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.name', value: this.valueOrNone(calendar.name) },
      { labelKey: 'masterData.columns.country', value: this.referenceValue(calendar.country) },
      { labelKey: 'holidayCalendar.fields.year', value: String(calendar.year) },
      { labelKey: 'holidayCalendar.fields.scope', value: this.scopeLabel(calendar.scope) }
    ];
  }

  protected contextFields(calendar: HolidayCalendarAdministrationCalendarDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.tenant', value: this.referenceValue(calendar.tenant) },
      { labelKey: 'holidayCalendar.fields.companyProfile', value: this.referenceValue(calendar.companyProfile) },
      {
        labelKey: 'masterData.columns.active',
        value: calendar.active ? this.i18n.t('rolePermissions.badges.active') : this.i18n.t('rolePermissions.badges.inactive')
      },
      { labelKey: 'userAdministration.detail.createdAt', value: this.dateTimeValue(calendar.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.dateTimeValue(calendar.updatedAt) }
    ];
  }

  protected activeBadgeLabel(calendar: HolidayCalendarAdministrationCalendarDetail): string {
    return calendar.active
      ? this.i18n.t('rolePermissions.badges.active')
      : this.i18n.t('rolePermissions.badges.inactive');
  }

  protected activeBadgeClass(calendar: HolidayCalendarAdministrationCalendarDetail): string {
    return calendar.active
      ? 'holiday-calendar-detail-badge holiday-calendar-detail-badge-valid'
      : 'holiday-calendar-detail-badge holiday-calendar-detail-badge-inactive';
  }

  protected holidaysEmpty(): boolean {
    return !this.holidaysLoading() && !this.holidaysError() && this.holidays().length === 0;
  }

  protected createHoliday(): void {
    const detail = this.calendar();
    if (!detail || !this.modulePermissions().canUpdate || this.holidayDialogSaving()) {
      return;
    }

    this.holidayDialog.set({
      mode: 'create',
      calendarName: detail.name,
      calendarYear: detail.year
    });
  }

  protected handleHolidayRowAction(event: DataTableRowActionEvent): void {
    const holiday = event.row as HolidayCalendarAdministrationHolidayListItem;
    const detail = this.calendar();
    if (!detail) {
      return;
    }

    if (event.action.id === 'edit' && this.modulePermissions().canUpdate) {
      this.holidayDialog.set({
        mode: 'edit',
        calendarName: detail.name,
        calendarYear: detail.year,
        holiday
      });
      return;
    }

    if (event.action.id === 'delete' && this.modulePermissions().canDelete) {
      this.deleteHoliday(holiday);
    }
  }

  protected cancelHolidayDialog(): void {
    if (!this.holidayDialogSaving()) {
      this.holidayDialog.set(null);
    }
  }

  protected submitHolidayDialog(payload: HolidayCalendarAdministrationHolidayCreateRequest): void {
    const detail = this.calendar();
    const dialog = this.holidayDialog();
    if (!detail || !dialog) {
      return;
    }

    this.holidayDialogSaving.set(true);
    this.holidayMutationSubscription?.unsubscribe();

    const request$ = dialog.mode === 'create' || !dialog.holiday
      ? this.holidayCalendarAdministrationService.createHoliday(detail.id, payload)
      : this.holidayCalendarAdministrationService.updateHoliday(detail.id, dialog.holiday.id, payload);

    this.holidayMutationSubscription = request$
      .pipe(finalize(() => this.holidayDialogSaving.set(false)))
      .subscribe({
        next: () => {
          this.holidayDialog.set(null);
          this.notificationService.success(this.i18n.t(dialog.mode === 'create'
            ? 'holidayCalendar.holidays.feedback.createSuccess'
            : 'holidayCalendar.holidays.feedback.updateSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadHolidays(detail.id);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, dialog.mode === 'create'
            ? 'holidayCalendar.holidays.errors.create'
            : 'holidayCalendar.holidays.errors.update', {
            400: 'holidayCalendar.holidays.errors.invalidForm',
            404: 'holidayCalendar.holidays.errors.notFound',
            409: 'holidayCalendar.holidays.errors.overlap'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected goToPreviousHolidayPage(): void {
    const pageData = this.holidaysPageData();
    if (this.holidaysLoading() || pageData.first) {
      return;
    }

    this.holidaysPageIndex.update((page) => Math.max(0, page - 1));
  }

  protected goToNextHolidayPage(): void {
    const pageData = this.holidaysPageData();
    if (this.holidaysLoading() || pageData.last) {
      return;
    }

    this.holidaysPageIndex.update((page) => page + 1);
  }

  protected goToHolidayPage(page: number): void {
    if (this.holidaysLoading() || page === this.holidaysPageIndex()) {
      return;
    }

    this.holidaysPageIndex.set(page);
  }

  protected updateHolidayPageSize(size: number): void {
    if (this.holidaysLoading() || size === this.holidaysPageSize()) {
      return;
    }

    this.holidaysPageSize.set(size);
    this.holidaysPageIndex.set(0);
  }

  private load(): void {
    const calendarId = this.route.snapshot.paramMap.get('id');
    if (!calendarId) {
      this.hasError.set(true);
      return;
    }

    this.detailSubscription?.unsubscribe();
    this.holidaysSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);
    this.holidaysError.set(false);
    this.holidaysLoading.set(false);
    this.calendar.set(null);
    this.holidays.set([]);
    this.pendingConfirmation.set(null);
    this.holidaysPageIndex.set(0);

    this.detailSubscription = forkJoin({
      authenticatedUser: this.authService.loadAuthenticatedUser().pipe(take(1)),
      detail: this.holidayCalendarAdministrationService.findHolidayCalendarById(calendarId)
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ authenticatedUser, detail }) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(authenticatedUser, 'holiday-calendars'));
          this.calendar.set(detail);
          this.loadHolidays(detail.id);
        },
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.hasError.set(true);
        }
      });
  }

  private loadHolidays(calendarId: string): void {
    this.holidaysSubscription?.unsubscribe();
    this.holidaysLoading.set(true);
    this.holidaysError.set(false);
    this.holidaysSubscription = this.holidayCalendarAdministrationService.findHolidays(calendarId)
      .pipe(finalize(() => this.holidaysLoading.set(false)))
      .subscribe({
        next: (holidays) => {
          this.holidays.set(holidays);
          this.holidaysPageIndex.set(0);
        },
        error: () => {
          this.holidays.set([]);
          this.holidaysError.set(true);
        }
      });
  }

  private editCalendar(): void {
    const detail = this.calendar();
    if (!detail || !this.modulePermissions().canUpdate) {
      return;
    }

    void this.router.navigate(['/admin/holiday-calendars', detail.id, 'edit']);
  }

  private triggerAction(action: PendingAction): void {
    const calendar = this.calendar();
    if (!calendar || this.actionSaving() || !this.modulePermissions().canUpdate) {
      if (action !== 'delete') {
        return;
      }
    }

    if (!calendar || this.actionSaving()) {
      return;
    }

    if (action === 'delete' && !this.modulePermissions().canDelete) {
      return;
    }

    this.pendingConfirmation.set(this.confirmationConfigForAction(action));
  }

  private toggleCalendar(active: boolean): void {
    const calendar = this.calendar();
    if (!calendar) {
      return;
    }

    this.actionSaving.set(true);
    const request$ = active
      ? this.holidayCalendarAdministrationService.activateHolidayCalendar(calendar.id)
      : this.holidayCalendarAdministrationService.deactivateHolidayCalendar(calendar.id);

    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = request$
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: (updatedCalendar) => {
          this.calendar.set(updatedCalendar);
          this.notificationService.success(this.i18n.t(active
            ? 'holidayCalendar.feedback.activateSuccess'
            : 'holidayCalendar.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, active
            ? 'holidayCalendar.errors.activate'
            : 'holidayCalendar.errors.deactivate'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteCalendar(): void {
    const detail = this.calendar();
    if (!detail) {
      return;
    }

    this.actionSaving.set(true);
    this.mutationSubscription?.unsubscribe();
    this.mutationSubscription = this.holidayCalendarAdministrationService.deleteHolidayCalendar(detail.id)
      .pipe(finalize(() => this.actionSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t('holidayCalendar.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          void this.router.navigate(['/admin/holiday-calendars']);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'holidayCalendar.errors.delete', {
            404: 'holidayCalendar.errors.notFound',
            409: 'holidayCalendar.errors.deleteConflict'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteHoliday(holiday: HolidayCalendarAdministrationHolidayListItem): void {
    const detail = this.calendar();
    if (!detail) {
      return;
    }

    this.holidayDialogSaving.set(true);
    this.holidayMutationSubscription?.unsubscribe();
    this.holidayMutationSubscription = this.holidayCalendarAdministrationService.deleteHoliday(detail.id, holiday.id)
      .pipe(finalize(() => this.holidayDialogSaving.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t('holidayCalendar.holidays.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadHolidays(detail.id);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'holidayCalendar.holidays.errors.delete', {
            404: 'holidayCalendar.holidays.errors.notFound'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private confirmationConfigForAction(action: PendingAction): PendingHolidayCalendarConfirmation {
    const detail = this.calendar();
    const targetValue = detail ? `${detail.name} (${detail.year})` : null;

    if (action === 'activate') {
      return {
        action,
        config: {
          titleKey: 'holidayCalendar.activate.confirmTitle',
          messageKey: 'holidayCalendar.activate.confirmMessage',
          confirmLabelKey: 'holidayCalendar.activate.confirmAction',
          severity: 'warning',
          mode: 'confirm',
          targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue
        }
      };
    }

    if (action === 'delete') {
      return {
        action,
        config: {
          titleKey: 'holidayCalendar.delete.confirmTitle',
          messageKey: 'holidayCalendar.delete.confirmMessage',
          confirmLabelKey: 'holidayCalendar.delete.confirmAction',
          severity: 'danger',
          mode: 'confirm',
          targetLabelKey: 'confirmDialog.target.selectedEntity',
          targetValue
        }
      };
    }

    return {
      action,
      config: {
        titleKey: 'holidayCalendar.deactivate.confirmTitle',
        messageKey: 'holidayCalendar.deactivate.confirmMessage',
        confirmLabelKey: 'holidayCalendar.deactivate.confirmAction',
        severity: 'warning',
        mode: 'confirm',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue
      }
    };
  }

  private scopeLabel(scope: string): string {
    switch (scope) {
      case 'TENANT':
        return this.i18n.t('holidayCalendar.scope.tenant');
      case 'COMPANY_PROFILE':
        return this.i18n.t('holidayCalendar.scope.companyProfile');
      case 'GLOBAL':
      default:
        return this.i18n.t('holidayCalendar.scope.global');
    }
  }

  private holidayTypeLabel(type: string): string {
    return type === 'MOBILE'
      ? this.i18n.t('holidayCalendar.holidays.typeMobile')
      : this.i18n.t('holidayCalendar.holidays.typeFixed');
  }

  private generationRuleLabel(rule: string): string {
    switch (rule) {
      case 'MANUAL':
        return this.i18n.t('holidayCalendar.holidays.generationRuleManual');
      case 'EASTER_BASED':
        return this.i18n.t('holidayCalendar.holidays.generationRuleEasterBased');
      case 'FIXED_DATE':
      default:
        return this.i18n.t('holidayCalendar.holidays.generationRuleFixedDate');
    }
  }

  private referenceValue(reference: { code: string; name: string } | null | undefined): string {
    if (!reference) {
      return this.i18n.t('holidayCalendar.values.none');
    }

    const name = reference.name?.trim();
    const code = reference.code?.trim();
    if (name && code) {
      return `${name} (${code})`;
    }

    return name || code || this.i18n.t('holidayCalendar.values.none');
  }

  private valueOrNone(value: string | null | undefined): string {
    const normalized = value?.trim();
    return normalized || this.i18n.t('holidayCalendar.values.none');
  }

  private dateTimeValue(value: string | null | undefined): string {
    if (!value) {
      return this.i18n.t('holidayCalendar.values.none');
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
}
