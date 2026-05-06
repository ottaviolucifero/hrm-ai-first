import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MasterDataPage, MasterDataQuery, MasterDataResource, MasterDataRow } from './master-data.models';

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
}
