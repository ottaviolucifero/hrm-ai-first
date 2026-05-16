import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DeviceAdministrationCreateRequest,
  DeviceAdministrationDeviceDetail,
  DeviceAdministrationDeviceListItem,
  DeviceAdministrationFormOptions,
  DeviceAdministrationPage,
  DeviceAdministrationQuery,
  DeviceAdministrationUpdateRequest
} from './device-administration.models';

@Injectable({ providedIn: 'root' })
export class DeviceAdministrationService {
  private readonly http = inject(HttpClient);

  findDevices(
    tenantId: string | null,
    query: DeviceAdministrationQuery
  ): Observable<DeviceAdministrationPage<DeviceAdministrationDeviceListItem>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<DeviceAdministrationPage<DeviceAdministrationDeviceListItem>>('/api/admin/devices', { params });
  }

  findFormOptions(): Observable<DeviceAdministrationFormOptions> {
    return this.http.get<DeviceAdministrationFormOptions>('/api/admin/devices/form-options');
  }

  findDeviceById(deviceId: string): Observable<DeviceAdministrationDeviceDetail> {
    return this.http.get<DeviceAdministrationDeviceDetail>(`/api/admin/devices/${deviceId}`);
  }

  createDevice(payload: DeviceAdministrationCreateRequest): Observable<DeviceAdministrationDeviceDetail> {
    return this.http.post<DeviceAdministrationDeviceDetail>('/api/admin/devices', payload);
  }

  updateDevice(deviceId: string, payload: DeviceAdministrationUpdateRequest): Observable<DeviceAdministrationDeviceDetail> {
    return this.http.put<DeviceAdministrationDeviceDetail>(`/api/admin/devices/${deviceId}`, payload);
  }

  activateDevice(deviceId: string): Observable<DeviceAdministrationDeviceDetail> {
    return this.http.put<DeviceAdministrationDeviceDetail>(`/api/admin/devices/${deviceId}/activate`, {});
  }

  deactivateDevice(deviceId: string): Observable<DeviceAdministrationDeviceDetail> {
    return this.http.put<DeviceAdministrationDeviceDetail>(`/api/admin/devices/${deviceId}/deactivate`, {});
  }

  deleteDevice(deviceId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/devices/${deviceId}`);
  }
}
