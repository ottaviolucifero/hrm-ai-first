import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LeaveRequestAdministrationDetailComponent } from './leave-request-administration-detail.component';
import { LeaveRequestAdministrationDetail } from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

describe('LeaveRequestAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('creates the detail component, shows loading, and loads the route id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const detail$ = new Subject<LeaveRequestAdministrationDetail>();
    const service = createService({
      findLeaveRequestById: vi.fn(() => detail$.asObservable())
    });
    const fixture = await createFixture({ service });

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(service.findLeaveRequestById).toHaveBeenCalledWith('leave-1');
    expect(fixture.nativeElement.textContent).toContain('Caricamento dettaglio richiesta...');

    detail$.next(createDetail());
    detail$.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('EMP001 - Mario Rossi');
  });

  it('shows the error state when the detail fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      service: createService({
        findLeaveRequestById: vi.fn(() => throwError(() => new Error('load failed')))
      })
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio della richiesta.');
  });

  it('shows Edit for mutable requests when update permission exists', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    expect(buttonLabels(fixture.nativeElement)).toContain('Modifica');
  });

  it('shows cancel request as a destructive action for DRAFT when delete permission exists', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const draftFixture = await createFixture();
    draftFixture.detectChanges();

    const component = draftFixture.componentInstance as unknown as {
      detailDestructiveActions: () => readonly { id: string; label: string }[];
    };

    expect(buttonLabels(draftFixture.nativeElement)).toContain('Annulla richiesta');
    expect(component.detailDestructiveActions()).toEqual([
      expect.objectContaining({
        id: 'cancelRequest',
        label: 'Annulla richiesta'
      })
    ]);
  });

  it('shows cancel request as a destructive action for SUBMITTED when delete permission exists', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const submittedFixture = await createFixture({
      service: createService({
        findLeaveRequestById: vi.fn(() => of(createDetail({ status: 'SUBMITTED' })))
      }),
      permissions: ['TENANT.LEAVE_REQUEST.READ', 'TENANT.LEAVE_REQUEST.UPDATE', 'TENANT.LEAVE_REQUEST.DELETE']
    });
    submittedFixture.detectChanges();

    expect(buttonLabels(submittedFixture.nativeElement)).toContain('Annulla richiesta');
  });

  it('shows cancelled requests in read-only mode without Edit or unsupported actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      service: createService({
        findLeaveRequestById: vi.fn(() => of(createDetail({ status: 'CANCELLED' })))
      })
    });

    fixture.detectChanges();

    const labels = buttonLabels(fixture.nativeElement);
    expect(fixture.nativeElement.textContent).toContain('Questa richiesta e annullata e resta consultabile in sola lettura.');
    expect(labels).not.toContain('Modifica');
    expect(labels).not.toContain('Annulla richiesta');
    expect(labels).not.toContain('Approva');
    expect(labels).not.toContain('Rifiuta');
  });

  it('does not show cancel request for approved leave requests', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const approvedFixture = await createFixture({
      service: createService({
        findLeaveRequestById: vi.fn(() => of(createDetail({ status: 'APPROVED' })))
      }),
      permissions: ['TENANT.LEAVE_REQUEST.READ', 'TENANT.LEAVE_REQUEST.UPDATE', 'TENANT.LEAVE_REQUEST.DELETE']
    });
    approvedFixture.detectChanges();
    expect(buttonLabels(approvedFixture.nativeElement)).not.toContain('Annulla richiesta');
  });

  it('does not show cancel request for rejected leave requests', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const rejectedFixture = await createFixture({
      service: createService({
        findLeaveRequestById: vi.fn(() => of(createDetail({ status: 'REJECTED' })))
      }),
      permissions: ['TENANT.LEAVE_REQUEST.READ', 'TENANT.LEAVE_REQUEST.UPDATE', 'TENANT.LEAVE_REQUEST.DELETE']
    });
    rejectedFixture.detectChanges();
    expect(buttonLabels(rejectedFixture.nativeElement)).not.toContain('Annulla richiesta');
  });

  it('navigates back to the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const router = { navigate: vi.fn(() => Promise.resolve(true)) };
    const fixture = await createFixture({ router });
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Torna alla lista');

    expect(router.navigate).toHaveBeenCalledWith(['/admin/leave-requests']);
  });

  it('opens the shared confirm dialog and cancels the request before navigating back to the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const router = { navigate: vi.fn(() => Promise.resolve(true)) };
    const notifications = { success: vi.fn(), error: vi.fn() };
    const service = createService({
      cancelLeaveRequest: vi.fn(() => of(void 0))
    });
    const fixture = await createFixture({ router, notifications, service });
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Annulla richiesta');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Vuoi annullare questa richiesta?');

    clickButtonByText(fixture.nativeElement, 'Annulla richiesta');

    expect(service.cancelLeaveRequest).toHaveBeenCalledWith('leave-1');
    expect(notifications.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/leave-requests']);
  });

  it('does not show Edit when update permission is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      permissions: ['TENANT.LEAVE_REQUEST.READ']
    });
    fixture.detectChanges();

    expect(buttonLabels(fixture.nativeElement)).not.toContain('Modifica');
  });

  it('does not show cancel request when delete permission is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      permissions: ['TENANT.LEAVE_REQUEST.READ', 'TENANT.LEAVE_REQUEST.UPDATE']
    });
    fixture.detectChanges();

    expect(buttonLabels(fixture.nativeElement)).not.toContain('Annulla richiesta');
  });

  it('shows type, created and updated timestamps in the summary card without duplicating status or rendering the id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    const summaryCard = fixture.nativeElement.querySelector('[data-testid="leave-request-detail-card-summary"]') as HTMLElement | null;
    expect(summaryCard?.textContent).toContain('Tipo richiesta');
    expect(summaryCard?.textContent).toContain('Creato');
    expect(summaryCard?.textContent).toContain('Aggiornato');
    expect(summaryCard?.textContent).not.toContain('ID');
    expect(summaryCard?.textContent).not.toContain('Stato');
    expect(fixture.nativeElement.textContent).not.toContain('Informazioni tecniche');
  });

  it('shows only employee and company profile in the employee card main layout', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    const employeeCard = fixture.nativeElement.querySelector('[data-testid="leave-request-detail-card-employee"]') as HTMLElement | null;
    expect(employeeCard?.textContent).toContain('Dipendente');
    expect(employeeCard?.textContent).toContain('Profilo aziendale');
    expect(employeeCard?.textContent).not.toContain('Tenant');
  });

  it('shows the compact period fields without rendering deducted days in the main period card', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    const periodCard = fixture.nativeElement.querySelector('[data-testid="leave-request-detail-card-period"]') as HTMLElement | null;
    expect(periodCard?.textContent).toContain('Data inizio');
    expect(periodCard?.textContent).toContain('Data fine');
    expect(periodCard?.textContent).toContain('Durata');
    expect(periodCard?.textContent).toContain('Urgente');
    expect(periodCard?.textContent).toContain('Scala dal saldo');
    expect(periodCard?.textContent).not.toContain('Giorni scalati');
  });

  it('keeps the notes card header aligned with the same header structure used by the other cards', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    const summaryHeader = fixture.nativeElement.querySelector('[data-testid="leave-request-detail-summary-header"]') as HTMLElement | null;
    const notesHeader = fixture.nativeElement.querySelector('[data-testid="leave-request-detail-notes-header"]') as HTMLElement | null;
    const notesTitle = notesHeader?.querySelector('.leave-request-detail-card-title') as HTMLElement | null;

    expect(summaryHeader?.className).toContain('leave-request-detail-card-header');
    expect(notesHeader?.className).toContain('leave-request-detail-card-header');
    expect(notesTitle?.className).toContain('leave-request-detail-card-title');
  });
});

async function createFixture(options: {
  service?: LeaveRequestAdministrationService;
  permissions?: readonly string[];
  router?: { navigate: ReturnType<typeof vi.fn> };
  notifications?: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
} = {}) {
  const service = options.service ?? createService();
  const router = options.router ?? { navigate: vi.fn(() => Promise.resolve(true)) };
  const notifications = options.notifications ?? { success: vi.fn(), error: vi.fn() };

  await TestBed.configureTestingModule({
    imports: [LeaveRequestAdministrationDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'leave-1' : null
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
            permissions: options.permissions ?? ['TENANT.LEAVE_REQUEST.READ', 'TENANT.LEAVE_REQUEST.UPDATE', 'TENANT.LEAVE_REQUEST.DELETE']
          })
        }
      },
      {
        provide: LeaveRequestAdministrationService,
        useValue: service
      },
      {
        provide: NotificationService,
        useValue: notifications
      },
      {
        provide: Router,
        useValue: router
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(LeaveRequestAdministrationDetailComponent);
}

function createService(
  overrides: Partial<LeaveRequestAdministrationService> = {}
): LeaveRequestAdministrationService {
  return {
    findLeaveRequestById: vi.fn(() => of(createDetail())),
    cancelLeaveRequest: vi.fn(() => of(void 0)),
    ...overrides
  } as LeaveRequestAdministrationService;
}

function createDetail(overrides: Partial<LeaveRequestAdministrationDetail> = {}): LeaveRequestAdministrationDetail {
  return {
    id: 'leave-1',
    tenant: { id: 'tenant-1', code: 'TEN1', name: 'Tenant One' },
    companyProfile: { id: 'company-1', code: 'CP001', name: 'HQ' },
    employee: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
    leaveRequestType: { id: 'type-1', code: 'FER', name: 'Ferie' },
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    durationDays: 3,
    deductFromBalance: true,
    deductedDays: 3,
    reason: 'Vacanza',
    status: 'DRAFT',
    approver: { id: 'employee-9', code: 'EMP009', name: 'Manager' },
    comments: 'Created by manager',
    urgent: false,
    urgentReason: null,
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-02T09:00:00Z',
    ...overrides
  };
}

function buttonLabels(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('button'))
    .map((button) => (button.textContent ?? '').trim())
    .filter((label) => label.length > 0);
}

function clickButtonByText(root: HTMLElement, text: string): void {
  const matchingButtons = Array.from(root.querySelectorAll('button'))
    .filter((candidate) => (candidate.textContent ?? '').includes(text));
  const button = matchingButtons.at(-1);

  expect(button).toBeDefined();
  button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
