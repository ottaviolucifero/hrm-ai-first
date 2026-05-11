import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  UserAdministrationPage,
  UserPasswordResetRequest,
  UserPasswordResetResponse,
  UserAdministrationQuery,
  UserAdministrationRole,
  UserAdministrationUserDetail,
  UserAdministrationUserListItem,
  UserRoleAssignmentRequest
} from './user-administration.models';

@Injectable({ providedIn: 'root' })
export class UserAdministrationService {
  private readonly http = inject(HttpClient);

  findUsers(
    tenantId: string | null,
    query: UserAdministrationQuery
  ): Observable<UserAdministrationPage<UserAdministrationUserListItem>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<UserAdministrationPage<UserAdministrationUserListItem>>('/api/admin/users', { params });
  }

  findUserById(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.get<UserAdministrationUserDetail>(`/api/admin/users/${userId}`);
  }

  findAssignedRoles(userId: string, tenantId: string): Observable<readonly UserAdministrationRole[]> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<readonly UserAdministrationRole[]>(`/api/admin/users/${userId}/roles`, { params });
  }

  findAvailableRoles(userId: string, tenantId: string): Observable<readonly UserAdministrationRole[]> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<readonly UserAdministrationRole[]>(`/api/admin/users/${userId}/available-roles`, { params });
  }

  assignRole(userId: string, payload: UserRoleAssignmentRequest): Observable<readonly UserAdministrationRole[]> {
    return this.http.post<readonly UserAdministrationRole[]>(`/api/admin/users/${userId}/roles`, payload);
  }

  resetPassword(userId: string, payload: UserPasswordResetRequest): Observable<UserPasswordResetResponse> {
    return this.http.put<UserPasswordResetResponse>(`/api/admin/users/${userId}/password`, payload);
  }

  removeRole(userId: string, roleId: string, tenantId: string): Observable<void> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.delete<void>(`/api/admin/users/${userId}/roles/${roleId}`, { params });
  }
}
