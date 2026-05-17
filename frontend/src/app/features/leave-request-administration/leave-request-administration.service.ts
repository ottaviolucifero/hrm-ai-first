import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaveRequestAdministrationListItem } from './leave-request-administration.models';

@Injectable({ providedIn: 'root' })
export class LeaveRequestAdministrationService {
  private readonly http = inject(HttpClient);

  findLeaveRequests(): Observable<readonly LeaveRequestAdministrationListItem[]> {
    return this.http.get<readonly LeaveRequestAdministrationListItem[]>('/api/core-hr/leave-requests');
  }
}
