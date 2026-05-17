import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_HOLIDAY_CALENDAR_PAGE_SIZE,
  EMPTY_HOLIDAY_CALENDAR_PAGE,
  HolidayCalendarAdministrationCalendarListItem,
  HolidayCalendarAdministrationColumn,
  HolidayCalendarAdministrationPage,
  HolidayCalendarAdministrationQuery,
  HolidayCalendarAdministrationRowAction,
  HolidayCalendarAdministrationRowActionEvent
} from './holiday-calendar-administration.models';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

@Component({
  selector: 'app-holiday-calendar-administration',
  imports: [DataTableComponent],
  templateUrl: './holiday-calendar-administration.component.html',
  styleUrl: './holiday-calendar-administration.component.scss'
})
export class HolidayCalendarAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  private readonly holidayCalendarAdministrationService = inject(HolidayCalendarAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadCalendars();
    });

  protected readonly columns = computed<readonly HolidayCalendarAdministrationColumn[]>(() => [
    { key: 'name', labelKey: 'masterData.columns.name', minWidth: '14rem' },
    { key: 'country.name', labelKey: 'masterData.columns.country', minWidth: '12rem' },
    { key: 'year', labelKey: 'holidayCalendar.fields.year', type: 'number', minWidth: '7rem' },
    {
      key: 'scope',
      labelKey: 'holidayCalendar.fields.scope',
      minWidth: '10rem',
      formatter: (value) => this.scopeLabel(String(value ?? ''))
    },
    { key: 'tenant.name', labelKey: 'masterData.columns.tenant', minWidth: '11rem' },
    { key: 'companyProfile.name', labelKey: 'holidayCalendar.fields.companyProfile', minWidth: '13rem' },
    { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean', minWidth: '7rem' },
    { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime', minWidth: '10rem' }
  ]);

  protected readonly rowActions = computed<readonly HolidayCalendarAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as HolidayCalendarAdministrationCalendarListItem).id)
        || !this.modulePermissions().canView
    },
    {
      id: 'activate',
      labelKey: 'holidayCalendar.actions.activate',
      visible: (row) => !(row as HolidayCalendarAdministrationCalendarListItem).active,
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as HolidayCalendarAdministrationCalendarListItem).id)
        || !this.modulePermissions().canUpdate
    },
    {
      id: 'deactivate',
      labelKey: 'holidayCalendar.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'holidayCalendar.deactivate.confirmTitle',
        messageKey: 'holidayCalendar.deactivate.confirmMessage',
        confirmLabelKey: 'holidayCalendar.deactivate.confirmAction',
        cancelLabelKey: 'confirmDialog.actions.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as HolidayCalendarAdministrationCalendarListItem)
      },
      visible: (row) => (row as HolidayCalendarAdministrationCalendarListItem).active,
      disabled: (row) =>
        this.loading()
        || this.isBusy((row as HolidayCalendarAdministrationCalendarListItem).id)
        || !this.modulePermissions().canUpdate
    }
  ]);

  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<HolidayCalendarAdministrationPage<HolidayCalendarAdministrationCalendarListItem>>(
    EMPTY_HOLIDAY_CALENDAR_PAGE
  );
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_HOLIDAY_CALENDAR_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly actingCalendarId = signal<string | null>(null);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(() =>
    this.appliedSearch() ? 'holidayCalendar.table.noResults' : 'holidayCalendar.table.empty'
  );

  constructor() {
    this.loadCalendars();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected handleRowAction(event: HolidayCalendarAdministrationRowActionEvent): void {
    const row = event.row as HolidayCalendarAdministrationCalendarListItem;

    if (event.action.id === 'view' && this.modulePermissions().canView) {
      void this.router.navigate(['/admin/holiday-calendars', row.id]);
      return;
    }

    if (event.action.id === 'activate' && this.modulePermissions().canUpdate) {
      this.toggleCalendar(row, true);
      return;
    }

    if (event.action.id === 'deactivate' && this.modulePermissions().canUpdate) {
      this.toggleCalendar(row, false);
    }
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadCalendars();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadCalendars();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadCalendars();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadCalendars();
  }

  private loadCalendars(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'holiday-calendars'));
          return this.holidayCalendarAdministrationService.findHolidayCalendars(this.buildQuery());
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private toggleCalendar(calendar: HolidayCalendarAdministrationCalendarListItem, active: boolean): void {
    this.actingCalendarId.set(calendar.id);
    this.loadSubscription?.unsubscribe();

    const request$ = active
      ? this.holidayCalendarAdministrationService.activateHolidayCalendar(calendar.id)
      : this.holidayCalendarAdministrationService.deactivateHolidayCalendar(calendar.id);

    this.loadSubscription = request$
      .pipe(finalize(() => this.actingCalendarId.set(null)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(active
            ? 'holidayCalendar.feedback.activateSuccess'
            : 'holidayCalendar.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadCalendars();
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

  private buildQuery(): HolidayCalendarAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): HolidayCalendarAdministrationPage<HolidayCalendarAdministrationCalendarListItem> {
    return {
      ...EMPTY_HOLIDAY_CALENDAR_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private isBusy(calendarId: string): boolean {
    return this.actingCalendarId() === calendarId;
  }

  private confirmationTarget(calendar: HolidayCalendarAdministrationCalendarListItem): string {
    return `${calendar.name} (${calendar.year})`;
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

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }
}
