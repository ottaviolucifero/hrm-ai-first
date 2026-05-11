import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NotificationService } from '../../shared/feedback/notification.service';
import { UserAdministrationDetailComponent } from './user-administration-detail.component';
import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders user detail without editable controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findUserById).toHaveBeenCalledWith('user-1');
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('TENANT_ADMIN');
    expect(fixture.nativeElement.textContent).toContain('PASSWORD_ONLY');
    expect(fixture.nativeElement.textContent).toContain('Ruoli assegnati');
    expect(fixture.nativeElement.textContent).toContain('Gestione ruoli utente');
    expect(service.findAssignedRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
  }, 15000);

  it('shows an error state when detail loading fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => throwError(() => new Error('detail failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio utente.');
  });

  it('shows empty role states when a valid tenant has no assigned or available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findAssignedRoles: vi.fn(() => of([])),
      findAvailableRoles: vi.fn(() => of([]))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findAssignedRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(fixture.nativeElement.textContent).toContain('Nessun ruolo assegnato per il tenant selezionato.');
    expect(fixture.nativeElement.textContent).toContain('Nessun ruolo disponibile da assegnare.');
    expect(fixture.nativeElement.textContent).not.toContain('Impossibile caricare i ruoli utente.');
  });

  it('assigns an available role and refreshes available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as {
      selectRoleForAssignment: (event: Event) => void;
      assignSelectedRole: () => void;
    };

    component.selectRoleForAssignment({ target: { value: 'role-2' } } as unknown as Event);
    component.assignSelectedRole();
    fixture.detectChanges();

    expect(service.assignRole).toHaveBeenCalledWith('user-1', {
      tenantId: 'tenant-1',
      roleId: 'role-2'
    });
    expect(service.findAvailableRoles).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Ruolo assegnato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });
});

async function createFixture(serviceOverrides: Partial<UserAdministrationService>) {
  await TestBed.configureTestingModule({
    imports: [UserAdministrationDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'user-1' : null
            }
          }
        }
      },
      {
        provide: UserAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(UserAdministrationDetailComponent);
}

function createService(overrides: Partial<UserAdministrationService> = {}): UserAdministrationService {
  const user = {
    id: 'user-1',
    displayName: 'Ada Lovelace',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    userType: { id: 'type-1', code: 'TENANT_ADMIN', name: 'Tenant admin' },
    tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    primaryTenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfile: { id: 'company-1', code: 'COMPANY', legalName: 'Company Legal', tradeName: 'Company' },
    employee: { id: 'employee-1', employeeCode: 'EMP-001', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    authenticationMethod: { id: 'auth-1', code: 'PASSWORD_ONLY', name: 'Password only' },
    preferredLanguage: 'it',
    timeZone: null,
    active: true,
    locked: false,
    emailVerifiedAt: null,
    passwordChangedAt: null,
    lastLoginAt: null,
    failedLoginAttempts: 0,
    emailOtpEnabled: false,
    appOtpEnabled: false,
    strongAuthenticationRequired: false,
    roles: [
      {
        id: 'role-1',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        code: 'TENANT_ADMIN',
        name: 'Tenant admin',
        systemRole: true,
        active: true
      }
    ],
    tenantAccesses: [
      {
        id: 'access-1',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        accessRole: 'TENANT_ADMIN',
        active: true,
        createdAt: '2026-05-10T09:00:00Z',
        updatedAt: '2026-05-10T09:00:00Z'
      }
    ],
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z'
  };

  return {
    findUsers: vi.fn(),
    findUserById: vi.fn(() => of(user)),
    findAssignedRoles: vi.fn(() => of(user.roles)),
    findAvailableRoles: vi.fn(() => of([
      {
        id: 'role-2',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        code: 'HR_MANAGER',
        name: 'HR manager',
        systemRole: false,
        active: true
      }
    ])),
    assignRole: vi.fn(() => of([
      ...user.roles,
      {
        id: 'role-2',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        code: 'HR_MANAGER',
        name: 'HR manager',
        systemRole: false,
        active: true
      }
    ])),
    removeRole: vi.fn(() => of(void 0)),
    ...overrides
  } as UserAdministrationService;
}
