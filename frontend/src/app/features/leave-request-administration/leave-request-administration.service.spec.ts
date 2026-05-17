import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LeaveRequestAdministrationService } from './leave-request-administration.service';

describe('LeaveRequestAdministrationService', () => {
  let service: LeaveRequestAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LeaveRequestAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests leave requests from the core hr read-only endpoint', () => {
    service.findLeaveRequests().subscribe();

    const request = httpTestingController.expectOne('/api/core-hr/leave-requests');

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
