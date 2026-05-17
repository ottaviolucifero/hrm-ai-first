import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { HolidayCalendarAdministrationDetailComponent } from './holiday-calendar-administration-detail.component';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

interface HolidayCalendarDetailHandle {
  goBack: () => void;
  handleDetailAction: (actionId: string) => void;
  confirmPendingAction: () => void;
  createHoliday: () => void;
  handleHolidayRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
  submitHolidayDialog: (payload: Record<string, unknown>) => void;
  detailSecondaryActions: () => readonly { id: string; variant?: string }[];
  detailDestructiveActions: () => readonly { id: string; variant?: string }[];
}

const DEFAULT_PERMISSIONS = ['TENANT.HOLIDAY_CALENDAR.READ', 'TENANT.HOLIDAY_CALENDAR.UPDATE', 'TENANT.HOLIDAY_CALENDAR.DELETE'] as const;

@Component({
  standalone: true,
  template: ''
})
class DummyRouteComponent {}

describe('HolidayCalendarAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders detail actions and holidays table', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    await stabilizeFixture(fixture);

    const textContent = fixture.nativeElement.textContent as string;
    const actionHeader = fixture.nativeElement.querySelector(
      '.holiday-calendar-holidays-table-shell thead .data-table-actions-header'
    ) as HTMLTableCellElement | null;
    const actionCell = fixture.nativeElement.querySelector(
      '.holiday-calendar-holidays-table-shell tbody .data-table-actions-cell'
    ) as HTMLTableCellElement | null;
    expect(textContent).toContain('Italy 2026');
    expect(textContent).toContain('Identità');
    expect(textContent).toContain('Contesto e stato');
    expect(textContent).toContain('Festività');
    expect(textContent).toContain('Republic Day');
    expect(textContent).toContain('Basata su Pasqua');
    expect(textContent).toContain('Disattiva');
    expect(textContent).toContain('Nuova festività');
    expect(actionHeader?.classList.contains('data-table-sticky-right')).toBe(true);
    expect(actionCell?.classList.contains('data-table-sticky-right')).toBe(true);
  }, 10000);

  it('navigates back to the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;
    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday-calendars']);
  });

  it('confirms and performs deactivate from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;
    component.handleDetailAction('deactivate');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();

    component.confirmPendingAction();

    expect(service.deactivateHolidayCalendar).toHaveBeenCalledWith('calendar-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Calendario festività disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('uses outline style for deactivate and keeps destructive action slot empty', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;

    expect(component.detailSecondaryActions()).toEqual([
      expect.objectContaining({ id: 'deactivate', variant: 'outline' })
    ]);
    expect(component.detailDestructiveActions()).toEqual([
      expect.objectContaining({ id: 'deletePhysical' })
    ]);
  });

  it('navigates to edit screen from detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;
    component.handleDetailAction('edit');

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday-calendars', 'calendar-1', 'edit']);
  });

  it('confirms and deletes the calendar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;
    component.handleDetailAction('deletePhysical');
    fixture.detectChanges();
    component.confirmPendingAction();

    expect(service.deleteHolidayCalendar).toHaveBeenCalledWith('calendar-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Calendario festività eliminato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('creates and deletes holidays from the detail screen', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as HolidayCalendarDetailHandle;
    component.createHoliday();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-holiday-calendar-holiday-form-dialog')).not.toBeNull();

    component.submitHolidayDialog({
      name: 'Liberation Day',
      startDate: '2026-04-25',
      endDate: '2026-04-25',
      type: 'FIXED',
      generationRule: 'FIXED_DATE',
      description: null
    });

    component.handleHolidayRowAction({
      action: { id: 'delete' },
      row: { id: 'holiday-1', name: 'Republic Day' }
    });

    expect(service.createHoliday).toHaveBeenCalledWith('calendar-1', expect.objectContaining({ name: 'Liberation Day' }));
    expect(service.deleteHoliday).toHaveBeenCalledWith('calendar-1', 'holiday-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Festività creata correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(successSpy).toHaveBeenCalledWith(
      'Festività eliminata correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows the holiday table error state when holidays fail to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findHolidays: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 500 })))
    }));
    await stabilizeFixture(fixture);

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare le festività del calendario.');
  });

  it('shows retry action when the detail fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findHolidayCalendarById: vi.fn(() => throwError(() => new Error('detail failed')))
    }));
    await stabilizeFixture(fixture);

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio del calendario festività.');
    expect(fixture.nativeElement.textContent).toContain('Riprova');
  });
});

async function createFixture(
  service: HolidayCalendarAdministrationService,
  permissions: readonly string[] = DEFAULT_PERMISSIONS
) {
  await TestBed.configureTestingModule({
    imports: [DummyRouteComponent, HolidayCalendarAdministrationDetailComponent],
    providers: [
      provideRouter([
        { path: 'admin/holiday-calendars', component: DummyRouteComponent },
        { path: 'admin/holiday-calendars/:id', component: DummyRouteComponent },
        { path: 'admin/holiday-calendars/:id/edit', component: DummyRouteComponent }
      ]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'calendar-1' : null
            }
          }
        }
      },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType: 'TENANT_ADMIN',
            permissions
          })
        }
      },
      {
        provide: HolidayCalendarAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(HolidayCalendarAdministrationDetailComponent);
}

async function stabilizeFixture(fixture: ComponentFixture<HolidayCalendarAdministrationDetailComponent>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function createService(
  overrides: Partial<HolidayCalendarAdministrationService> = {}
): HolidayCalendarAdministrationService {
  const calendar = {
    id: 'calendar-1',
    country: { id: 'country-1', code: 'IT', name: 'Italy' },
    year: 2026,
    name: 'Italy 2026',
    scope: 'GLOBAL' as const,
    tenant: null,
    companyProfile: null,
    active: true,
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z'
  };

  const holidays = [
    {
      id: 'holiday-1',
      name: 'Republic Day',
      startDate: '2026-06-02',
      endDate: '2026-06-02',
      type: 'FIXED' as const,
      generationRule: 'FIXED_DATE' as const,
      description: 'National holiday',
      createdAt: '2026-05-10T09:00:00Z',
      updatedAt: '2026-05-15T10:00:00Z'
    },
    {
      id: 'holiday-2',
      name: 'Easter Monday',
      startDate: '2026-04-06',
      endDate: '2026-04-06',
      type: 'MOBILE' as const,
      generationRule: 'EASTER_BASED' as const,
      description: null,
      createdAt: '2026-05-10T09:00:00Z',
      updatedAt: '2026-05-15T10:00:00Z'
    }
  ];

  return {
    findHolidayCalendars: vi.fn(),
    findHolidayCalendarById: vi.fn(() => of(calendar)),
    activateHolidayCalendar: vi.fn(() => of({ ...calendar, active: true })),
    deactivateHolidayCalendar: vi.fn(() => of({ ...calendar, active: false })),
    deleteHolidayCalendar: vi.fn(() => of(undefined)),
    findHolidays: vi.fn(() => of(holidays)),
    createHoliday: vi.fn(() => of({
      id: 'holiday-3',
      holidayCalendarId: 'calendar-1'
    })),
    updateHoliday: vi.fn(() => of({
      id: 'holiday-1',
      holidayCalendarId: 'calendar-1'
    })),
    deleteHoliday: vi.fn(() => of(undefined)),
    ...overrides
  } as HolidayCalendarAdministrationService;
}
