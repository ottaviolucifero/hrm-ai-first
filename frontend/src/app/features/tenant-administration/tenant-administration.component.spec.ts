import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { TenantAdministrationComponent } from './tenant-administration.component';
import { TenantAdministrationCreateRequest } from './tenant-administration.models';
import { TenantAdministrationService } from './tenant-administration.service';

describe('TenantAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads the tenant table and opens the create form', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findTenants).toHaveBeenCalledWith(expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Tenant');
    expect(fixture.nativeElement.textContent).toContain('La gestione tenant e riservata');

    const newButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo tenant')) as HTMLButtonElement;
    newButton.click();
    fixture.detectChanges();

    expect(service.findFormOptions).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('form.tenant-admin-form')).toBeTruthy();
  }, 15000);

  it.each([
    ['it', 'Nome gruppo'],
    ['en', 'Group name'],
    ['fr', 'Nom du groupe']
  ])('renders the legalName label with %s translation', async (language, expectedLabel) => {
    window.localStorage.setItem('hrflow.language', language);

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(expectedLabel);
  });

  it('creates a tenant with the expected payload', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    const component = fixture.componentInstance as TenantAdministrationComponent & {
      form: {
        setValue: (value: TenantAdministrationCreateRequest & { active: boolean }) => void;
      };
      openCreateForm: () => void;
      submitModal: () => void;
    };

    component.openCreateForm();
    fixture.detectChanges();

    component.form.setValue({
      code: 'TENANT_A',
      name: 'Tenant A',
      legalName: 'Tenant A Legal',
      defaultCountryId: 'country-1',
      defaultCurrencyId: 'currency-1',
      active: true
    });
    component.submitModal();

    expect(service.createTenant).toHaveBeenCalledWith({
      code: 'TENANT_A',
      name: 'Tenant A',
      legalName: 'Tenant A Legal',
      defaultCountryId: 'country-1',
      defaultCurrencyId: 'currency-1',
      active: true
    });
  });

  it('opens the shared confirmation dialog before deleting a tenant', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector(
      'button.data-table-action[title="Cancella definitivamente"]'
    ) as HTMLButtonElement | null;

    expect(deleteButton).toBeTruthy();
    deleteButton?.click();
    fixture.detectChanges();

    expect(service.deleteTenant).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Conferma cancellazione definitiva tenant');

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Cancella definitivamente')) as HTMLButtonElement;

    confirmButton.click();
    fixture.detectChanges();

    expect(service.deleteTenant).toHaveBeenCalledWith('tenant-foundation');
  });

  it('keeps the create action visible but disabled without create permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['PLATFORM.TENANT.READ']);
    fixture.detectChanges();

    const newButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo tenant')) as HTMLButtonElement;

    expect(newButton).toBeTruthy();
    expect(newButton.disabled).toBe(true);
  });

  it('reports load errors through the shared table error state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findTenants: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i tenant.');
  });
});

async function createFixture(
  serviceOverrides: Partial<TenantAdministrationService>,
  permissions: readonly string[] = ['PLATFORM.TENANT.READ', 'PLATFORM.TENANT.CREATE', 'PLATFORM.TENANT.UPDATE', 'PLATFORM.TENANT.DELETE']
) {
  await TestBed.configureTestingModule({
    imports: [TenantAdministrationComponent],
    providers: [
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'platform@example.com',
            userType: 'PLATFORM_SUPER_ADMIN',
            permissions
          })
        }
      },
      {
        provide: TenantAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(TenantAdministrationComponent);
}

function createService(overrides: Partial<TenantAdministrationService> = {}): TenantAdministrationService {
  const tenant = {
    id: 'tenant-foundation',
    code: 'FOUNDATION_TENANT',
    name: 'Foundation Tenant',
    legalName: 'Foundation Tenant Legal',
    defaultCountry: { id: 'country-1', code: 'IT', name: 'Italia' },
    defaultCurrency: { id: 'currency-1', code: 'EUR', name: 'Euro' },
    active: true,
    createdAt: '2026-05-13T08:00:00Z',
    updatedAt: '2026-05-13T09:00:00Z'
  };

  return {
    findTenants: vi.fn(() => of({
      content: [tenant],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })),
    findFormOptions: vi.fn(() => of({
      countries: [{ id: 'country-1', code: 'IT', name: 'Italia' }],
      currencies: [{ id: 'currency-1', code: 'EUR', name: 'Euro' }]
    })),
    findTenantById: vi.fn(() => of(tenant)),
    createTenant: vi.fn(() => of(tenant)),
    updateTenant: vi.fn(() => of(tenant)),
    activateTenant: vi.fn(() => of({ ...tenant, active: true })),
    deactivateTenant: vi.fn(() => of({ ...tenant, active: false })),
    deleteTenant: vi.fn(() => of(void 0)),
    ...overrides
  } as TenantAdministrationService;
}
