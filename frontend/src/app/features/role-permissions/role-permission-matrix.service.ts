import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, map, reduce } from 'rxjs';

import {
  RolePermissionMatrixAssignmentResponse,
  RolePermissionMatrixPage,
  RolePermissionMatrixPermission,
  RolePermissionMatrixRoleDetail,
  RolePermissionMatrixRoleListItem
} from './role-permission-matrix.models';

@Injectable({ providedIn: 'root' })
export class RolePermissionMatrixService {
  private readonly http = inject(HttpClient);

  findRoles(
    tenantId: string,
    query: {
      readonly page: number;
      readonly size: number;
      readonly search?: string;
    }
  ): Observable<RolePermissionMatrixPage<RolePermissionMatrixRoleListItem>> {
    let params = new HttpParams()
      .set('tenantId', tenantId)
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<RolePermissionMatrixPage<RolePermissionMatrixRoleListItem>>('/api/admin/roles', { params });
  }

  findRole(roleId: string): Observable<RolePermissionMatrixRoleDetail> {
    return this.http.get<RolePermissionMatrixRoleDetail>(`/api/admin/roles/${roleId}`);
  }

  findAssignedPermissions(roleId: string): Observable<readonly RolePermissionMatrixPermission[]> {
    return this.http.get<readonly RolePermissionMatrixPermission[]>(`/api/admin/roles/${roleId}/permissions`);
  }

  updateAssignedPermissions(
    roleId: string,
    permissionIds: readonly string[]
  ): Observable<RolePermissionMatrixAssignmentResponse> {
    return this.http.put<RolePermissionMatrixAssignmentResponse>(`/api/admin/roles/${roleId}/permissions`, {
      permissionIds
    });
  }

  findPermissionCatalog(pageSize = 100): Observable<readonly RolePermissionMatrixPermission[]> {
    return this.fetchPermissionPage(0, pageSize).pipe(
      expand((page) => page.last ? EMPTY : this.fetchPermissionPage(page.page + 1, pageSize)),
      map((page) => page.content),
      reduce(
        (allPermissions, content) => [...allPermissions, ...content],
        [] as RolePermissionMatrixPermission[]
      )
    );
  }

  private fetchPermissionPage(
    page: number,
    size: number
  ): Observable<RolePermissionMatrixPage<RolePermissionMatrixPermission>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<RolePermissionMatrixPage<RolePermissionMatrixPermission>>(
      '/api/master-data/governance-security/permissions',
      { params }
    );
  }
}
