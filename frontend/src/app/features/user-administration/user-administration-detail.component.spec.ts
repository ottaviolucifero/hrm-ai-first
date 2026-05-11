import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NotificationService } from '../../shared/feedback/notification.service';
import { UserAdministrationDetailComponent } from './user-administration-detail.component';
import { UserAdministrationService } from './user-administration.service';

interface UserAdministrationDetailComponentTestHandle {
  readonly passwordForm: {
    setValue: (value: { newPassword: string; confirmPassword: string }) => void;
    getRawValue: () => { newPassword: string; confirmPassword: string };
  };
  readonly user: () => { passwordChangedAt: string | null };
  readonly passwordSaving: () => boolean;
}

describe('UserAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders user detail with inline password reset controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('#user-detail-title') as HTMLElement;
    const headerSubtitle = fixture.nativeElement.querySelector('.user-detail-subtitle') as HTMLElement;
    const headerDescription = fixture.nativeElement.querySelector('.user-detail-description') as HTMLElement;
    const identitySection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-identity"]') as HTMLElement;
    const tenantSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-tenant"]') as HTMLElement;
    const securitySection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-security"]') as HTMLElement;
    const roleManagementSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-role-management"]') as HTMLElement;

    expect(service.findUserById).toHaveBeenCalledWith('user-1');
    expect(title.textContent?.trim()).toBe('Ada Lovelace');
    expect(headerSubtitle.textContent?.trim()).toBe('ada@example.com');
    expect(headerDescription.textContent).toContain('sicurezza');
    expect(headerDescription.textContent).not.toContain('accessi tenant');
    expect(fixture.nativeElement.textContent).toContain('Identità');
    expect(fixture.nativeElement.textContent).toContain('Gestione ruoli utente');
    expect(fixture.nativeElement.textContent).toContain('Reset password');
    expect(fixture.nativeElement.textContent).toContain('Modifica');
    expect(fixture.nativeElement.textContent).toContain('Creato');
    expect(fixture.nativeElement.textContent).toContain('Aggiornato');
    expect(fixture.nativeElement.textContent).not.toContain('accessi tenant');
    expect(fixture.nativeElement.textContent).not.toContain('Tenant abilitati');
    expect(fixture.nativeElement.textContent).toContain('Ultimo cambio password');
    expect(fixture.nativeElement.textContent).not.toContain('Riprova');
    expect(identitySection.textContent).not.toContain('Nome visualizzato');
    expect(identitySection.textContent).toContain('Amministratore tenant');
    expect(identitySection.textContent).not.toContain('TENANT_ADMIN');
    expect(tenantSection.textContent).toContain('Tenant di appartenenza');
    expect(tenantSection.textContent).not.toContain('Tenant predefinito');
    expect(tenantSection.textContent).toContain('Azienda');
    expect(securitySection.textContent).toContain('Password');
    expect(securitySection.textContent).toContain('Mai');
    expect(securitySection.textContent).not.toContain('PASSWORD_ONLY');
    expect(securitySection.textContent).not.toContain('Lingua preferita');
    expect(securitySection.textContent).not.toContain('Fuso orario');
    expect(securitySection.textContent).not.toContain('Italiano');
    expect(securitySection.querySelector('.security-authentication')).not.toBeNull();
    expect(securitySection.querySelector('.security-grid')).not.toBeNull();
    expect(securitySection.querySelector('.security-status--success')).not.toBeNull();
    expect(securitySection.querySelector('.security-secondary-grid')).not.toBeNull();
    expect(securitySection.querySelector('.password-reset-section')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#user-detail-accesses')).toBeNull();
    expect(service.findAssignedRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(fixture.nativeElement.querySelector('#user-detail-roles')).toBeNull();
    expect(fixture.nativeElement.querySelector('#user-detail-audit')).toBeNull();
    expect(fixture.nativeElement.querySelector('.user-detail-meta')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-labelledby="user-detail-security"] form.user-detail-password-form'))
      .not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-password-field').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('input[type="password"]').length).toBe(2);
    expect(roleManagementSection.textContent).toContain('Ruoli assegnati nel tenant');
    expect(roleManagementSection.textContent).toContain('Ruoli disponibili');
    expect(roleManagementSection.textContent).toContain('Assegna ruolo');
    expect(roleManagementSection.textContent).toContain('Rimuovi');
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-select select')).toBeNull();
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')?.textContent).toContain('Tenant');
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')?.textContent).toContain('Tenant (TENANT)');
    expect(roleManagementSection.querySelector('.user-detail-role-select select')).not.toBeNull();
  }, 15000);

  it('navigates to edit from the detail action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { editUser: () => void };

    component.editUser();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-1', 'edit']);
  });

  it('does not duplicate the email in the header when displayName equals email', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        displayName: 'ada@example.com'
      }))
    }));
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('#user-detail-title') as HTMLElement;
    const headerSubtitle = fixture.nativeElement.querySelector('.user-detail-subtitle');

    expect(title.textContent?.trim()).toBe('ada@example.com');
    expect(headerSubtitle).toBeNull();
  });

  it('shows the tenant selector when multiple tenant options are available', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        tenantAccesses: [
          ...createUser().tenantAccesses,
          {
            id: 'access-2',
            tenantId: 'tenant-2',
            tenantCode: 'TENANT_2',
            tenantName: 'Tenant Two',
            accessRole: 'TENANT_ADMIN',
            active: true,
            createdAt: '2026-05-10T09:00:00Z',
            updatedAt: '2026-05-10T09:00:00Z'
          }
        ]
      }))
    }));
    fixture.detectChanges();

    const roleManagementSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-role-management"]') as HTMLElement;
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-select select')).not.toBeNull();
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')).toBeNull();
  });

  it('shows an error state when detail loading fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => throwError(() => new Error('detail failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio utente.');
    expect(fixture.nativeElement.textContent).toContain('Riprova');
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

  it('removes an assigned role and refreshes available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as {
      removeRole: (role: {
        id: string;
        tenantId: string;
        tenantCode: string;
        tenantName: string;
        code: string;
        name: string;
        systemRole: boolean;
        active: boolean;
      }) => void;
    };

    component.removeRole({
      id: 'role-1',
      tenantId: 'tenant-1',
      tenantCode: 'TENANT',
      tenantName: 'Tenant',
      code: 'TENANT_ADMIN',
      name: 'Tenant admin',
      systemRole: true,
      active: true
    });
    fixture.detectChanges();

    expect(service.removeRole).toHaveBeenCalledWith('user-1', 'role-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Ruolo rimosso correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('resets password, clears the form and updates passwordChangedAt', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;

    component.passwordForm.setValue({
      newPassword: 'TenantReset1!',
      confirmPassword: 'TenantReset1!'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).toHaveBeenCalledWith('user-1', {
      tenantId: 'tenant-1',
      newPassword: 'TenantReset1!'
    });
    expect(component.passwordForm.getRawValue()).toEqual({
      newPassword: '',
      confirmPassword: ''
    });
    expect(component.user().passwordChangedAt).toBe('2026-05-11T10:15:30Z');
    expect(successSpy).toHaveBeenCalledWith(
      'Password aggiornata correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('blocks password reset when confirmation does not match', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;
    fixture.detectChanges();

    component.passwordForm.setValue({
      newPassword: 'TenantReset1!',
      confirmPassword: 'Different1!'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('La conferma password non coincide.');
  });

  it('shows backend password policy error and restores loading state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      resetPassword: vi.fn(() => throwError(() => new HttpErrorResponse({
        status: 400,
        error: { message: 'Password does not satisfy the current password policy.' }
      })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;

    component.passwordForm.setValue({
      newPassword: 'weak',
      confirmPassword: 'weak'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).toHaveBeenCalled();
    expect(component.passwordSaving()).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      'Password does not satisfy the current password policy.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
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
  const user = createUser();

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
    resetPassword: vi.fn(() => of({
      userId: 'user-1',
      tenantId: 'tenant-1',
      passwordChangedAt: '2026-05-11T10:15:30Z',
      locked: false,
      failedLoginAttempts: 0
    })),
    removeRole: vi.fn(() => of(void 0)),
    ...overrides
  } as UserAdministrationService;
}

function createUser() {
  return {
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
}
