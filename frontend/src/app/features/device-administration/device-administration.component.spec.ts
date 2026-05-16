import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { DeviceAdministrationComponent } from './device-administration.component';
import { DeviceAdministrationService } from './device-administration.service';

interface DeviceAdministrationListHandle {
  handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
}

describe('DeviceAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads tenant devices using the authenticated tenant id and renders the shared list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findDevices).toHaveBeenCalledWith('tenant-1', expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Dispositivi');
    expect(fixture.nativeElement.textContent).toContain('Nuovo dispositivo');
    expect(fixture.nativeElement.textContent).toContain('Vista tenant');
    expect(fixture.nativeElement.textContent).toContain('Laptop Alpha');
    expect(fixture.nativeElement.textContent).toContain('DV001');
  });

  it('navigates to detail and edit from row actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as DeviceAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'view' },
      row: { id: 'device-1' }
    });
    component.handleRowAction({
      action: { id: 'edit' },
      row: { id: 'device-1' }
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices', 'device-1']);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices', 'device-1', 'edit']);
  });

  it('handles activate and delete actions from the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as DeviceAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'activate' },
      row: { id: 'device-2', name: 'Phone Beta', assetCode: 'DV002', active: false }
    });
    component.handleRowAction({
      action: { id: 'deletePhysical' },
      row: { id: 'device-1', name: 'Laptop Alpha', assetCode: 'DV001', active: true }
    });

    expect(service.activateDevice).toHaveBeenCalledWith('device-2');
    expect(service.deleteDevice).toHaveBeenCalledWith('device-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo cancellato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows the translated conflict delete message on 409', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteDevice: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as DeviceAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'deletePhysical' },
      row: { id: 'device-1', name: 'Laptop Alpha', assetCode: 'DV001', active: true }
    });

    expect(errorSpy).toHaveBeenCalledWith(
      'Il dispositivo non puo essere cancellato perche e gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('shows the error state when the page fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findDevices: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i dispositivi.');
  });
});

async function createFixture(
  service: DeviceAdministrationService,
  userType = 'TENANT_ADMIN',
  permissions: readonly string[] = [
    'TENANT.DEVICE.READ',
    'TENANT.DEVICE.CREATE',
    'TENANT.DEVICE.UPDATE',
    'TENANT.DEVICE.DELETE'
  ]
) {
  await TestBed.configureTestingModule({
    imports: [DeviceAdministrationComponent],
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType,
            permissions
          })
        }
      },
      {
        provide: DeviceAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(DeviceAdministrationComponent);
}

function createService(overrides: Partial<DeviceAdministrationService> = {}): DeviceAdministrationService {
  const activeDevice = {
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
    updatedAt: '2026-05-15T10:00:00Z'
  };

  return {
    findDevices: vi.fn(() => of({
      content: [activeDevice],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })),
    findFormOptions: vi.fn(),
    findDeviceById: vi.fn(),
    createDevice: vi.fn(),
    updateDevice: vi.fn(),
    activateDevice: vi.fn(() => of({ ...activeDevice, id: 'device-2', assetCode: 'DV002', active: true })),
    deactivateDevice: vi.fn(),
    deleteDevice: vi.fn(() => of(void 0)),
    ...overrides
  } as DeviceAdministrationService;
}
