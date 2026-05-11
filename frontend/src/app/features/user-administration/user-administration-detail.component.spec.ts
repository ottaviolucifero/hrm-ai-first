import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

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
    ...overrides
  } as UserAdministrationService;
}
