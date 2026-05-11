import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { UserAdministrationComponent } from './user-administration.component';
import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads tenant users using the authenticated tenant id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findUsers).toHaveBeenCalledWith('tenant-1', expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Utenti');
    expect(fixture.nativeElement.textContent).toContain('Nuovo utente');
    expect(fixture.nativeElement.textContent).toContain('Vista tenant');
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('TENANT_ADMIN');
    expect(fixture.nativeElement.textContent).not.toContain('Riprova');
  }, 15000);

  it('loads platform users without tenant filter', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, 'PLATFORM_OPERATOR');
    fixture.detectChanges();

    expect(service.findUsers).toHaveBeenCalledWith(null, expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Vista platform');
  });

  it('navigates to user detail from the row action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
    };
    component.handleRowAction({
      action: { id: 'view' },
      row: { id: 'user-1' }
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-1']);

    component.handleRowAction({
      action: { id: 'edit' },
      row: { id: 'user-1' }
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-1', 'edit']);
  });

  it('reports load errors through the shared table error state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUsers: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare gli utenti tenant.');
    expect(fixture.nativeElement.textContent).not.toContain('Riprova');
  });

  it('renders the actions column as sticky right in the user list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const actionHeader = fixture.nativeElement.querySelector('thead .data-table-actions-header') as HTMLTableCellElement;
    const actionCell = fixture.nativeElement.querySelector('tbody .data-table-actions-cell') as HTMLTableCellElement;

    expect(actionHeader.classList.contains('data-table-sticky-right')).toBe(true);
    expect(actionCell.classList.contains('data-table-sticky-right')).toBe(true);
  });
});

async function createFixture(serviceOverrides: Partial<UserAdministrationService>, userType = 'TENANT_ADMIN') {
  await TestBed.configureTestingModule({
    imports: [UserAdministrationComponent],
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'current-user',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType
          })
        }
      },
      {
        provide: UserAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(UserAdministrationComponent);
}

function createService(overrides: Partial<UserAdministrationService> = {}): UserAdministrationService {
  const users = [
    {
      id: 'user-1',
      displayName: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      userType: { id: 'type-1', code: 'TENANT_ADMIN', name: 'Tenant admin' },
      tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
      companyProfile: { id: 'company-1', code: 'COMPANY', legalName: 'Company Legal', tradeName: 'Company' },
      active: true,
      locked: false,
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
    }
  ];

  return {
    findUsers: vi.fn(() => of({
      content: users,
      page: 0,
      size: 20,
      totalElements: users.length,
      totalPages: 1,
      first: true,
      last: true
    })),
    findUserById: vi.fn(),
    ...overrides
  } as UserAdministrationService;
}
