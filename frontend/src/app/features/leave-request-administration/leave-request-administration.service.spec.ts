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

  it('requests admin leave request detail by id', () => {
    service.findLeaveRequestById('leave-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests/leave-1');

    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('posts the create payload with tenantId', () => {
    const payload = {
      tenantId: 'tenant-1',
      employeeId: 'employee-1',
      leaveRequestTypeId: 'type-1',
      startDate: '2026-05-10',
      endDate: '2026-05-11',
      durationDays: 2,
      deductFromBalance: true,
      deductedDays: 2,
      reason: 'Vacation',
      status: 'DRAFT' as const,
      comments: 'Created from UI',
      urgent: false,
      urgentReason: null
    };

    service.createLeaveRequest(payload).subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({});
  });

  it('puts the update payload without tenantId', () => {
    const payload = {
      employeeId: 'employee-1',
      leaveRequestTypeId: 'type-1',
      startDate: '2026-05-10',
      endDate: '2026-05-12',
      durationDays: 3,
      deductFromBalance: true,
      deductedDays: 3,
      reason: 'Updated',
      status: 'SUBMITTED' as const,
      comments: 'Updated from UI',
      urgent: true,
      urgentReason: 'Medical'
    };

    service.updateLeaveRequest('leave-1', payload).subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests/leave-1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    expect('tenantId' in request.request.body).toBe(false);
    request.flush({});
  });

  it('posts to approve without a request body and returns updated detail', () => {
    service.approveLeaveRequest('leave-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests/leave-1/approve');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeNull();
    request.flush({});
  });

  it('posts to reject without a request body and returns updated detail', () => {
    service.rejectLeaveRequest('leave-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests/leave-1/reject');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeNull();
    request.flush({});
  });

  it('calls delete on the admin endpoint to cancel a leave request', () => {
    service.cancelLeaveRequest('leave-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/leave-requests/leave-1');

    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('loads leave request type lookup options and filters inactive or cross-tenant rows', () => {
    let result: unknown;

    service.findLeaveRequestTypeLookups({ page: 0, size: 25, search: 'fe' }, 'tenant-1').subscribe((page) => {
      result = page;
    });

    const request = httpTestingController.expectOne((candidate) =>
      candidate.url === '/api/master-data/hr-business/leave-request-types'
      && candidate.params.get('page') === '0'
      && candidate.params.get('size') === '25'
      && candidate.params.get('search') === 'fe'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [
        { id: 'type-1', tenantId: 'tenant-1', code: 'FER', name: 'Ferie', active: true },
        { id: 'type-2', tenantId: 'tenant-1', code: 'PER', name: 'Permesso', active: false },
        { id: 'type-3', tenantId: 'tenant-2', code: 'MAL', name: 'Malattia', active: true }
      ],
      page: 0,
      size: 25,
      totalElements: 3,
      totalPages: 1,
      first: true,
      last: true
    });

    expect(result).toEqual({
      content: [
        {
          id: 'type-1',
          code: 'FER',
          name: 'Ferie',
          metadata: {
            tenantId: 'tenant-1',
            active: 'true'
          }
        }
      ],
      page: 0,
      size: 25,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    });
  });

  it('loads employee options from the core hr endpoint', () => {
    let result: unknown;

    service.findEmployeeOptions().subscribe((employees) => {
      result = employees;
    });

    const request = httpTestingController.expectOne('/api/core-hr/employees');

    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 'employee-1',
        tenant: { id: 'tenant-1', code: 'TEN', name: 'Tenant' },
        companyProfile: { id: 'company-1', code: 'CP001', name: 'HQ' },
        employeeCode: 'EMP001',
        firstName: 'Mario',
        lastName: 'Rossi',
        active: true
      }
    ]);

    expect(result).toEqual([
      {
        id: 'employee-1',
        code: 'EMP001',
        name: 'Mario Rossi',
        tenant: { id: 'tenant-1', code: 'TEN', name: 'Tenant' },
        companyProfile: { id: 'company-1', code: 'CP001', name: 'HQ' },
        active: true
      }
    ]);
  });
});
