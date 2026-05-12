import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RoleAdministrationService } from './role-administration.service';

describe('RoleAdministrationService', () => {
  let service: RoleAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RoleAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests roles with tenant filter and pagination', () => {
    service.findRoles('tenant-1', { page: 0, size: 20, search: 'admin' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/roles' &&
      httpRequest.params.get('tenantId') === 'tenant-1' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '20' &&
      httpRequest.params.get('search') === 'admin'
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

  it('creates a role with the expected payload', () => {
    service.createRole({
      tenantId: 'tenant-1',
      name: 'Role custom',
      description: 'Description',
      active: true
    }).subscribe();

    const request = httpTestingController.expectOne('/api/admin/roles');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      tenantId: 'tenant-1',
      name: 'Role custom',
      description: 'Description',
      active: true
    });
    request.flush({ id: 'role-1' });
  });

  it('updates activate deactivate and delete endpoints', () => {
    service.updateRole('role-1', { name: 'Updated', description: null }).subscribe();
    service.activateRole('role-1').subscribe();
    service.deactivateRole('role-1').subscribe();
    service.deleteRole('role-1').subscribe();

    const updateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/roles/role-1' &&
      httpRequest.method === 'PUT'
    );
    const activateRequest = httpTestingController.expectOne('/api/admin/roles/role-1/activate');
    const deactivateRequest = httpTestingController.expectOne('/api/admin/roles/role-1/deactivate');
    const deleteRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/roles/role-1' &&
      httpRequest.method === 'DELETE'
    );

    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({ name: 'Updated', description: null });
    expect(activateRequest.request.method).toBe('PUT');
    expect(activateRequest.request.body).toEqual({});
    expect(deactivateRequest.request.method).toBe('PUT');
    expect(deactivateRequest.request.body).toEqual({});
    expect(deleteRequest.request.method).toBe('DELETE');

    updateRequest.flush({ id: 'role-1' });
    activateRequest.flush({ id: 'role-1' });
    deactivateRequest.flush({ id: 'role-1' });
    deleteRequest.flush(null);
  });
});
