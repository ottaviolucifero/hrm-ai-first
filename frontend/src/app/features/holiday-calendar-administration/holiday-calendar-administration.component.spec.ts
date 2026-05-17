import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { HolidayCalendarAdministrationComponent } from './holiday-calendar-administration.component';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

interface HolidayCalendarListHandle {
  handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
}

describe('HolidayCalendarAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads calendars and renders the shared list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findHolidayCalendars).toHaveBeenCalledWith(expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Calendari festività');
    expect(fixture.nativeElement.querySelector('.holiday-calendar-page-actions')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Italy 2026');
  });

  it('navigates to detail from the row action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as HolidayCalendarListHandle;
    component.handleRowAction({
      action: { id: 'view' },
      row: { id: 'calendar-1' }
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday-calendars', 'calendar-1']);
  });

  it('handles activate and deactivate actions from the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as HolidayCalendarListHandle;
    component.handleRowAction({
      action: { id: 'activate' },
      row: { id: 'calendar-2', name: 'Tenant 2027', year: 2027, active: false }
    });
    component.handleRowAction({
      action: { id: 'deactivate' },
      row: { id: 'calendar-1', name: 'Italy 2026', year: 2026, active: true }
    });

    expect(service.activateHolidayCalendar).toHaveBeenCalledWith('calendar-2');
    expect(service.deactivateHolidayCalendar).toHaveBeenCalledWith('calendar-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Calendario festività attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(successSpy).toHaveBeenCalledWith(
      'Calendario festività disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows the error state when the page fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findHolidayCalendars: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i calendari festività.');
  });

  it('shows the translated deactivate error message on api failure', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deactivateHolidayCalendar: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 500 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as HolidayCalendarListHandle;
    component.handleRowAction({
      action: { id: 'deactivate' },
      row: { id: 'calendar-1', name: 'Italy 2026', year: 2026, active: true }
    });

    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile disattivare il calendario festività.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });
});

async function createFixture(
  service: HolidayCalendarAdministrationService,
  permissions: readonly string[] = ['TENANT.HOLIDAY_CALENDAR.READ', 'TENANT.HOLIDAY_CALENDAR.UPDATE']
) {
  await TestBed.configureTestingModule({
    imports: [HolidayCalendarAdministrationComponent],
    providers: [
      provideRouter([]),
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

  return TestBed.createComponent(HolidayCalendarAdministrationComponent);
}

function createService(
  overrides: Partial<HolidayCalendarAdministrationService> = {}
): HolidayCalendarAdministrationService {
  const activeCalendar = {
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

  return {
    findHolidayCalendars: vi.fn(() => of({
      content: [
        activeCalendar,
        {
          ...activeCalendar,
          id: 'calendar-2',
          name: 'Tenant 2027',
          year: 2027,
          scope: 'TENANT',
          tenant: { id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' },
          active: false
        }
      ],
      page: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true
    })),
    findHolidayCalendarById: vi.fn(),
    activateHolidayCalendar: vi.fn(() => of({
      ...activeCalendar,
      id: 'calendar-2',
      name: 'Tenant 2027',
      year: 2027,
      scope: 'TENANT',
      tenant: { id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' },
      active: true
    })),
    deactivateHolidayCalendar: vi.fn(() => of({ ...activeCalendar, active: false })),
    findHolidays: vi.fn(),
    ...overrides
  } as HolidayCalendarAdministrationService;
}
