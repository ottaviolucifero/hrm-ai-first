import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { UserAdministrationFormComponent } from './user-administration-form.component';
import { UserAdministrationService } from './user-administration.service';

interface UserAdministrationFormComponentTestHandle {
  readonly form: {
    controls: {
      email: { setValue: (value: string) => void };
      userTypeId: { setValue: (value: string) => void; disabled: boolean };
      tenantId: { setValue: (value: string) => void; disabled: boolean };
      companyProfileId: { setValue: (value: string) => void };
      initialPassword: { setValue: (value: string) => void };
      confirmPassword: { setValue: (value: string) => void };
    };
    getRawValue: () => Record<string, unknown>;
  };
  submit: () => void;
  selectTenant: (value: string | Event) => void;
}

describe('UserAdministrationFormComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders create form with initial password fields and shared form controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findFormOptions).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Nuovo utente');
    expect(fixture.nativeElement.textContent).toContain('Password iniziale');
    expect(fixture.nativeElement.querySelector('app-email-field')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-password-field').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('app-input').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelectorAll('app-checkbox').length).toBe(2);
    const readonlyCheckboxes = Array.from(fixture.nativeElement.querySelectorAll('app-checkbox input')) as HTMLInputElement[];
    expect(readonlyCheckboxes.every((checkbox) => checkbox.disabled)).toBe(true);
  });

  it('forces the authenticated tenant for tenant users', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    expect(component.form.controls.tenantId.disabled).toBe(true);
    expect(component.form.getRawValue()['tenantId']).toBe('tenant-1');
    const tenantLabelInput = fixture.nativeElement.querySelector('app-input[formcontrolname="tenantLabel"] input') as HTMLInputElement;
    expect(tenantLabelInput.value).toBe('Tenant (TENANT)');
    expect(fixture.nativeElement.textContent).not.toContain('Tenant predefinito');
    expect(fixture.nativeElement.querySelector('app-input[formcontrolname="primaryTenantLabel"]')).toBeNull();
  });

  it('shows tenant select for platform users and filters company profiles by tenant', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), { userType: 'PLATFORM_OPERATOR', tenantId: 'tenant-1' });
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    expect(component.form.controls.tenantId.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('app-lookup-select[formcontrolname="tenantId"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Azienda / societa');
    expect(fixture.nativeElement.textContent).not.toContain('Tenant predefinito');
    component.selectTenant('tenant-2');
    fixture.detectChanges();

    const filteredCompanyProfiles = (fixture.componentInstance as unknown as { filteredCompanyProfiles: () => readonly { tradeName: string }[] })
      .filteredCompanyProfiles();
    expect(filteredCompanyProfiles).toHaveLength(1);
    expect(filteredCompanyProfiles[0].tradeName).toBe('Company Two');
  });

  it('submits create payload and navigates to detail', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    component.form.controls.email.setValue('new@example.com');
    component.form.controls.userTypeId.setValue('type-tenant-admin');
    component.form.controls.companyProfileId.setValue('company-1');
    component.form.controls.initialPassword.setValue('TenantCreate1!');
    component.form.controls.confirmPassword.setValue('TenantCreate1!');
    component.submit();

    expect(service.createUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      userTypeId: 'type-tenant-admin',
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      initialPassword: 'TenantCreate1!'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-created']);
  });

  it('blocks create when password confirmation does not match', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    component.form.controls.email.setValue('new@example.com');
    component.form.controls.userTypeId.setValue('type-tenant-admin');
    component.form.controls.initialPassword.setValue('TenantCreate1!');
    component.form.controls.confirmPassword.setValue('Different1!');
    component.submit();
    fixture.detectChanges();

    expect(service.createUser).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('La conferma password non coincide.');
  });

  it('renders edit form without password fields and keeps restricted fields disabled', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), undefined, 'user-1');
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    expect(fixture.nativeElement.textContent).toContain('Modifica utente');
    const employeeInput = fixture.nativeElement.querySelector('app-input[formcontrolname="employeeLabel"] input') as HTMLInputElement;
    expect(employeeInput.value).toContain('EMP-001');
    expect(fixture.nativeElement.querySelectorAll('app-password-field').length).toBe(0);
    expect(component.form.controls.userTypeId.disabled).toBe(true);
    expect(component.form.controls.tenantId.disabled).toBe(true);
  });

  it('submits update payload with only email and companyProfileId', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, undefined, 'user-1');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    component.form.controls.email.setValue('updated@example.com');
    component.form.controls.companyProfileId.setValue('');
    component.submit();

    expect(service.updateUser).toHaveBeenCalledWith('user-1', {
      email: 'updated@example.com',
      companyProfileId: null
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-1']);
  });

  it('shows backend errors through notifications', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      createUser: vi.fn(() => throwError(() => new HttpErrorResponse({
        status: 409,
        error: { message: 'User email already exists: new@example.com' }
      })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as unknown as UserAdministrationFormComponentTestHandle;

    component.form.controls.email.setValue('new@example.com');
    component.form.controls.userTypeId.setValue('type-tenant-admin');
    component.form.controls.initialPassword.setValue('TenantCreate1!');
    component.form.controls.confirmPassword.setValue('TenantCreate1!');
    component.submit();

    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile creare l utente.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });
});

async function createFixture(
  serviceOverrides: Partial<UserAdministrationService>,
  authenticatedUser: {
    userType: string;
    tenantId: string;
    permissions?: readonly string[];
  } = {
    userType: 'TENANT_ADMIN',
    tenantId: 'tenant-1',
    permissions: ['TENANT.USER.READ', 'TENANT.USER.CREATE', 'TENANT.USER.UPDATE', 'TENANT.USER.DELETE']
  },
  userId: string | null = null
) {
  await TestBed.configureTestingModule({
    imports: [UserAdministrationFormComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? userId : null
            }
          }
        }
      },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'current-user',
            tenantId: authenticatedUser.tenantId,
            email: 'current@example.com',
            userType: authenticatedUser.userType,
            permissions: authenticatedUser.permissions
          })
        }
      },
      {
        provide: UserAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(UserAdministrationFormComponent);
}

function createService(overrides: Partial<UserAdministrationService> = {}): UserAdministrationService {
  const user = createUser();

  return {
    findUsers: vi.fn(),
    findFormOptions: vi.fn(() => of({
      tenants: [
        { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        { id: 'tenant-2', code: 'TENANT_2', name: 'Tenant Two' }
      ],
      userTypes: [
        { id: 'type-employee', code: 'EMPLOYEE', name: 'Employee' },
        { id: 'type-tenant-admin', code: 'TENANT_ADMIN', name: 'Tenant admin' }
      ],
      authenticationMethod: { id: 'auth-1', code: 'PASSWORD_ONLY', name: 'Password only' },
      companyProfiles: [
        { id: 'company-1', tenantId: 'tenant-1', code: 'COMPANY_1', legalName: 'Company One Legal', tradeName: 'Company One' },
        { id: 'company-2', tenantId: 'tenant-2', code: 'COMPANY_2', legalName: 'Company Two Legal', tradeName: 'Company Two' }
      ]
    })),
    createUser: vi.fn(() => of({ ...user, id: 'user-created' })),
    updateUser: vi.fn(() => of(user)),
    findUserById: vi.fn(() => of(user)),
    findAssignedRoles: vi.fn(),
    findAvailableRoles: vi.fn(),
    assignRole: vi.fn(),
    resetPassword: vi.fn(),
    removeRole: vi.fn(),
    ...overrides
  } as UserAdministrationService;
}

function createUser() {
  return {
    id: 'user-1',
    displayName: 'Ada Lovelace',
    firstName: 'Ada',
    lastName: 'Lovelace',
    employeeId: 'employee-1',
    employeeDisplayName: 'Ada Lovelace',
    hasEmployeeLink: true,
    email: 'ada@example.com',
    userType: { id: 'type-tenant-admin', code: 'TENANT_ADMIN', name: 'Tenant admin' },
    tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    primaryTenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfile: { id: 'company-1', code: 'COMPANY_1', legalName: 'Company One Legal', tradeName: 'Company One' },
    employee: { id: 'employee-1', employeeCode: 'EMP-001', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    authenticationMethod: { id: 'auth-1', code: 'PASSWORD_ONLY', name: 'Password only' },
    preferredLanguage: null,
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
    roles: [],
    tenantAccesses: [],
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z'
  };
}
