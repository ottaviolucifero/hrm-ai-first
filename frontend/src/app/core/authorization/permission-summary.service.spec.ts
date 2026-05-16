import { TestBed } from '@angular/core/testing';

import { PermissionSummaryService } from './permission-summary.service';

describe('PermissionSummaryService', () => {
  let service: PermissionSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionSummaryService);
  });

  it('builds a CRUD summary from explicit permission codes', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      permissions: ['TENANT.USER.READ', 'TENANT.USER.CREATE', 'TENANT.USER.DELETE']
    }, 'users');

    expect(summary).toEqual({
      canView: true,
      canCreate: true,
      canUpdate: false,
      canDelete: true,
      hasAnyPermission: true,
      isFrozen: false
    });
  });

  it('accepts VIEW as alias of READ for auth payload compatibility', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      permissions: ['TENANT.MASTER_DATA.VIEW', 'TENANT.MASTER_DATA.UPDATE']
    }, 'master-data');

    expect(summary.canView).toBe(true);
    expect(summary.canUpdate).toBe(true);
    expect(summary.canCreate).toBe(false);
    expect(summary.canDelete).toBe(false);
    expect(summary.hasAnyPermission).toBe(true);
    expect(summary.isFrozen).toBe(false);
  });

  it('falls back to authorities when permissions are not present', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      authorities: ['TENANT.ROLE.READ', 'TENANT.ROLE.UPDATE']
    }, 'roles');

    expect(summary.canView).toBe(true);
    expect(summary.canUpdate).toBe(true);
    expect(summary.canCreate).toBe(false);
    expect(summary.canDelete).toBe(false);
    expect(summary.hasAnyPermission).toBe(true);
    expect(summary.isFrozen).toBe(false);
  });

  it('supports platform tenant administration permissions', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'PLATFORM_SUPER_ADMIN',
      permissions: ['PLATFORM.TENANT.READ', 'PLATFORM.TENANT.UPDATE', 'PLATFORM.TENANT.DELETE']
    }, 'tenants');

    expect(summary.canView).toBe(true);
    expect(summary.canCreate).toBe(false);
    expect(summary.canUpdate).toBe(true);
    expect(summary.canDelete).toBe(true);
    expect(summary.hasAnyPermission).toBe(true);
    expect(summary.isFrozen).toBe(false);
  });

  it('supports company profile administration permissions', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.COMPANY_PROFILE.DELETE'
      ]
    }, 'company-profiles');

    expect(summary.canView).toBe(true);
    expect(summary.canCreate).toBe(true);
    expect(summary.canUpdate).toBe(true);
    expect(summary.canDelete).toBe(true);
    expect(summary.hasAnyPermission).toBe(true);
    expect(summary.isFrozen).toBe(false);
  });

  it('supports device administration permissions', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      permissions: [
        'TENANT.DEVICE.READ',
        'TENANT.DEVICE.CREATE',
        'TENANT.DEVICE.UPDATE',
        'TENANT.DEVICE.DELETE'
      ]
    }, 'devices');

    expect(summary.canView).toBe(true);
    expect(summary.canCreate).toBe(true);
    expect(summary.canUpdate).toBe(true);
    expect(summary.canDelete).toBe(true);
    expect(summary.hasAnyPermission).toBe(true);
    expect(summary.isFrozen).toBe(false);
  });

  it('ignores USER_TYPE authorities and invalid codes', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN',
      authorities: ['USER_TYPE_TENANT_ADMIN', 'INVALID_CODE', 'TENANT.USER.MANAGE']
    }, 'users');

    expect(summary.canView).toBe(false);
    expect(summary.canCreate).toBe(false);
    expect(summary.canUpdate).toBe(false);
    expect(summary.canDelete).toBe(false);
    expect(summary.hasAnyPermission).toBe(false);
    expect(summary.isFrozen).toBe(true);
  });

  it('treats missing permission data as a frozen module', () => {
    const summary = service.summaryForModule({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN'
    }, 'master-data');

    expect(summary.hasAnyPermission).toBe(false);
    expect(summary.isFrozen).toBe(true);
    expect(service.canAccess({
      id: 'user-1',
      tenantId: 'tenant-1',
      email: 'qa@example.com',
      userType: 'TENANT_ADMIN'
    }, 'master-data', 'view')).toBe(false);
  });
});
