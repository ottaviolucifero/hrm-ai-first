import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

describe('HolidayCalendarAdministrationService', () => {
  let service: HolidayCalendarAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(HolidayCalendarAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests holiday calendars with pagination and search', () => {
    service.findHolidayCalendars({ page: 0, size: 20, search: 'italy' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars'
      && httpRequest.params.get('page') === '0'
      && httpRequest.params.get('size') === '20'
      && httpRequest.params.get('search') === 'italy'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('requests detail, holidays, and lifecycle endpoints', () => {
    service.findHolidayCalendarById('calendar-1').subscribe();
    service.findHolidays('calendar-1').subscribe();
    service.activateHolidayCalendar('calendar-1').subscribe();
    service.deactivateHolidayCalendar('calendar-1').subscribe();

    const detailRequest = httpTestingController.expectOne('/api/admin/holiday-calendars/calendar-1');
    const holidaysRequest = httpTestingController.expectOne('/api/admin/holiday-calendars/calendar-1/holidays');
    const activateRequest = httpTestingController.expectOne('/api/admin/holiday-calendars/calendar-1/activate');
    const deactivateRequest = httpTestingController.expectOne('/api/admin/holiday-calendars/calendar-1/deactivate');

    expect(detailRequest.request.method).toBe('GET');
    expect(holidaysRequest.request.method).toBe('GET');
    expect(activateRequest.request.method).toBe('PUT');
    expect(activateRequest.request.body).toEqual({});
    expect(deactivateRequest.request.method).toBe('PUT');
    expect(deactivateRequest.request.body).toEqual({});

    detailRequest.flush({ id: 'calendar-1' });
    holidaysRequest.flush([]);
    activateRequest.flush({ id: 'calendar-1' });
    deactivateRequest.flush({ id: 'calendar-1' });
  });
});
