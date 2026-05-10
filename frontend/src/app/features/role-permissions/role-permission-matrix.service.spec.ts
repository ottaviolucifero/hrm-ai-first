import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RolePermissionMatrixService } from './role-permission-matrix.service';

describe('RolePermissionMatrixService', () => {
  let service: RolePermissionMatrixService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RolePermissionMatrixService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests role list with tenant filter and pagination', () => {
    service.findRoles('tenant-1', {
      page: 0,
      size: 100
    }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/roles' &&
      httpRequest.params.get('tenantId') === 'tenant-1' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '100'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 0,
      size: 100,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('collects permissions across multiple catalog pages', () => {
    let collectedPermissions: readonly unknown[] = [];

    service.findPermissionCatalog(2).subscribe((permissions) => {
      collectedPermissions = permissions;
    });

    const firstRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/master-data/governance-security/permissions' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '2'
    );

    firstRequest.flush({
      content: [
        {
          id: 'permission-1',
          tenantId: 'tenant-1',
          code: 'TENANT.ROLE.READ',
          name: 'Read role',
          systemPermission: true,
          active: true
        },
        {
          id: 'permission-2',
          tenantId: 'tenant-1',
          code: 'TENANT.ROLE.CREATE',
          name: 'Create role',
          systemPermission: true,
          active: true
        }
      ],
      page: 0,
      size: 2,
      totalElements: 3,
      totalPages: 2,
      first: true,
      last: false
    });

    const secondRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/master-data/governance-security/permissions' &&
      httpRequest.params.get('page') === '1' &&
      httpRequest.params.get('size') === '2'
    );

    secondRequest.flush({
      content: [
        {
          id: 'permission-3',
          tenantId: 'tenant-1',
          code: 'TENANT.ROLE.UPDATE',
          name: 'Update role',
          systemPermission: true,
          active: true
        }
      ],
      page: 1,
      size: 2,
      totalElements: 3,
      totalPages: 2,
      first: false,
      last: true
    });

    expect(collectedPermissions).toHaveLength(3);
  });

  it('replaces assigned permissions with the expected payload', () => {
    service.updateAssignedPermissions('role-1', ['permission-2', 'permission-1']).subscribe();

    const request = httpTestingController.expectOne('/api/admin/roles/role-1/permissions');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      permissionIds: ['permission-2', 'permission-1']
    });
    request.flush({
      roleId: 'role-1',
      tenantId: 'tenant-1',
      permissions: []
    });
  });
});
