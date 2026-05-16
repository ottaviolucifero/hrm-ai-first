import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { DeviceAdministrationDetailComponent } from './device-administration-detail.component';
import { DeviceLabelPrintService } from './device-label-print.service';
import { DeviceAdministrationService } from './device-administration.service';

interface DeviceAdministrationDetailHandle {
  goBack: () => void;
  editDevice: () => void;
  handleDetailAction: (actionId: string) => void;
  submitAssignmentAction: () => void;
  assignmentForm: {
    controls: {
      employeeId: { setValue: (value: string) => void };
      assignedFrom: { setValue: (value: string) => void };
      conditionOnAssign: { setValue: (value: string) => void };
      notes: { setValue: (value: string) => void };
    };
  };
  returnForm: {
    controls: {
      returnedAt: { setValue: (value: string) => void };
      conditionOnReturn: { setValue: (value: string) => void };
      returnNote: { setValue: (value: string) => void };
      notes: { setValue: (value: string) => void };
    };
  };
}

const DEFAULT_PERMISSIONS = ['TENANT.DEVICE.READ', 'TENANT.DEVICE.UPDATE', 'TENANT.DEVICE.DELETE'] as const;

describe('DeviceAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders detail cards, assignment history, and assignment actions for an assigned device', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    await stabilizeFixture(fixture);

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Laptop Alpha');
    expect(textContent).toContain('Identità bene');
    expect(textContent).toContain('Assegnazione corrente');
    expect(textContent).toContain('Etichetta dispositivo');
    expect(textContent).toContain('Stampa etichetta');
    expect(textContent).toContain('Storico assegnazioni');
    expect(textContent).toContain('Mario Rossi (EMP001)');
    expect(textContent).toContain('Assegnazione');
    expect(textContent).toContain('Restituzione');
    expect(textContent).toContain('Note');
    expect(textContent).toContain('Periodo restituzione');
    expect(textContent).toContain('Stato alla consegna');
    expect(textContent).toContain('Stato alla restituzione');
    expect(textContent).toContain('Nota restituzione');
    expect(textContent).toContain('Riassegna');
    expect(textContent).toContain('Restituisci');
    expect(textContent).not.toContain('Assegna dispositivo');
    expect(fixture.nativeElement.querySelectorAll('[data-testid="device-assignment-history-item"]').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.device-detail-history-column').length).toBe(6);
    expect(fixture.nativeElement.querySelector('.device-detail-history-subtitle')).toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('[data-testid="device-detail-card-assignment"]')
        ?.classList.contains('device-detail-card-assignment')
    ).toBe(true);
  });

  it('renders the QR label preview, falls back to asset code, and shows expired warranty', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const printService = createPrintService({
      createQrDataUrl: vi.fn(async () => 'data:image/png;base64,preview-dv001')
    });
    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        barcodeValue: '',
        warrantyEndDate: '2024-05-10'
      }))
    }), DEFAULT_PERMISSIONS, printService);
    await stabilizeFixture(fixture);

    expect(fixture.nativeElement.textContent).toContain('Garanzia scaduta');
    expect(printService.createQrDataUrl).toHaveBeenCalledWith('DV001');
    expect(fixture.nativeElement.querySelector('[data-testid="device-label-preview-image"]')?.getAttribute('src'))
      .toContain('data:image/png;base64,preview-dv001');
    const labelCardText = fixture.nativeElement.querySelector('[data-testid="device-detail-card-label"]')?.textContent ?? '';
    expect(labelCardText).toContain('DV001');
    expect(labelCardText).not.toContain('Laptop Alpha');
    expect(labelCardText).not.toContain('Dell');
    expect(labelCardText).not.toContain('SN-001');
  });

  it('renders assign action and empty states when the device has no current assignment or history', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        assignedTo: null,
        assignedAt: null
      })),
      findDeviceAssignments: vi.fn(() => of([]))
    }));
    await stabilizeFixture(fixture);

    const textContent = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelector('[data-testid="device-assignment-empty"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="device-assignment-history-empty"]')).not.toBeNull();
    expect(textContent).toContain('Assegna');
    expect(textContent).not.toContain('Riassegna');
    expect(textContent).not.toContain('Restituisci');
  });

  it('hides assignment mutations when update permission is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['TENANT.DEVICE.READ']);
    await stabilizeFixture(fixture);

    const buttonLabels = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    ).map((button) => (button.textContent ?? '').trim());
    expect(buttonLabels).not.toContain('Assegna');
    expect(buttonLabels).not.toContain('Riassegna');
    expect(buttonLabels).not.toContain('Restituisci');
  });

  it('submits assign action and reloads detail context', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const findDeviceById = vi.fn()
      .mockReturnValueOnce(of({
        ...createDetail(),
        assignedTo: null,
        assignedAt: null
      }))
      .mockReturnValueOnce(of(createDetail()));
    const findDeviceAssignments = vi.fn()
      .mockReturnValueOnce(of([]))
      .mockReturnValueOnce(of(createAssignments()));
    const service = createService({
      findDeviceById,
      findDeviceAssignments,
      assignDevice: vi.fn(() => of(createAssignmentResponse('assignment-3')))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as DeviceAdministrationDetailHandle;
    component.handleDetailAction('assign');
    component.assignmentForm.controls.employeeId.setValue('employee-2');
    component.assignmentForm.controls.assignedFrom.setValue('2026-05-18T09:00');
    component.assignmentForm.controls.conditionOnAssign.setValue('Excellent');
    component.assignmentForm.controls.notes.setValue('Fresh handover');

    component.submitAssignmentAction();

    expect(service.assignDevice).toHaveBeenCalledWith('device-1', {
      employeeId: 'employee-2',
      assignedFrom: toExpectedOffsetDateTime('2026-05-18T09:00'),
      conditionOnAssign: 'Excellent',
      notes: 'Fresh handover'
    });
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo assegnato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(findDeviceById).toHaveBeenCalledTimes(2);
    expect(findDeviceAssignments).toHaveBeenCalledTimes(2);
  });

  it('submits return action and reloads detail context', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const findDeviceById = vi.fn()
      .mockReturnValueOnce(of(createDetail()))
      .mockReturnValueOnce(of({
        ...createDetail(),
        assignedTo: null,
        assignedAt: null
      }));
    const findDeviceAssignments = vi.fn()
      .mockReturnValueOnce(of(createAssignments()))
      .mockReturnValueOnce(of(createAssignmentsAfterReturn()));
    const service = createService({
      findDeviceById,
      findDeviceAssignments,
      returnDevice: vi.fn(() => of(createAssignmentResponse('assignment-1')))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as DeviceAdministrationDetailHandle;
    component.handleDetailAction('return');
    component.returnForm.controls.returnedAt.setValue('2026-05-20T17:30');
    component.returnForm.controls.conditionOnReturn.setValue('Good');
    component.returnForm.controls.returnNote.setValue('Returned intact');
    component.returnForm.controls.notes.setValue('Desk handover');

    component.submitAssignmentAction();

    expect(service.returnDevice).toHaveBeenCalledWith('device-1', {
      returnedAt: toExpectedOffsetDateTime('2026-05-20T17:30'),
      returnNote: 'Returned intact',
      conditionOnReturn: 'Good',
      notes: 'Desk handover'
    });
    expect(successSpy).toHaveBeenCalledWith(
      'Dispositivo restituito correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(findDeviceById).toHaveBeenCalledTimes(2);
    expect(findDeviceAssignments).toHaveBeenCalledTimes(2);
  });

  it('navigates back and edit', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    await stabilizeFixture(fixture);

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
    await stabilizeFixture(fixture);

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
  });

  it('opens the confirm dialog on Cancella definitivamente click and confirms delete', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await stabilizeFixture(fixture);

    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');
    fixture.detectChanges();
    clickButtonByText(fixture.nativeElement, 'Cancella definitivamente');

    expect(service.deleteDevice).toHaveBeenCalledWith('device-1');
  });

  it('shows the translated delete conflict message on 409 after confirm dialog confirmation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteDevice: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    await stabilizeFixture(fixture);

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
    await stabilizeFixture(fixture);

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio dispositivo.');
  });

  it('prints the current label using assetCode and barcodeValue from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const printService = createPrintService();
    const fixture = await createFixture(createService(), DEFAULT_PERMISSIONS, printService);
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as DeviceAdministrationDetailHandle;
    component.handleDetailAction('printLabel');
    await fixture.whenStable();

    expect(printService.printLabel).toHaveBeenCalledWith({
      assetCode: 'DV001',
      qrValue: 'QR-DV001'
    });
  });

  it('uses assetCode as QR fallback and warns when the popup is blocked', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const printService = createPrintService({
      createQrDataUrl: vi.fn(async () => 'data:image/png;base64,preview-dv001'),
      printLabel: vi.fn(async () => false)
    });
    const fixture = await createFixture(createService({
      findDeviceById: vi.fn(() => of({
        ...createDetail(),
        barcodeValue: ''
      }))
    }), DEFAULT_PERMISSIONS, printService);
    const notificationService = TestBed.inject(NotificationService);
    const warningSpy = vi.spyOn(notificationService, 'warning');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as unknown as DeviceAdministrationDetailHandle;
    component.handleDetailAction('printLabel');
    await fixture.whenStable();

    expect(printService.printLabel).toHaveBeenCalledWith({
      assetCode: 'DV001',
      qrValue: 'DV001'
    });
    expect(warningSpy).toHaveBeenCalledWith(
      'Il browser ha bloccato la finestra di stampa etichetta.',
      expect.objectContaining({ titleKey: 'alert.title.warning' })
    );
  });
});

async function createFixture(
  service: DeviceAdministrationService,
  permissions: readonly string[] = DEFAULT_PERMISSIONS,
  printService: Partial<DeviceLabelPrintService> = createPrintService()
) {
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
            permissions
          })
        }
      },
      {
        provide: DeviceAdministrationService,
        useValue: service
      },
      {
        provide: DeviceLabelPrintService,
        useValue: printService
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(DeviceAdministrationDetailComponent);
}

function createPrintService(overrides: Partial<DeviceLabelPrintService> = {}): DeviceLabelPrintService {
  return {
    createQrDataUrl: vi.fn(async () => 'data:image/png;base64,preview-default'),
    printLabel: vi.fn(async () => true),
    ...overrides
  } as DeviceLabelPrintService;
}

function createService(overrides: Partial<DeviceAdministrationService> = {}): DeviceAdministrationService {
  const activeDetail = createDetail();

  return {
    findDevices: vi.fn(),
    findFormOptions: vi.fn(() => of(createFormOptions())),
    createDevice: vi.fn(),
    updateDevice: vi.fn(),
    findDeviceById: vi.fn(() => of(activeDetail)),
    findDeviceAssignments: vi.fn(() => of(createAssignments())),
    assignDevice: vi.fn(() => of(createAssignmentResponse('assignment-3'))),
    returnDevice: vi.fn(() => of(createAssignmentResponse('assignment-1'))),
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
    barcodeValue: 'QR-DV001',
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

async function stabilizeFixture(fixture: Awaited<ReturnType<typeof createFixture>>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function createAssignments() {
  return [
    {
      id: 'assignment-1',
      deviceId: 'device-1',
      employeeId: 'employee-1',
      employee: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
      assignedByUserId: 'user-1',
      assignedByUserEmail: 'qa@example.com',
      assignedFrom: '2026-05-11T08:00:00Z',
      assignedTo: null,
      returnedAt: null,
      returnNote: null,
      conditionOnAssign: 'Excellent',
      conditionOnReturn: null,
      notes: 'Assigned with dock',
      createdAt: '2026-05-11T08:00:00Z',
      updatedAt: '2026-05-11T08:00:00Z'
    },
    {
      id: 'assignment-0',
      deviceId: 'device-1',
      employeeId: 'employee-2',
      employee: { id: 'employee-2', code: 'EMP002', name: 'Lucia Bianchi' },
      assignedByUserId: 'user-1',
      assignedByUserEmail: 'qa@example.com',
      assignedFrom: '2026-04-01T08:00:00Z',
      assignedTo: '2026-05-11T08:00:00Z',
      returnedAt: null,
      returnNote: null,
      conditionOnAssign: 'Good',
      conditionOnReturn: 'Good',
      notes: 'Previous handover',
      createdAt: '2026-04-01T08:00:00Z',
      updatedAt: '2026-05-11T08:00:00Z'
    }
  ];
}

function createAssignmentsAfterReturn() {
  return [
    {
      id: 'assignment-1',
      deviceId: 'device-1',
      employeeId: 'employee-1',
      employee: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
      assignedByUserId: 'user-1',
      assignedByUserEmail: 'qa@example.com',
      assignedFrom: '2026-05-11T08:00:00Z',
      assignedTo: '2026-05-20T17:30:00Z',
      returnedAt: '2026-05-20T17:30:00Z',
      returnNote: 'Returned intact',
      conditionOnAssign: 'Excellent',
      conditionOnReturn: 'Good',
      notes: 'Desk handover',
      createdAt: '2026-05-11T08:00:00Z',
      updatedAt: '2026-05-20T17:30:00Z'
    }
  ];
}

function createFormOptions() {
  return {
    tenants: [],
    companyProfiles: [],
    deviceTypes: [],
    deviceBrands: [],
    deviceStatuses: [],
    employees: [
      { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi', companyProfileId: 'company-1' },
      { id: 'employee-2', code: 'EMP002', name: 'Lucia Bianchi', companyProfileId: 'company-1' },
      { id: 'employee-9', code: 'EMP009', name: 'Other Company', companyProfileId: 'company-9' }
    ]
  };
}

function createAssignmentResponse(id: string) {
  return {
    id,
    deviceId: 'device-1',
    employeeId: 'employee-2',
    employee: { id: 'employee-2', code: 'EMP002', name: 'Lucia Bianchi' },
    assignedByUserId: 'user-1',
    assignedByUserEmail: 'qa@example.com',
    assignedFrom: '2026-05-18T09:00:00Z',
    assignedTo: null,
    returnedAt: null,
    returnNote: null,
    conditionOnAssign: 'Excellent',
    conditionOnReturn: null,
    notes: 'Fresh handover',
    createdAt: '2026-05-18T09:00:00Z',
    updatedAt: '2026-05-18T09:00:00Z'
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

function toExpectedOffsetDateTime(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  expect(match).not.toBeNull();

  const [, year, month, day, hours, minutes, seconds = '00'] = match as RegExpMatchArray;
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
    0
  );

  const timezoneOffsetMinutes = -localDate.getTimezoneOffset();
  const offsetSign = timezoneOffsetMinutes >= 0 ? '+' : '-';
  const absoluteOffsetMinutes = Math.abs(timezoneOffsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffsetMinutes / 60)).padStart(2, '0');
  const offsetMinutes = String(absoluteOffsetMinutes % 60).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}
