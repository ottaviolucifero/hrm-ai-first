import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LeaveRequestAdministrationComponent } from './leave-request-administration.component';
import { LeaveRequestAdministrationListItem } from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

describe('LeaveRequestAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads leave requests and renders the admin list with the create action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findLeaveRequests).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Richieste permessi');
    expect(fixture.nativeElement.textContent).toContain('Mario Rossi');
    expect(fixture.nativeElement.textContent).toContain('Nuova richiesta');
  });

  it('delegates the request type lookup to the shared service using the current tenant context', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      leaveRequestTypeLookup: (query: { page: number; size: number; search?: string }) => unknown;
    };

    (component.leaveRequestTypeLookup({ page: 0, size: 25, search: 'fe' }) as any).subscribe();

    expect(service.findLeaveRequestTypeLookups).toHaveBeenCalledWith({ page: 0, size: 25, search: 'fe' }, 'tenant-1');
  });

  it('shows edit and cancel actions only for DRAFT and SUBMITTED rows', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      rowActions: () => readonly {
        id: string;
        visible?: boolean | ((row: unknown) => boolean);
      }[];
    };

    const [viewAction, editAction, cancelAction] = component.rowActions();
    const mutableRow = createRows()[0];
    const closedRow = createRows()[1];

    expect((viewAction.visible as (row: unknown) => boolean)(mutableRow)).toBe(true);
    expect((viewAction.visible as (row: unknown) => boolean)(closedRow)).toBe(true);
    expect((editAction.visible as (row: unknown) => boolean)(mutableRow)).toBe(true);
    expect((cancelAction.visible as (row: unknown) => boolean)(mutableRow)).toBe(true);
    expect((editAction.visible as (row: unknown) => boolean)(closedRow)).toBe(false);
    expect((cancelAction.visible as (row: unknown) => boolean)(closedRow)).toBe(false);
  });

  it('keeps cancelled leave requests viewable but without edit or cancel actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      rowActions: () => readonly {
        id: string;
        visible?: boolean | ((row: unknown) => boolean);
      }[];
    };

    const [viewAction, editAction, cancelAction] = component.rowActions();
    const cancelledRow: LeaveRequestAdministrationListItem = {
      ...createRows()[0],
      id: 'leave-3',
      status: 'CANCELLED'
    };

    expect((viewAction.visible as (row: unknown) => boolean)(cancelledRow)).toBe(true);
    expect((editAction.visible as (row: unknown) => boolean)(cancelledRow)).toBe(false);
    expect((cancelAction.visible as (row: unknown) => boolean)(cancelledRow)).toBe(false);
  });

  it('navigates to the detail route for cancelled leave requests', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const router = { navigate: vi.fn(() => Promise.resolve(true)) };
    const fixture = await createFixture(createService(), undefined, undefined, router);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      handleRowAction: (event: { action: { id: string }; row: unknown }) => void;
    };

    component.handleRowAction({
      action: { id: 'view' },
      row: createRows()[1]
    });

    expect(router.navigate).toHaveBeenCalledWith(['/admin/leave-requests', 'leave-2']);
  });

  it('renders leave request statuses as colored badges', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const statusRows: readonly LeaveRequestAdministrationListItem[] = [
      ...createRows(),
      {
        ...createRows()[0],
        id: 'leave-3',
        status: 'SUBMITTED',
        employee: { id: 'employee-3', code: 'EMP003', name: 'Luca Verdi' }
      },
      {
        ...createRows()[0],
        id: 'leave-4',
        status: 'REJECTED',
        employee: { id: 'employee-4', code: 'EMP004', name: 'Sara Neri' }
      },
      {
        ...createRows()[0],
        id: 'leave-5',
        status: 'CANCELLED',
        employee: { id: 'employee-5', code: 'EMP005', name: 'Elena Galli' }
      }
    ];

    const fixture = await createFixture(createService({
      findLeaveRequests: vi.fn(() => of(statusRows))
    }));
    fixture.detectChanges();

    const badges = Array.from(
      fixture.nativeElement.querySelectorAll('[data-status-tone]')
    ) as Element[];

    const badgeRows = badges.map((element) => ({
      label: element.textContent?.trim(),
      tone: element.getAttribute('data-status-tone')
    }));

    expect(badgeRows).toEqual(expect.arrayContaining([
      { label: 'Bozza', tone: 'neutral' },
      { label: 'Inviato', tone: 'info' },
      { label: 'Approvato', tone: 'success' },
      { label: 'Rifiutato', tone: 'danger' },
      { label: 'Annullato', tone: 'warning' }
    ]));
    expect(fixture.nativeElement.querySelectorAll('.data-table-status-dot').length).toBe(badges.length);
  });

  it('renders the cancel action with a trash icon and opens the confirm dialog', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const cancelButtonIcon = fixture.nativeElement.querySelector('button[title="Annulla richiesta"] i.ki-trash');
    expect(cancelButtonIcon).not.toBeNull();

    const cancelButton = fixture.nativeElement.querySelector('button[title="Annulla richiesta"]') as HTMLButtonElement | null;
    cancelButton?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Vuoi annullare questa richiesta?');
  });

  it('does not render the cancel action when delete permission is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), undefined, [
      'TENANT.LEAVE_REQUEST.READ',
      'TENANT.LEAVE_REQUEST.CREATE',
      'TENANT.LEAVE_REQUEST.UPDATE'
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[title="Annulla richiesta"]')).toBeNull();
  });

  it('cancels a mutable leave request and reloads the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const notifications = {
      success: vi.fn(),
      error: vi.fn()
    };
    const fixture = await createFixture(service, notifications);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      handleRowAction: (event: { action: { id: string }; row: unknown }) => void;
    };

    component.handleRowAction({
      action: { id: 'cancelRequest' },
      row: createRows()[0]
    });

    expect(service.cancelLeaveRequest).toHaveBeenCalledWith('leave-1');
    expect(service.findLeaveRequests).toHaveBeenCalledTimes(2);
    expect(notifications.success).toHaveBeenCalled();
  });

  it('shows the error state when the page fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findLeaveRequests: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare le richieste permesso.');
  });
});

async function createFixture(
  service: LeaveRequestAdministrationService,
  notifications: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> } = {
    success: vi.fn(),
    error: vi.fn()
  },
  permissions: readonly string[] = [
    'TENANT.LEAVE_REQUEST.READ',
    'TENANT.LEAVE_REQUEST.CREATE',
    'TENANT.LEAVE_REQUEST.UPDATE',
    'TENANT.LEAVE_REQUEST.DELETE'
  ],
  router: { navigate: ReturnType<typeof vi.fn> } = {
    navigate: vi.fn(() => Promise.resolve(true))
  }
) {
  await TestBed.configureTestingModule({
    imports: [LeaveRequestAdministrationComponent],
    providers: [
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

  return TestBed.createComponent(LeaveRequestAdministrationComponent);
}

function createService(
  overrides: Partial<LeaveRequestAdministrationService> = {}
): LeaveRequestAdministrationService {
  return {
    findLeaveRequests: vi.fn(() => of(createRows())),
    cancelLeaveRequest: vi.fn(() => of(void 0)),
    findLeaveRequestTypeLookups: vi.fn(() => of({
      content: [{ id: 'type-1', code: 'FER', name: 'Ferie' }],
      page: 0,
      size: 25,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })),
    ...overrides
  } as LeaveRequestAdministrationService;
}

function createRows() {
  return [
    {
      id: 'leave-1',
      tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
      companyProfile: { id: 'company-1', code: 'CP001', name: 'Headquarters' },
      employee: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
      leaveRequestType: { id: 'type-1', code: 'FER', name: 'Ferie' },
      startDate: '2026-05-10',
      endDate: '2026-05-12',
      durationDays: 3,
      deductFromBalance: true,
      deductedDays: 3,
      reason: 'Vacanza',
      status: 'DRAFT',
      approver: null,
      urgent: false
    },
    {
      id: 'leave-2',
      tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
      companyProfile: { id: 'company-1', code: 'CP001', name: 'Headquarters' },
      employee: { id: 'employee-2', code: 'EMP002', name: 'Anna Bianchi' },
      leaveRequestType: { id: 'type-2', code: 'PER', name: 'Permesso' },
      startDate: '2026-05-15',
      endDate: '2026-05-16',
      durationDays: 2,
      deductFromBalance: false,
      deductedDays: 0,
      reason: 'Visita',
      status: 'APPROVED',
      approver: { id: 'employee-9', code: 'EMP009', name: 'Manager' },
      urgent: true
    }
  ] as const;
}
