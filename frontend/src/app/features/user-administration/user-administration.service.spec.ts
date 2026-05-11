import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationService', () => {
  let service: UserAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests tenant users with tenant filter and pagination', () => {
    service.findUsers('tenant-1', { page: 0, size: 20, search: 'ada' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users' &&
      httpRequest.params.get('tenantId') === 'tenant-1' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '20' &&
      httpRequest.params.get('search') === 'ada'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('requests platform users without tenant filter', () => {
    service.findUsers(null, { page: 1, size: 50 }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users' &&
      !httpRequest.params.has('tenantId') &&
      httpRequest.params.get('page') === '1' &&
      httpRequest.params.get('size') === '50'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 1,
      size: 50,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('requests user detail', () => {
    service.findUserById('user-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/users/user-1');

    expect(request.request.method).toBe('GET');
    request.flush({ id: 'user-1' });
  });

  it('requests user form options', () => {
    service.findFormOptions().subscribe();

    const request = httpTestingController.expectOne('/api/admin/users/form-options');

    expect(request.request.method).toBe('GET');
    request.flush({
      tenants: [],
      userTypes: [],
      authenticationMethod: { id: 'auth-1', code: 'PASSWORD_ONLY', name: 'Password only' },
      companyProfiles: []
    });
  });

  it('creates and updates users', () => {
    service.createUser({
      email: 'new@example.com',
      userTypeId: 'type-1',
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      initialPassword: 'TenantCreate1!'
    }).subscribe();

    const createRequest = httpTestingController.expectOne('/api/admin/users');
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({
      email: 'new@example.com',
      userTypeId: 'type-1',
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      initialPassword: 'TenantCreate1!'
    });
    createRequest.flush({ id: 'user-2' });

    service.updateUser('user-2', {
      email: 'updated@example.com',
      companyProfileId: null
    }).subscribe();

    const updateRequest = httpTestingController.expectOne('/api/admin/users/user-2');
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({
      email: 'updated@example.com',
      companyProfileId: null
    });
    updateRequest.flush({ id: 'user-2' });
  });

  it('requests assigned user roles for a tenant', () => {
    service.findAssignedRoles('user-1', 'tenant-1').subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users/user-1/roles' &&
      httpRequest.params.get('tenantId') === 'tenant-1'
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('requests available user roles for a tenant', () => {
    service.findAvailableRoles('user-1', 'tenant-1').subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users/user-1/available-roles' &&
      httpRequest.params.get('tenantId') === 'tenant-1'
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('assigns and removes user roles', () => {
    service.assignRole('user-1', { tenantId: 'tenant-1', roleId: 'role-1' }).subscribe();

    const assignRequest = httpTestingController.expectOne('/api/admin/users/user-1/roles');
    expect(assignRequest.request.method).toBe('POST');
    expect(assignRequest.request.body).toEqual({ tenantId: 'tenant-1', roleId: 'role-1' });
    assignRequest.flush([]);

    service.removeRole('user-1', 'role-1', 'tenant-1').subscribe();

    const removeRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users/user-1/roles/role-1' &&
      httpRequest.params.get('tenantId') === 'tenant-1'
    );
    expect(removeRequest.request.method).toBe('DELETE');
    removeRequest.flush(null);
  });

  it('resets user password for a tenant', () => {
    service.resetPassword('user-1', { tenantId: 'tenant-1', newPassword: 'TenantReset1!' }).subscribe();

    const request = httpTestingController.expectOne('/api/admin/users/user-1/password');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ tenantId: 'tenant-1', newPassword: 'TenantReset1!' });
    request.flush({
      userId: 'user-1',
      tenantId: 'tenant-1',
      passwordChangedAt: '2026-05-11T10:15:30Z',
      locked: false,
      failedLoginAttempts: 0
    });
  });
});
