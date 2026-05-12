import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { RolePermissionMatrixComponent } from './role-permission-matrix.component';
import { RolePermissionMatrixService } from './role-permission-matrix.service';

describe('RolePermissionMatrixComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads tenant roles and selects the first role', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findRoles).toHaveBeenCalledWith('tenant-1', expect.objectContaining({ page: 0, size: 100 }));
    expect(service.findRole).toHaveBeenCalledWith('role-admin');
    expect(fixture.nativeElement.textContent).toContain('Configurazione permessi');
    expect(fixture.nativeElement.textContent).toContain('Amministratore');
    expect(fixture.nativeElement.textContent).toContain('Ruoli tenant');
    expect(fixture.nativeElement.textContent).toContain('Personalizzato');
    expect(moduleNames(fixture.nativeElement as HTMLElement)).toEqual(['Dati di base', 'Utenti', 'Ruoli']);
  });

  it('keeps system roles read-only in the permission matrix', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findRoles: vi.fn(() => of({
        content: [{
          id: 'role-system',
          tenantId: 'tenant-1',
          code: 'TENANT_ADMIN',
          name: 'Amministratore',
          systemRole: true,
          active: true
        }],
        page: 0,
        size: 100,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true
      })),
      findRole: vi.fn(() => of({
        id: 'role-system',
        tenant: {
          id: 'tenant-1',
          code: 'TENANT_1',
          name: 'Tenant 1'
        },
        code: 'TENANT_ADMIN',
        name: 'Amministratore',
        systemRole: true,
        active: true,
        createdAt: '2026-05-10T09:00:00Z',
        updatedAt: '2026-05-10T09:00:00Z'
      }))
    });

    const fixture = await createFixture(service);
    fixture.detectChanges();

    const saveButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Salva modifiche')) as HTMLButtonElement;
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(fixture.nativeElement.textContent).toContain('I ruoli di sistema sono protetti');
    expect(saveButton.disabled).toBe(true);
    expect(checkbox.disabled).toBe(true);
  });

  it('keeps the matrix readable but blocks mutations without update permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['TENANT.PERMISSION.READ']);
    const component = fixture.componentInstance as RolePermissionMatrixComponent & {
      canReset: () => boolean;
      canSave: () => boolean;
    };
    fixture.detectChanges();

    const saveButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Salva modifiche')) as HTMLButtonElement;
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(component.canReset()).toBe(false);
    expect(component.canSave()).toBe(false);
    expect(saveButton.disabled).toBe(true);
    expect(checkbox.disabled).toBe(true);
    expect(moduleNames(fixture.nativeElement as HTMLElement)).toEqual(['Dati di base', 'Utenti', 'Ruoli']);
  });

  it('tracks unsaved changes and restores the initial snapshot', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const component = fixture.componentInstance as RolePermissionMatrixComponent & {
      canReset: () => boolean;
      canSave: () => boolean;
    };
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(component.canReset()).toBe(false);
    expect(component.canSave()).toBe(false);
    expect(inputs.length).toBe(8);
    expect(Array.from(inputs).every((input) => input.disabled === false)).toBe(true);

    inputs[1].click();
    fixture.detectChanges();

    expect(component.canReset()).toBe(true);
    expect(component.canSave()).toBe(true);

    const resetButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Ripristina')) as HTMLButtonElement;
    resetButton.click();
    fixture.detectChanges();

    expect(component.canReset()).toBe(false);
    expect(component.canSave()).toBe(false);
  });

  it('saves the final permission set with replace semantics', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    inputs[1].click();
    fixture.detectChanges();

    const saveButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Salva modifiche')) as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    expect(service.updateAssignedPermissions).toHaveBeenCalledWith('role-admin', [
      'permission-master-data-create',
      'permission-master-data-read'
    ]);
    expect(successSpy).toHaveBeenCalledWith(
      'Permessi ruolo aggiornati correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows an error state when foundation data fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findRoles: vi.fn(() => throwError(() => new Error('load failed')))
    });

    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare ruoli e catalogo permessi.');
  });

  it('shows user administration together with master data and role modules', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    expect(moduleNames(fixture.nativeElement as HTMLElement)).toEqual(['Dati di base', 'Utenti', 'Ruoli']);
    expect(fixture.nativeElement.textContent).not.toContain('Dipendenti');
    expect(fixture.nativeElement.textContent).not.toContain('Permessi');
  });

  it('shows an empty state when no allowed role-permission modules are available', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findPermissionCatalog: vi.fn(() => of([
        {
          id: 'permission-employee-read',
          tenantId: 'tenant-1',
          code: 'TENANT.EMPLOYEE.READ',
          name: 'Employee read',
          systemPermission: true,
          active: true
        }
      ]))
    });

    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun permesso disponibile per questo ruolo.');
  });
});

async function createFixture(
  serviceOverrides: Partial<RolePermissionMatrixService>,
  permissions: readonly string[] = ['TENANT.PERMISSION.READ', 'TENANT.PERMISSION.UPDATE']
) {
  await TestBed.configureTestingModule({
    imports: [RolePermissionMatrixComponent],
    providers: [
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType: 'TENANT_ADMIN',
            permissions
          })
        }
      },
      {
        provide: RolePermissionMatrixService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(RolePermissionMatrixComponent);
}

function createService(overrides: Partial<RolePermissionMatrixService> = {}): RolePermissionMatrixService {
  const baseRole = {
    id: 'role-admin',
    tenantId: 'tenant-1',
    code: 'TENANT_ADMIN',
    name: 'Amministratore',
    systemRole: false,
    active: true
  };

  const rolePermissions = [
    {
      id: 'permission-master-data-read',
      tenantId: 'tenant-1',
      code: 'TENANT.MASTER_DATA.READ',
      name: 'Master data read',
      systemPermission: true,
      active: true
    }
  ];

  return {
    findRoles: vi.fn(() => of({
      content: [baseRole],
      page: 0,
      size: 100,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })),
    findRole: vi.fn(() => of({
      id: 'role-admin',
      tenant: {
        id: 'tenant-1',
        code: 'TENANT_1',
        name: 'Tenant 1'
      },
      code: 'TENANT_ADMIN',
      name: 'Amministratore',
      systemRole: false,
      active: true,
      createdAt: '2026-05-10T09:00:00Z',
      updatedAt: '2026-05-10T09:00:00Z'
    })),
    findAssignedPermissions: vi.fn(() => of(rolePermissions)),
    findPermissionCatalog: vi.fn(() => of([
      ...rolePermissions,
      {
        id: 'permission-master-data-create',
        tenantId: 'tenant-1',
        code: 'TENANT.MASTER_DATA.CREATE',
        name: 'Master data create',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-master-data-manage',
        tenantId: 'tenant-1',
        code: 'TENANT.MASTER_DATA.MANAGE',
        name: 'Master data manage',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-role-read',
        tenantId: 'tenant-1',
        code: 'TENANT.ROLE.READ',
        name: 'Role read',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-role-update',
        tenantId: 'tenant-1',
        code: 'TENANT.ROLE.UPDATE',
        name: 'Role update',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-user-read',
        tenantId: 'tenant-1',
        code: 'TENANT.USER.READ',
        name: 'User read',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-user-create',
        tenantId: 'tenant-1',
        code: 'TENANT.USER.CREATE',
        name: 'User create',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-user-update',
        tenantId: 'tenant-1',
        code: 'TENANT.USER.UPDATE',
        name: 'User update',
        systemPermission: true,
        active: true
      },
      {
        id: 'permission-user-delete',
        tenantId: 'tenant-1',
        code: 'TENANT.USER.DELETE',
        name: 'User delete',
        systemPermission: true,
        active: true
      }
    ])),
    updateAssignedPermissions: vi.fn((_roleId: string, permissionIds: readonly string[]) => of({
      roleId: 'role-admin',
      tenantId: 'tenant-1',
      permissions: permissionIds.map((permissionId) => ({
        id: permissionId,
        tenantId: 'tenant-1',
        code: permissionId === 'permission-master-data-create' ? 'TENANT.MASTER_DATA.CREATE' : 'TENANT.MASTER_DATA.READ',
        name: permissionId === 'permission-master-data-create' ? 'Master data create' : 'Master data read',
        systemPermission: true,
        active: true
      }))
    })),
    ...overrides
  } as RolePermissionMatrixService;
}

function moduleNames(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('.role-permission-module-name'))
    .map((element) => element.textContent?.trim() ?? '');
}
