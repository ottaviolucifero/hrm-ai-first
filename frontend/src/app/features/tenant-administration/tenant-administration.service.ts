import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TenantAdministrationCreateRequest,
  TenantAdministrationFormOptions,
  TenantAdministrationPage,
  TenantAdministrationQuery,
  TenantAdministrationTenantDetail,
  TenantAdministrationTenantListItem,
  TenantAdministrationUpdateRequest
} from './tenant-administration.models';

@Injectable({ providedIn: 'root' })
export class TenantAdministrationService {
  private readonly http = inject(HttpClient);

  findTenants(query: TenantAdministrationQuery): Observable<TenantAdministrationPage<TenantAdministrationTenantListItem>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<TenantAdministrationPage<TenantAdministrationTenantListItem>>('/api/admin/tenants', { params });
  }

  findFormOptions(): Observable<TenantAdministrationFormOptions> {
    return this.http.get<TenantAdministrationFormOptions>('/api/admin/tenants/form-options');
  }

  findTenantById(tenantId: string): Observable<TenantAdministrationTenantDetail> {
    return this.http.get<TenantAdministrationTenantDetail>(`/api/admin/tenants/${tenantId}`);
  }

  createTenant(payload: TenantAdministrationCreateRequest): Observable<TenantAdministrationTenantDetail> {
    return this.http.post<TenantAdministrationTenantDetail>('/api/admin/tenants', payload);
  }

  updateTenant(tenantId: string, payload: TenantAdministrationUpdateRequest): Observable<TenantAdministrationTenantDetail> {
    return this.http.put<TenantAdministrationTenantDetail>(`/api/admin/tenants/${tenantId}`, payload);
  }

  activateTenant(tenantId: string): Observable<TenantAdministrationTenantDetail> {
    return this.http.put<TenantAdministrationTenantDetail>(`/api/admin/tenants/${tenantId}/activate`, {});
  }

  deactivateTenant(tenantId: string): Observable<TenantAdministrationTenantDetail> {
    return this.http.put<TenantAdministrationTenantDetail>(`/api/admin/tenants/${tenantId}/deactivate`, {});
  }

  deleteTenant(tenantId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/tenants/${tenantId}`);
  }
}
