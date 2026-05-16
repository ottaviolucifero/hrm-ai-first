import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { DeviceAdministrationDetailComponent } from './device-administration-detail.component';
import { DeviceAdministrationService } from './device-administration.service';

interface DeviceAdministrationDetailHandle {
  goBack: () => void;
  editDevice: () => void;
}

describe('DeviceAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders detail cards, warranty badge, barcode preview, and no assignment actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Laptop Alpha');
    expect(textContent).toContain('Identita bene');
    expect(textContent).toContain('Azienda e tenant');
    expect(textContent).toContain('Acquisto e garanzia');
    expect(textContent).toContain('Assegnazione corrente');
    expect(textContent).toContain('QR e barcode');
    expect(textContent).toContain('Audit e info tecniche');
    expect(textContent).toContain('Garanzia valida');
    expect(textContent).toContain('DV001');
    expect(textContent).toContain('Torna alla lista');
    expect(textContent).toContain('Modifica');
    expect(textContent).toContain('Disattiva');
    expect(textContent).toContain('Cancella definitivamente');
    expect(fixture.nativeElement.querySelector('app-detail-action-bar')).not.toBeNull();
    const buttonLabels = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    ).map((button) => (button.textContent ?? '').trim());
    expect(buttonLabels.some((label) => label.includes('Assegna'))).toBe(false);
    expect(buttonLabels.some((label) => label.includes('Restituisci'))).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-testid="device-barcode-preview"]')?.textContent).toContain('DV001');
  });

  it('keeps ownership and audit card headers aligned at the top with compact body spacing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const ownershipCard = fixture.nativeElement.querySelector('[data-testid="device-detail-card-ownership"]') as HTMLElement | null;
    const auditCard = fixture.nativeElement.querySelector('[data-testid="device-detail-card-audit"]') as HTMLElement | null;
    const ownershipBody = ownershipCard?.querySelector('.device-detail-card-body') as HTMLElement | null;
    const auditBody = auditCard?.querySelector('.device-detail-card-body') as HTMLElement | null;

    expect(ownershipCard).not.toBeNull();
    expect(auditCard).not.toBeNull();
    expect(getComputedStyle(ownershipCard!).alignContent).toBe('start');
    expect(getComputedStyle(auditCard!).alignContent).toBe('start');
    expect(getComputedStyle(ownershipCard!).alignItems).toBe('start');
    expect(getComputedStyle(auditCard!).alignItems).toBe('start');
    expect(getComputedStyle(ownershipBody!).alignContent).toBe('start');
    expect(getComputedStyle(auditBody!).alignContent).toBe('start');
    expect(getComputedStyle(ownershipBody!).paddingTop).toBe(getComputedStyle(auditBody!).paddingTop);
  });

  it('falls back to asset code in the barcode preview and shows expired warranty', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        barcodeValue: '',
        warrantyEndDate: '2024-05-10'
      }))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Garanzia scaduta');
    expect(fixture.nativeElement.querySelector('[data-testid="device-barcode-preview"]')?.textContent).toContain('DV001');
  });

  it('renders the improved assignment empty state without assignment actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        assignedTo: null,
        assignedAt: null
      }))
    }));
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelector('[data-testid="device-assignment-empty"]')).not.toBeNull();
    expect(textContent).toContain('Non assegnato');
    expect(textContent).toContain('Nessun dipendente e attualmente associato a questo dispositivo.');
    expect(textContent).not.toContain('Assegna ora');
    expect(textContent).not.toContain('Restituisci');
  });

  it('navigates back and edit', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as DeviceAdministrationDetailHandle;
    component.goBack();
    component.editDevice();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices']);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/devices', 'device-1', 'edit']);
  });

  it('opens the confirm dialog on Disattiva click and confirms deactivation without window.confirm', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const windowConfirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Disattiva');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Conferma disattivazione dispositivo');
    expect(windowConfirmSpy).not.toHaveBeenCalled();

    clickButtonByText(fixture.nativeElement, 'Disattiva');

    expect(service.deactivateDevice).toHaveBeenCalledWith('device-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(windowConfirmSpy).not.toHaveBeenCalled();
  });

  it('opens the confirm dialog on Attiva click and confirms activation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        active: false
      })),
      activateDevice: vi.fn(() => of({
        ...createDetail(),
        active: true
      }))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Attiva');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Conferma attivazione dispositivo');

    clickButtonByText(fixture.nativeElement, 'Attiva');

    expect(service.activateDevice).toHaveBeenCalledWith('device-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('opens the confirm dialog on Cancella definitivamente click and confirms delete', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Conferma cancellazione definitiva dispositivo');

    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');

    expect(service.deleteDevice).toHaveBeenCalledWith('device-1');
  });

  it('does not execute actions when the confirm dialog is cancelled', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Disattiva');
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Annulla');
    fixture.detectChanges();

    expect(service.deactivateDevice).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('shows the translated delete conflict message on 409 after confirm dialog confirmation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteDevice: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');
    fixture.detectChanges();
    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');

    expect(errorSpy).toHaveBeenCalledWith(
      'Il dispositivo non puo essere cancellato perche e gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('shows the error state when the detail fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio dispositivo.');
  });
});

async function createFixture(service: DeviceAdministrationService) {
  await TestBed.configureTestingModule({
    imports: [DeviceAdministrationDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'device-1' : null
            }
          }
        }
      },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType: 'TENANT_ADMIN',
            permissions: [
              'TENANT.DEVICE.READ',
              'TENANT.DEVICE.UPDATE',
              'TENANT.DEVICE.DELETE'
            ]
          })
        }
      },
      {
        provide: DeviceAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(DeviceAdministrationDetailComponent);
}

function createService(overrides: Partial<DeviceAdministrationService> = {}): DeviceAdministrationService {
  const activeDetail = createDetail();

  return {
    findDevices: vi.fn(),
    findFormOptions: vi.fn(),
    createDevice: vi.fn(),
    updateDevice: vi.fn(),
    findDeviceById: vi.fn(() => of(activeDetail)),
    activateDevice: vi.fn(() => of({ ...activeDetail, active: true })),
    deactivateDevice: vi.fn(() => of({ ...activeDetail, active: false })),
    deleteDevice: vi.fn(() => of(void 0)),
    ...overrides
  } as DeviceAdministrationService;
}

function createDetail() {
  return {
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
}

function clickButtonByText(root: HTMLElement, text: string): void {
  const matchingButtons = Array.from(root.querySelectorAll('button')).filter((candidate) =>
    (candidate.textContent ?? '').includes(text)
  );
  const button = matchingButtons.at(-1);
  expect(button).toBeDefined();
  button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
