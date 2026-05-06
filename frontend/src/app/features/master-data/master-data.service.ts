import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MasterDataResource, MasterDataRow } from './master-data.models';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private readonly http = inject(HttpClient);

  fetchRows(resource: MasterDataResource): Observable<readonly MasterDataRow[]> {
    return this.http.get<readonly MasterDataRow[]>(resource.endpoint);
  }
}
