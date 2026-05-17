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
    service.deleteHolidayCalendar('calendar-1').subscribe();
    service.findHolidayById('calendar-1', 'holiday-1').subscribe();
    service.createHolidayCalendar({
      countryId: 'country-1',
      year: 2026,
      name: 'Italy 2026',
      scope: 'GLOBAL',
      tenantId: null,
      companyProfileId: null
    }).subscribe();
    service.updateHolidayCalendar('calendar-1', {
      countryId: 'country-1',
      year: 2026,
      name: 'Italy 2026',
      scope: 'GLOBAL',
      tenantId: null,
      companyProfileId: null
    }).subscribe();
    service.createHoliday('calendar-1', {
      name: 'Republic Day',
      startDate: '2026-06-02',
      endDate: '2026-06-02',
      type: 'FIXED',
      generationRule: 'FIXED_DATE',
      description: null
    }).subscribe();
    service.updateHoliday('calendar-1', 'holiday-1', {
      name: 'Republic Day',
      startDate: '2026-06-02',
      endDate: '2026-06-02',
      type: 'FIXED',
      generationRule: 'FIXED_DATE',
      description: null
    }).subscribe();
    service.deleteHoliday('calendar-1', 'holiday-1').subscribe();

    const detailRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1' && httpRequest.method === 'GET'
    );
    const holidaysRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/holidays' && httpRequest.method === 'GET'
    );
    const activateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/activate' && httpRequest.method === 'PUT'
    );
    const deactivateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/deactivate' && httpRequest.method === 'PUT'
    );
    const deleteCalendarRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1' && httpRequest.method === 'DELETE'
    );
    const holidayDetailRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/holidays/holiday-1' && httpRequest.method === 'GET'
    );
    const createCalendarRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars' && httpRequest.method === 'POST'
    );
    const updateCalendarRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1' && httpRequest.method === 'PUT'
    );
    const createHolidayRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/holidays' && httpRequest.method === 'POST'
    );
    const updateHolidayRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/holidays/holiday-1' && httpRequest.method === 'PUT'
    );
    const deleteHolidayRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/holiday-calendars/calendar-1/holidays/holiday-1' && httpRequest.method === 'DELETE'
    );

    expect(detailRequest.request.method).toBe('GET');
    expect(holidaysRequest.request.method).toBe('GET');
    expect(activateRequest.request.method).toBe('PUT');
    expect(activateRequest.request.body).toEqual({});
    expect(deactivateRequest.request.method).toBe('PUT');
    expect(deactivateRequest.request.body).toEqual({});
    expect(deleteCalendarRequest.request.method).toBe('DELETE');
    expect(holidayDetailRequest.request.method).toBe('GET');
    expect(createCalendarRequest.request.method).toBe('POST');
    expect(updateCalendarRequest.request.method).toBe('PUT');
    expect(createHolidayRequest.request.method).toBe('POST');
    expect(updateHolidayRequest.request.method).toBe('PUT');
    expect(deleteHolidayRequest.request.method).toBe('DELETE');

    detailRequest.flush({ id: 'calendar-1' });
    holidaysRequest.flush([]);
    activateRequest.flush({ id: 'calendar-1' });
    deactivateRequest.flush({ id: 'calendar-1' });
    deleteCalendarRequest.flush(null);
    holidayDetailRequest.flush({ id: 'holiday-1' });
    createCalendarRequest.flush({ id: 'calendar-1' });
    updateCalendarRequest.flush({ id: 'calendar-1' });
    createHolidayRequest.flush({ id: 'holiday-1' });
    updateHolidayRequest.flush({ id: 'holiday-1' });
    deleteHolidayRequest.flush(null);
  });
});
