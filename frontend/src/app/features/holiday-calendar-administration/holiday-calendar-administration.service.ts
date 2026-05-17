import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  HolidayCalendarAdministrationCalendarDetail,
  HolidayCalendarAdministrationCalendarListItem,
  HolidayCalendarAdministrationHolidayListItem,
  HolidayCalendarAdministrationPage,
  HolidayCalendarAdministrationQuery
} from './holiday-calendar-administration.models';

@Injectable({ providedIn: 'root' })
export class HolidayCalendarAdministrationService {
  private readonly http = inject(HttpClient);

  findHolidayCalendars(
    query: HolidayCalendarAdministrationQuery
  ): Observable<HolidayCalendarAdministrationPage<HolidayCalendarAdministrationCalendarListItem>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<HolidayCalendarAdministrationPage<HolidayCalendarAdministrationCalendarListItem>>(
      '/api/admin/holiday-calendars',
      { params }
    );
  }

  findHolidayCalendarById(calendarId: string): Observable<HolidayCalendarAdministrationCalendarDetail> {
    return this.http.get<HolidayCalendarAdministrationCalendarDetail>(`/api/admin/holiday-calendars/${calendarId}`);
  }

  activateHolidayCalendar(calendarId: string): Observable<HolidayCalendarAdministrationCalendarDetail> {
    return this.http.put<HolidayCalendarAdministrationCalendarDetail>(`/api/admin/holiday-calendars/${calendarId}/activate`, {});
  }

  deactivateHolidayCalendar(calendarId: string): Observable<HolidayCalendarAdministrationCalendarDetail> {
    return this.http.put<HolidayCalendarAdministrationCalendarDetail>(`/api/admin/holiday-calendars/${calendarId}/deactivate`, {});
  }

  findHolidays(calendarId: string): Observable<readonly HolidayCalendarAdministrationHolidayListItem[]> {
    return this.http.get<readonly HolidayCalendarAdministrationHolidayListItem[]>(
      `/api/admin/holiday-calendars/${calendarId}/holidays`
    );
  }
}
