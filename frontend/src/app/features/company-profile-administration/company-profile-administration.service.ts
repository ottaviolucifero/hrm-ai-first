import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CompanyProfileAdministrationCompanyProfileDetail,
  CompanyProfileAdministrationCompanyProfileListItem,
  CompanyProfileAdministrationCreateRequest,
  CompanyProfileAdministrationFormOptions,
  CompanyProfileAdministrationPage,
  CompanyProfileAdministrationQuery,
  CompanyProfileAdministrationUpdateRequest
} from './company-profile-administration.models';

@Injectable({ providedIn: 'root' })
export class CompanyProfileAdministrationService {
  private readonly http = inject(HttpClient);

  findCompanyProfiles(
    tenantId: string | null,
    query: CompanyProfileAdministrationQuery
  ): Observable<CompanyProfileAdministrationPage<CompanyProfileAdministrationCompanyProfileListItem>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (tenantId) {
      params = params.set('tenantId', tenantId);
    }

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    return this.http.get<CompanyProfileAdministrationPage<CompanyProfileAdministrationCompanyProfileListItem>>(
      '/api/admin/company-profiles',
      { params }
    );
  }

  findFormOptions(): Observable<CompanyProfileAdministrationFormOptions> {
    return this.http.get<CompanyProfileAdministrationFormOptions>('/api/admin/company-profiles/form-options');
  }

  findCompanyProfileById(companyProfileId: string): Observable<CompanyProfileAdministrationCompanyProfileDetail> {
    return this.http.get<CompanyProfileAdministrationCompanyProfileDetail>(`/api/admin/company-profiles/${companyProfileId}`);
  }

  createCompanyProfile(payload: CompanyProfileAdministrationCreateRequest): Observable<CompanyProfileAdministrationCompanyProfileDetail> {
    return this.http.post<CompanyProfileAdministrationCompanyProfileDetail>('/api/admin/company-profiles', payload);
  }

  updateCompanyProfile(
    companyProfileId: string,
    payload: CompanyProfileAdministrationUpdateRequest
  ): Observable<CompanyProfileAdministrationCompanyProfileDetail> {
    return this.http.put<CompanyProfileAdministrationCompanyProfileDetail>(
      `/api/admin/company-profiles/${companyProfileId}`,
      payload
    );
  }

  activateCompanyProfile(companyProfileId: string): Observable<CompanyProfileAdministrationCompanyProfileDetail> {
    return this.http.put<CompanyProfileAdministrationCompanyProfileDetail>(
      `/api/admin/company-profiles/${companyProfileId}/activate`,
      {}
    );
  }

  deactivateCompanyProfile(companyProfileId: string): Observable<CompanyProfileAdministrationCompanyProfileDetail> {
    return this.http.put<CompanyProfileAdministrationCompanyProfileDetail>(
      `/api/admin/company-profiles/${companyProfileId}/deactivate`,
      {}
    );
  }

  deleteCompanyProfile(companyProfileId: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/company-profiles/${companyProfileId}`);
  }
}
