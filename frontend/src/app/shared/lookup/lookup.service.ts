import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LookupOption, LookupPage, LookupQuery } from './lookup.models';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private readonly http = inject(HttpClient);

  findCountryLookups(query: LookupQuery): Observable<LookupPage<LookupOption>> {
    return this.getLookupPage('/api/master-data/global/countries/lookup', query);
  }

  findRegionLookups(query: LookupQuery, tenantId: string | null): Observable<LookupPage<LookupOption>> {
    return this.getLookupPage('/api/master-data/global/regions/lookup', query, { tenantId });
  }

  findAreaLookups(query: LookupQuery, tenantId: string | null): Observable<LookupPage<LookupOption>> {
    return this.getLookupPage('/api/master-data/global/areas/lookup', query, { tenantId });
  }

  findZipCodeLookups(query: LookupQuery, tenantId: string | null): Observable<LookupPage<LookupOption>> {
    return this.getLookupPage('/api/master-data/global/zip-codes/lookup', query, { tenantId });
  }

  private getLookupPage(
    path: string,
    query: LookupQuery,
    extraParams: Record<string, string | null | undefined> = {}
  ): Observable<LookupPage<LookupOption>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    for (const [key, value] of Object.entries(extraParams)) {
      if (value?.trim()) {
        params = params.set(key, value.trim());
      }
    }

    return this.http.get<LookupPage<LookupOption>>(path, { params });
  }
}
