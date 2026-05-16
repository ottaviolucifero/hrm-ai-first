import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import { DeviceAdministrationFormComponent } from './device-administration-form.component';
import { DeviceAdministrationService } from './device-administration.service';

@Component({
  template: ''
})
class DummyRouteComponent {}

interface DeviceAdministrationFormHandle {
  readonly form: {
    controls: {
      tenantId: { disabled: boolean; setValue: (value: string) => void };
      tenantLabel: { value: string };
      companyProfileId: { setValue: (value: string) => void; value: string };
      name: { setValue: (value: string) => void };
      deviceTypeId: { setValue: (value: string) => void };
      deviceBrandId: { setValue: (value: string) => void };
      model: { setValue: (value: string) => void };
      serialNumber: { setValue: (value: string) => void };
      purchaseDate: { setValue: (value: string) => void; value: string };
      warrantyEndDate: { setValue: (value: string) => void; value: string };
      deviceStatusId: { setValue: (value: string) => void };
      assignedToEmployeeId: { setValue: (value: string) => void; value: string };
      assignedAt: { setValue: (value: string) => void; value: string };
    };
    hasError: (errorCode: string) => boolean;
  };
  readonly employeeLookupOptions: () => readonly LookupOption[];
  submit: () => void;
  selectTenant: (event: string | Event) => void;
  selectCompanyProfile: (event: string | Event) => void;
  selectAssignedEmployee: (event: string | Event) => void;
}

describe('DeviceAdministrationFormComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders create form with generated asset code and readonly active state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nuovo dispositivo');
    expect(fixture.nativeElement.textContent).toContain('Dati asset');
    expect(fixture.nativeElement.textContent).toContain('Generato automaticamente dal backend');
    const checkbox = fixture.nativeElement.querySelector('app-checkbox input') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('renders four responsive form cards with asset data as the first section', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll('.device-form-card-title')
    ) as Element[];
    const normalizedTitles = titles.map((element) => element.textContent?.trim() ?? '');

    expect(normalizedTitles).toEqual([
      'Dati asset',
      'Identita bene',
      'Azienda e tenant',
      'Acquisto e garanzia'
    ]);
  });

  it('uses the shared date-time field popup for lifecycle dates', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const dateTimeFields = fixture.nativeElement.querySelectorAll('app-date-time-field');
    expect(dateTimeFields.length).toBe(3);

    const purchaseInput = dateTimeFields[1].querySelector('input') as HTMLInputElement;
    expect(purchaseInput.type).toBe('text');

    purchaseInput.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.app-date-time-panel') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.textContent).toContain('Annulla');
    expect(panel.querySelector('.app-date-time-time')).toBeNull();
  });

  it('keeps date and datetime modes distinct in the device form and accepts manual input', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;
    component.form.controls.assignedToEmployeeId.setValue('employee-1');
    fixture.detectChanges();

    const dateTimeFields = fixture.nativeElement.querySelectorAll('app-date-time-field');
    const purchaseInput = dateTimeFields[1].querySelector('input') as HTMLInputElement;
    const assignedAtInput = dateTimeFields[0].querySelector('input') as HTMLInputElement;

    purchaseInput.value = '20062026';
    purchaseInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    assignedAtInput.value = '160520261145';
    assignedAtInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.form.controls.purchaseDate.value).toBe('2026-06-20');
    expect(component.form.controls.assignedAt.value).toBe('2026-05-16T11:45');

    purchaseInput.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('.app-date-time-panel') as HTMLElement).querySelector('.app-date-time-time')).toBeNull();

    assignedAtInput.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('.app-date-time-panel') as HTMLElement).querySelector('.app-date-time-time')).not.toBeNull();
  });

  it('forces the authenticated tenant for tenant users', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    expect(component.form.controls.tenantId.disabled).toBe(true);
    expect(component.form.controls.tenantLabel.value).toBe('Tenant (TENANT)');
  });

  it('shows tenant select for platform users', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), { userType: 'PLATFORM_OPERATOR', tenantId: 'tenant-1' });
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    expect(component.form.controls.tenantId.disabled).toBe(false);
  });

  it('filters employee options by company profile only', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    component.selectCompanyProfile({ target: { value: 'company-1' } } as unknown as Event);
    fixture.detectChanges();
    expect(component.employeeLookupOptions().map((option) => option.name)).toEqual(['Mario Rossi']);

    component.selectCompanyProfile({ target: { value: 'company-2' } } as unknown as Event);
    fixture.detectChanges();
    expect(component.employeeLookupOptions().map((option) => option.name)).toEqual(['Anna Verdi']);
  });

  it('validates assignedAt only when an employee is selected', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.form.controls.assignedToEmployeeId.setValue('');
    component.form.controls.assignedAt.setValue('2026-05-15T09:30');
    component.form.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.form.hasError('assignedAtRequiresEmployee')).toBe(true);
  });

  it('validates warranty end date against purchase date', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    component.form.controls.purchaseDate.setValue('2026-05-15');
    component.form.controls.warrantyEndDate.setValue('2026-05-14');
    fixture.detectChanges();

    expect(component.form.hasError('invalidWarrantyRange')).toBe(true);
  });

  it('submits create payload with assignment fields and navigates to detail', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    component.selectCompanyProfile({ target: { value: 'company-1' } } as unknown as Event);
    component.form.controls.name.setValue('Scanner');
    component.form.controls.deviceTypeId.setValue('type-1');
    component.form.controls.deviceBrandId.setValue('brand-1');
    component.form.controls.model.setValue('Model X');
    component.form.controls.serialNumber.setValue('SN-100');
    component.form.controls.purchaseDate.setValue('2026-05-15');
    component.form.controls.warrantyEndDate.setValue('2028-05-15');
    component.form.controls.deviceStatusId.setValue('status-1');
    component.selectAssignedEmployee({ target: { value: 'employee-1' } } as unknown as Event);
    component.form.controls.assignedAt.setValue('2026-05-15T09:30');
    component.submit();

    expect(service.createDevice).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      name: 'Scanner',
      deviceTypeId: 'type-1',
      deviceBrandId: 'brand-1',
      model: 'Model X',
      serialNumber: 'SN-100',
      purchaseDate: '2026-05-15',
      warrantyEndDate: '2028-05-15',
      deviceStatusId: 'status-1',
      assignedToEmployeeId: 'employee-1',
      assignedAt: new Date('2026-05-15T09:30').toISOString()
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices', 'device-created']);
  });

  it('renders edit form with readonly backend-generated codes and submits update without tenant', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, undefined, 'device-1');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    const assetCodeInput = fixture.nativeElement.querySelector('app-input[formcontrolname="assetCodeLabel"] input') as HTMLInputElement;
    const barcodeInput = fixture.nativeElement.querySelector('app-input[formcontrolname="barcodeValueLabel"] input') as HTMLInputElement;
    expect(assetCodeInput.value).toBe('DV001');
    expect(barcodeInput.value).toBe('DV001');

    component.form.controls.companyProfileId.setValue('company-2');
    component.form.controls.name.setValue('Laptop Updated');
    component.form.controls.deviceTypeId.setValue('type-2');
    component.form.controls.deviceBrandId.setValue('brand-2');
    component.form.controls.model.setValue('EliteBook');
    component.form.controls.serialNumber.setValue('SN-200');
    component.form.controls.purchaseDate.setValue('2026-05-20');
    component.form.controls.warrantyEndDate.setValue('2028-05-20');
    component.form.controls.deviceStatusId.setValue('status-2');
    component.form.controls.assignedToEmployeeId.setValue('');
    component.form.controls.assignedAt.setValue('');
    component.submit();

    expect(service.updateDevice).toHaveBeenCalledWith('device-1', {
      companyProfileId: 'company-2',
      name: 'Laptop Updated',
      deviceTypeId: 'type-2',
      deviceBrandId: 'brand-2',
      model: 'EliteBook',
      serialNumber: 'SN-200',
      purchaseDate: '2026-05-20',
      warrantyEndDate: '2028-05-20',
      deviceStatusId: 'status-2',
      assignedToEmployeeId: null,
      assignedAt: null
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices', 'device-1']);
  });

  it('renders asset data labels in italian, french, and english', async () => {
    const expectations = [
      {
        language: 'it',
        labels: ['Dati asset', 'Codice Asset', 'QR code', 'Nome', 'Attivo']
      },
      {
        language: 'fr',
        labels: ["Donnees de l'actif", 'Code asset', 'QR code', 'Nom', 'Actif']
      },
      {
        language: 'en',
        labels: ['Asset data', 'Asset code', 'QR code', 'Name', 'Active']
      }
    ] as const;

    for (const expectation of expectations) {
      window.localStorage.setItem('hrflow.language', expectation.language);
      const fixture = await createFixture(createService());
      fixture.detectChanges();

      const textContent = fixture.nativeElement.textContent as string;
      for (const label of expectation.labels) {
        expect(textContent).toContain(label);
      }

      TestBed.resetTestingModule();
    }
  });

  it('shows backend errors through notifications', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      createDevice: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as unknown as DeviceAdministrationFormHandle;

    component.selectCompanyProfile({ target: { value: 'company-1' } } as unknown as Event);
    component.form.controls.name.setValue('Scanner');
    component.form.controls.deviceTypeId.setValue('type-1');
    component.form.controls.deviceBrandId.setValue('brand-1');
    component.form.controls.serialNumber.setValue('SN-100');
    component.form.controls.deviceStatusId.setValue('status-1');
    component.submit();

    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile creare il dispositivo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });
});

async function createFixture(
  service: DeviceAdministrationService,
  authenticatedUser: {
    userType: string;
    tenantId: string;
    permissions?: readonly string[];
  } = {
    userType: 'TENANT_ADMIN',
    tenantId: 'tenant-1',
    permissions: ['TENANT.DEVICE.READ', 'TENANT.DEVICE.CREATE', 'TENANT.DEVICE.UPDATE']
  },
  deviceId: string | null = null
) {
  await TestBed.configureTestingModule({
    imports: [DeviceAdministrationFormComponent],
    providers: [
      provideRouter([
        {
          path: 'admin',
          children: [
            { path: 'devices', component: DummyRouteComponent },
            { path: 'devices/:id', component: DummyRouteComponent }
          ]
        }
      ]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? deviceId : null
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
        provide: DeviceAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(DeviceAdministrationFormComponent);
}

function createService(overrides: Partial<DeviceAdministrationService> = {}): DeviceAdministrationService {
  const detail = {
    id: 'device-1',
    tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfile: { id: 'company-1', code: 'CP001', name: 'Legal Entity' },
    name: 'Laptop Alpha',
    assetCode: 'DV001',
    barcodeValue: 'DV001',
    type: { id: 'type-1', code: 'LAP', name: 'Laptop' },
    brand: { id: 'brand-1', code: 'DEL', name: 'Dell' },
    model: 'Latitude',
    serialNumber: 'SN-001',
    purchaseDate: '2026-05-10',
    warrantyEndDate: '2028-05-10',
    deviceStatus: { id: 'status-1', code: 'READY', name: 'Ready' },
    assignedTo: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
    assignedAt: '2026-05-11T08:00:00Z',
    active: true,
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z'
  };

  return {
    findDevices: vi.fn(),
    findFormOptions: vi.fn(() => of({
      tenants: [
        { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        { id: 'tenant-2', code: 'TENANT_2', name: 'Tenant Two' }
      ],
      companyProfiles: [
        { id: 'company-1', code: 'CP001', name: 'Legal Entity' },
        { id: 'company-2', code: 'CP002', name: 'Branch Office' }
      ],
      deviceTypes: [
        { id: 'type-1', code: 'LAP', name: 'Laptop' },
        { id: 'type-2', code: 'PHN', name: 'Phone' }
      ],
      deviceBrands: [
        { id: 'brand-1', code: 'DEL', name: 'Dell' },
        { id: 'brand-2', code: 'HP', name: 'HP' }
      ],
      deviceStatuses: [
        { id: 'status-1', code: 'READY', name: 'Ready' },
        { id: 'status-2', code: 'IN_USE', name: 'In use' }
      ],
      employees: [
        { id: 'employee-1', companyProfileId: 'company-1', code: 'EMP001', name: 'Mario Rossi' },
        { id: 'employee-2', companyProfileId: 'company-2', code: 'EMP002', name: 'Anna Verdi' }
      ]
    })),
    findDeviceById: vi.fn(() => of(detail)),
    createDevice: vi.fn(() => of({ ...detail, id: 'device-created', name: 'Scanner' })),
    updateDevice: vi.fn(() => of(detail)),
    activateDevice: vi.fn(),
    deactivateDevice: vi.fn(),
    deleteDevice: vi.fn(),
    ...overrides
  } as DeviceAdministrationService;
}
