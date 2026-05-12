import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  UserAdministrationFormOptions,
  UserAdministrationPage,
  UserPasswordResetRequest,
  UserPasswordResetResponse,
  UserAdministrationQuery,
  UserAdministrationRole,
  UserAdministrationUserCreateRequest,
  UserAdministrationUserDetail,
  UserAdministrationUserUpdateRequest,
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

  findFormOptions(): Observable<UserAdministrationFormOptions> {
    return this.http.get<UserAdministrationFormOptions>('/api/admin/users/form-options');
  }

  createUser(payload: UserAdministrationUserCreateRequest): Observable<UserAdministrationUserDetail> {
    return this.http.post<UserAdministrationUserDetail>('/api/admin/users', payload);
  }

  findUserById(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.get<UserAdministrationUserDetail>(`/api/admin/users/${userId}`);
  }

  updateUser(userId: string, payload: UserAdministrationUserUpdateRequest): Observable<UserAdministrationUserDetail> {
    return this.http.put<UserAdministrationUserDetail>(`/api/admin/users/${userId}`, payload);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/users/${userId}`);
  }

  activateUser(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.put<UserAdministrationUserDetail>(`/api/admin/users/${userId}/activate`, {});
  }

  deactivateUser(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.patch<UserAdministrationUserDetail>(`/api/admin/users/${userId}/deactivate`, {});
  }

  lockUser(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.put<UserAdministrationUserDetail>(`/api/admin/users/${userId}/lock`, {});
  }

  unlockUser(userId: string): Observable<UserAdministrationUserDetail> {
    return this.http.put<UserAdministrationUserDetail>(`/api/admin/users/${userId}/unlock`, {});
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
