import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { UserAdministrationComponent } from './user-administration.component';
import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    expect(fixture.nativeElement.textContent).toContain('Collegamento dipendente');
    expect(fixture.nativeElement.textContent).toContain('Nessun dipendente associato');
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

  it('keeps the create action visible but disabled without create permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), 'TENANT_ADMIN', ['TENANT.USER.READ']);
    fixture.detectChanges();

    const createButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo utente')) as HTMLButtonElement;

    expect(createButton).toBeTruthy();
    expect(createButton.disabled).toBe(true);
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

  it('exposes deactivate and delete row actions with coherent permission gates', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), 'TENANT_ADMIN', ['TENANT.USER.READ']);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      rowActions: () => readonly { id: string; disabled?: boolean | ((row: Record<string, unknown>) => boolean) }[];
    };
    const deactivateAction = component.rowActions().find((action) => action.id === 'deactivate');
    const deletePhysicalAction = component.rowActions().find((action) => action.id === 'deletePhysical');

    expect(deactivateAction).toBeTruthy();
    expect(deletePhysicalAction).toBeTruthy();
    expect(typeof deactivateAction?.disabled).toBe('function');
    expect(typeof deletePhysicalAction?.disabled).toBe('function');
    expect((deactivateAction?.disabled as (row: Record<string, unknown>) => boolean)({ id: 'user-1' })).toBe(true);
    expect((deletePhysicalAction?.disabled as (row: Record<string, unknown>) => boolean)({ id: 'user-1' })).toBe(true);
  });

  it('confirms deactivation, calls API and refreshes the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[2].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Conferma disattivazione utente');

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Disattiva')) as HTMLButtonElement;

    confirmButton.click();

    expect(service.deactivateUser).toHaveBeenCalledWith('user-1');
    expect(service.findUsers).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Utente disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('does not call deactivate when confirmation is cancelled', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[2].click();
    fixture.detectChanges();

    const cancelButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Annulla')) as HTMLButtonElement;

    cancelButton.click();

    expect(service.deactivateUser).not.toHaveBeenCalled();
    expect(service.findUsers).toHaveBeenCalledTimes(1);
  });

  it('shows unauthorized delete message on 401', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deactivateUser: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 401 })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[2].click();
    fixture.detectChanges();

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Disattiva')) as HTMLButtonElement;

    confirmButton.click();

    expect(errorSpy).toHaveBeenCalledWith(
      'Sessione non valida. Effettua di nuovo l accesso.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('shows forbidden deactivate message on 403', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deactivateUser: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 403 })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[2].click();
    fixture.detectChanges();

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Disattiva')) as HTMLButtonElement;

    confirmButton.click();

    expect(errorSpy).toHaveBeenCalledWith(
      'Non sei autorizzato a disattivare questo utente.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('shows not-found deactivate message on 404', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deactivateUser: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 404 })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[2].click();
    fixture.detectChanges();

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Disattiva')) as HTMLButtonElement;

    confirmButton.click();

    expect(errorSpy).toHaveBeenCalledWith(
      'L utente selezionato non esiste piu.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('confirms physical delete, calls API and refreshes the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[3].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Conferma cancellazione definitiva utente');

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Cancella definitivamente')) as HTMLButtonElement;

    confirmButton.click();

    expect(service.deleteUser).toHaveBeenCalledWith('user-1');
    expect(service.findUsers).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Utente cancellato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows conflict delete message on 409', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteUser: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const actionButtons = rows[0].querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    actionButtons[3].click();
    fixture.detectChanges();

    const confirmButton = Array.from(
      fixture.nativeElement.querySelectorAll('.confirm-dialog button')
    ).find((button) => (button as HTMLButtonElement).textContent?.includes('Cancella definitivamente')) as HTMLButtonElement;

    confirmButton.click();

    expect(errorSpy).toHaveBeenCalledWith(
      'Utente non cancellabile perche gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
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

async function createFixture(
  serviceOverrides: Partial<UserAdministrationService>,
  userType = 'TENANT_ADMIN',
  permissions: readonly string[] = ['TENANT.USER.READ', 'TENANT.USER.CREATE', 'TENANT.USER.UPDATE', 'TENANT.USER.DELETE']
) {
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
            userType,
            permissions
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
      employeeId: 'employee-1',
      employeeDisplayName: 'Ada Lovelace',
      hasEmployeeLink: true,
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
    },
    {
      id: 'user-2',
      displayName: 'tenant.admin@example.com',
      firstName: null,
      lastName: null,
      employeeId: null,
      employeeDisplayName: null,
      hasEmployeeLink: false,
      email: 'tenant.admin@example.com',
      userType: { id: 'type-1', code: 'TENANT_ADMIN', name: 'Tenant admin' },
      tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
      companyProfile: null,
      active: true,
      locked: false,
      roles: [],
      tenantAccesses: [],
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
    deleteUser: vi.fn(() => of(void 0)),
    deactivateUser: vi.fn(() => of({ id: 'user-1', active: false })),
    findUserById: vi.fn(),
    ...overrides
  } as UserAdministrationService;
}
