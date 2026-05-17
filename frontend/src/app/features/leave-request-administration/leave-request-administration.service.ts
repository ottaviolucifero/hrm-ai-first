import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { LookupOption, LookupPage, LookupQuery } from '../../shared/lookup/lookup.models';
import {
  LeaveRequestAdministrationCreateRequest,
  LeaveRequestAdministrationDetail,
  LeaveRequestAdministrationEmployeeOption,
  LeaveRequestAdministrationListItem,
  LeaveRequestAdministrationReference,
  LeaveRequestAdministrationUpdateRequest
} from './leave-request-administration.models';

interface TenantMasterDataResponse {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly active: boolean | null;
}

interface TenantMasterDataPageResponse {
  readonly content: readonly TenantMasterDataResponse[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

interface EmployeeResponse {
  readonly id: string;
  readonly tenant: LeaveRequestAdministrationReference | null;
  readonly companyProfile: LeaveRequestAdministrationReference | null;
  readonly employeeCode: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly active: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class LeaveRequestAdministrationService {
  private readonly http = inject(HttpClient);

  findLeaveRequests(): Observable<readonly LeaveRequestAdministrationListItem[]> {
    return this.http.get<readonly LeaveRequestAdministrationListItem[]>('/api/core-hr/leave-requests');
  }

  findLeaveRequestById(leaveRequestId: string): Observable<LeaveRequestAdministrationDetail> {
    return this.http.get<LeaveRequestAdministrationDetail>(`/api/admin/leave-requests/${leaveRequestId}`);
  }

  createLeaveRequest(payload: LeaveRequestAdministrationCreateRequest): Observable<LeaveRequestAdministrationDetail> {
    return this.http.post<LeaveRequestAdministrationDetail>('/api/admin/leave-requests', payload);
  }

  updateLeaveRequest(
    leaveRequestId: string,
    payload: LeaveRequestAdministrationUpdateRequest
  ): Observable<LeaveRequestAdministrationDetail> {
    return this.http.put<LeaveRequestAdministrationDetail>(`/api/admin/leave-requests/${leaveRequestId}`, payload);
  }

  approveLeaveRequest(leaveRequestId: string): Observable<LeaveRequestAdministrationDetail> {
    return this.http.post<LeaveRequestAdministrationDetail>(`/api/admin/leave-requests/${leaveRequestId}/approve`, null);
  }

  rejectLeaveRequest(leaveRequestId: string): Observable<LeaveRequestAdministrationDetail> {
    return this.http.post<LeaveRequestAdministrationDetail>(`/api/admin/leave-requests/${leaveRequestId}/reject`, null);
  }

  cancelLeaveRequest(leaveRequestId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/leave-requests/${leaveRequestId}`);
  }

  findEmployeeOptions(): Observable<readonly LeaveRequestAdministrationEmployeeOption[]> {
    return this.http.get<readonly EmployeeResponse[]>('/api/core-hr/employees')
      .pipe(map((employees) => employees.map((employee) => this.toEmployeeOption(employee))));
  }

  findLeaveRequestTypeLookups(
    query: LookupQuery,
    tenantId: string | null
  ): Observable<LookupPage<LookupOption>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<TenantMasterDataPageResponse>('/api/master-data/hr-business/leave-request-types', { params })
      .pipe(
        map((page) => {
          const filteredOptions = page.content
            .filter((item) => item.active === true)
            .filter((item) => !tenantId || item.tenantId === tenantId)
            .map((item) => ({
              id: item.id,
              code: item.code,
              name: item.name,
              metadata: {
                tenantId: item.tenantId,
                active: String(item.active === true)
              }
            }));

          return {
            ...page,
            content: filteredOptions,
            totalElements: filteredOptions.length
          };
        })
      );
  }

  private toEmployeeOption(employee: EmployeeResponse): LeaveRequestAdministrationEmployeeOption {
    const displayName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();

    return {
      id: employee.id,
      code: employee.employeeCode,
      name: displayName || employee.employeeCode,
      tenant: employee.tenant,
      companyProfile: employee.companyProfile,
      active: employee.active
    };
  }
}
