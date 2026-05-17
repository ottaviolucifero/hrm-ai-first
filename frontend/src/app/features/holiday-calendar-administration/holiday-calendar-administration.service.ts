import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  HolidayCalendarAdministrationCalendarCreateRequest,
  HolidayCalendarAdministrationCalendarDetail,
  HolidayCalendarAdministrationCalendarListItem,
  HolidayCalendarAdministrationCalendarUpdateRequest,
  HolidayCalendarAdministrationHolidayCreateRequest,
  HolidayCalendarAdministrationHolidayDetail,
  HolidayCalendarAdministrationHolidayListItem,
  HolidayCalendarAdministrationHolidayUpdateRequest,
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

  createHolidayCalendar(
    payload: HolidayCalendarAdministrationCalendarCreateRequest
  ): Observable<HolidayCalendarAdministrationCalendarDetail> {
    return this.http.post<HolidayCalendarAdministrationCalendarDetail>('/api/admin/holiday-calendars', payload);
  }

  updateHolidayCalendar(
    calendarId: string,
    payload: HolidayCalendarAdministrationCalendarUpdateRequest
  ): Observable<HolidayCalendarAdministrationCalendarDetail> {
    return this.http.put<HolidayCalendarAdministrationCalendarDetail>(`/api/admin/holiday-calendars/${calendarId}`, payload);
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

  deleteHolidayCalendar(calendarId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/holiday-calendars/${calendarId}`);
  }

  findHolidayById(calendarId: string, holidayId: string): Observable<HolidayCalendarAdministrationHolidayDetail> {
    return this.http.get<HolidayCalendarAdministrationHolidayDetail>(
      `/api/admin/holiday-calendars/${calendarId}/holidays/${holidayId}`
    );
  }

  createHoliday(
    calendarId: string,
    payload: HolidayCalendarAdministrationHolidayCreateRequest
  ): Observable<HolidayCalendarAdministrationHolidayDetail> {
    return this.http.post<HolidayCalendarAdministrationHolidayDetail>(
      `/api/admin/holiday-calendars/${calendarId}/holidays`,
      payload
    );
  }

  updateHoliday(
    calendarId: string,
    holidayId: string,
    payload: HolidayCalendarAdministrationHolidayUpdateRequest
  ): Observable<HolidayCalendarAdministrationHolidayDetail> {
    return this.http.put<HolidayCalendarAdministrationHolidayDetail>(
      `/api/admin/holiday-calendars/${calendarId}/holidays/${holidayId}`,
      payload
    );
  }

  deleteHoliday(calendarId: string, holidayId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/holiday-calendars/${calendarId}/holidays/${holidayId}`);
  }
}
