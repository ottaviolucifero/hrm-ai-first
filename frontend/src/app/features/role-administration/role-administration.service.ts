import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  RoleAdministrationCreateRequest,
  RoleAdministrationRoleDetail,
  RoleAdministrationPage,
  RoleAdministrationQuery,
  RoleAdministrationRoleListItem,
  RoleAdministrationUpdateRequest
} from './role-administration.models';

@Injectable({ providedIn: 'root' })
export class RoleAdministrationService {
  private readonly http = inject(HttpClient);

  findRoles(
    tenantId: string,
    query: RoleAdministrationQuery
  ): Observable<RoleAdministrationPage<RoleAdministrationRoleListItem>> {
    let params = new HttpParams()
      .set('tenantId', tenantId)
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<RoleAdministrationPage<RoleAdministrationRoleListItem>>('/api/admin/roles', { params });
  }

  createRole(payload: RoleAdministrationCreateRequest): Observable<RoleAdministrationRoleDetail> {
    return this.http.post<RoleAdministrationRoleDetail>('/api/admin/roles', payload);
  }

  updateRole(roleId: string, payload: RoleAdministrationUpdateRequest): Observable<RoleAdministrationRoleDetail> {
    return this.http.put<RoleAdministrationRoleDetail>(`/api/admin/roles/${roleId}`, payload);
  }

  activateRole(roleId: string): Observable<RoleAdministrationRoleDetail> {
    return this.http.put<RoleAdministrationRoleDetail>(`/api/admin/roles/${roleId}/activate`, {});
  }

  deactivateRole(roleId: string): Observable<RoleAdministrationRoleDetail> {
    return this.http.put<RoleAdministrationRoleDetail>(`/api/admin/roles/${roleId}/deactivate`, {});
  }

  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/roles/${roleId}`);
  }
}
