import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RoleAdministrationComponent } from './role-administration.component';
import { RoleAdministrationService } from './role-administration.service';

describe('RoleAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads the role table and opens the create form', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findRoles).toHaveBeenCalledWith('tenant-1', expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Ruoli');
    expect(fixture.nativeElement.textContent).toContain('I ruoli di sistema sono protetti');

    const newButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo ruolo')) as HTMLButtonElement;
    newButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-master-data-form')).toBeTruthy();
  }, 15000);

  it('shows only the allowed actions for system roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const systemRoleButtons = rows[0].querySelectorAll('.data-table-action');
    const customRoleButtons = rows[1].querySelectorAll('.data-table-action');

    expect(systemRoleButtons).toHaveLength(1);
    expect(customRoleButtons.length).toBeGreaterThan(1);
  });

  it('keeps the create action visible but disabled without create permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['TENANT.ROLE.READ']);
    fixture.detectChanges();

    const newButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo ruolo')) as HTMLButtonElement;

    expect(newButton).toBeTruthy();
    expect(newButton.disabled).toBe(true);
  });

  it('creates a custom role using the authenticated tenant id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      openCreateForm: () => void;
      handleFormSave: (event: { mode: 'create'; value: Record<string, unknown> }) => void;
    };

    component.openCreateForm();
    fixture.detectChanges();

    component.handleFormSave({
      mode: 'create',
      value: {
        code: 'ROLE_CUSTOM',
        name: 'Role custom',
        description: 'Description',
        active: true
      }
    });

    expect(service.createRole).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      code: 'ROLE_CUSTOM',
      name: 'Role custom',
      description: 'Description',
      active: true
    });
  });

  it('reports load errors through the shared table error state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findRoles: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i ruoli tenant.');
  });
});

async function createFixture(
  serviceOverrides: Partial<RoleAdministrationService>,
  permissions: readonly string[] = ['TENANT.ROLE.READ', 'TENANT.ROLE.CREATE', 'TENANT.ROLE.UPDATE', 'TENANT.ROLE.DELETE']
) {
  await TestBed.configureTestingModule({
    imports: [RoleAdministrationComponent],
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
        provide: RoleAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(RoleAdministrationComponent);
}

function createService(overrides: Partial<RoleAdministrationService> = {}): RoleAdministrationService {
  const roles = [
    {
      id: 'role-system',
      tenantId: 'tenant-1',
      code: 'TENANT_ADMIN',
      name: 'Tenant admin',
      description: 'System role',
      systemRole: true,
      active: true,
      updatedAt: '2026-05-10T09:00:00Z'
    },
    {
      id: 'role-custom',
      tenantId: 'tenant-1',
      code: 'HR_EDITOR',
      name: 'HR editor',
      description: 'Custom role',
      systemRole: false,
      active: true,
      updatedAt: '2026-05-10T10:00:00Z'
    }
  ];

  return {
    findRoles: vi.fn(() => of({
      content: roles,
      page: 0,
      size: 20,
      totalElements: roles.length,
      totalPages: 1,
      first: true,
      last: true
    })),
    createRole: vi.fn(() => of(roles[1])),
    updateRole: vi.fn(() => of(roles[1])),
    activateRole: vi.fn(() => of({ ...roles[1], active: true })),
    deactivateRole: vi.fn(() => of({ ...roles[1], active: false })),
    deleteRole: vi.fn(() => of(void 0)),
    ...overrides
  } as RoleAdministrationService;
}
