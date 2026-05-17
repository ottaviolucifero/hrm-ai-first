import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { LeaveRequestAdministrationComponent } from './leave-request-administration.component';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

interface LeaveRequestAdministrationHandle {
  updateStatusFilter: (value: string) => void;
  updateTypeFilter: (value: string) => void;
  updatePeriodFrom: (value: string) => void;
  updatePeriodTo: (value: string) => void;
  resetFilters: () => void;
}

describe('LeaveRequestAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads leave requests and renders the read-only admin list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findLeaveRequests).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Richieste permessi');
    expect(fixture.nativeElement.textContent).toContain('Mario Rossi');
    expect(fixture.nativeElement.textContent).toContain('Ferie');
    expect(fixture.nativeElement.textContent).toContain('Non disponibile');
    expect(fixture.nativeElement.textContent).not.toContain('Azioni');
    expect(fixture.nativeElement.textContent).not.toContain('Foundation read-only');
  });

  it('filters leave requests by text status type and overlapping period', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const textInput = fixture.nativeElement.querySelector('.leave-request-search-input') as HTMLInputElement;
    textInput.value = 'mario';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Mario Rossi');
    expect(fixture.nativeElement.textContent).not.toContain('Anna Bianchi');

    const component = fixture.componentInstance as unknown as LeaveRequestAdministrationHandle;
    component.updateStatusFilter('APPROVED');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Mario Rossi');
    expect(fixture.nativeElement.textContent).not.toContain('Bozza');

    component.resetFilters();
    component.updateTypeFilter('type-2');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Permesso');
    expect(fixture.nativeElement.textContent).not.toContain('Ferie');

    component.resetFilters();
    component.updatePeriodFrom('2026-05-03');
    component.updatePeriodTo('2026-05-03');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Anna Bianchi');
    expect(fixture.nativeElement.textContent).not.toContain('Mario Rossi');
  });

  it('shows the no results state when filters exclude every row', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const textInput = fixture.nativeElement.querySelector('.leave-request-search-input') as HTMLInputElement;
    textInput.value = 'nessuno';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessuna richiesta permesso corrisponde ai filtri correnti.');
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

async function createFixture(service: LeaveRequestAdministrationService) {
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
            permissions: ['TENANT.LEAVE_REQUEST.READ']
          })
        }
      },
      {
        provide: LeaveRequestAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(LeaveRequestAdministrationComponent);
}

function createService(
  overrides: Partial<LeaveRequestAdministrationService> = {}
): LeaveRequestAdministrationService {
  return {
    findLeaveRequests: vi.fn(() => of([
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
        status: 'APPROVED',
        approver: { id: 'manager-1', code: 'USR001', name: 'Manager One' },
        urgent: false
      },
      {
        id: 'leave-2',
        tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        companyProfile: { id: 'company-1', code: 'CP001', name: 'Headquarters' },
        employee: { id: 'employee-2', code: 'EMP002', name: 'Anna Bianchi' },
        leaveRequestType: { id: 'type-2', code: 'PER', name: 'Permesso' },
        startDate: '2026-05-03',
        endDate: '2026-05-03',
        durationDays: 1,
        deductFromBalance: false,
        deductedDays: 0,
        reason: 'Visita medica',
        status: 'DRAFT',
        approver: null,
        urgent: true
      }
    ])),
    ...overrides
  } as LeaveRequestAdministrationService;
}
