import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MasterDataMutationRequest,
  MasterDataPage,
  MasterDataQuery,
  MasterDataResource,
  MasterDataRow
} from './master-data.models';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private readonly http = inject(HttpClient);

  fetchRows(resource: MasterDataResource, query: MasterDataQuery): Observable<MasterDataPage<MasterDataRow>> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('size', String(query.size));

    if (query.search) {
      params = params.set('search', query.search);
    }

    return this.http.get<MasterDataPage<MasterDataRow>>(resource.endpoint, { params });
  }

  createRow(resource: MasterDataResource, payload: MasterDataMutationRequest): Observable<MasterDataRow> {
    return this.http.post<MasterDataRow>(resource.endpoint, payload);
  }

  updateRow(resource: MasterDataResource, id: string, payload: MasterDataMutationRequest): Observable<MasterDataRow> {
    return this.http.put<MasterDataRow>(`${resource.endpoint}/${id}`, payload);
  }

  deleteRow(resource: MasterDataResource, id: string): Observable<void> {
    return this.http.delete<void>(`${resource.endpoint}/${id}`);
  }
}
