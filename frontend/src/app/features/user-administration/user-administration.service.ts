import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  UserAdministrationPage,
  UserAdministrationQuery,
  UserAdministrationUserDetail,
  UserAdministrationUserListItem
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
}
