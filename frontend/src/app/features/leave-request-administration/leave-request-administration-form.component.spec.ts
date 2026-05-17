import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LeaveRequestAdministrationFormComponent } from './leave-request-administration-form.component';
import { LeaveRequestAdministrationDetail } from './leave-request-administration.models';
import { LeaveRequestAdministrationService } from './leave-request-administration.service';

describe('LeaveRequestAdministrationFormComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads the create form and available employee options', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({ userType: 'PLATFORM_SUPER_ADMIN' });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      employeeOptions: () => readonly { id: string }[];
      titleKey: () => string;
      form: any;
    };

    expect(component.titleKey()).toBe('leaveRequestAdministration.form.createTitle');
    expect(component.employeeOptions().map((option) => option.id)).toEqual(['employee-2', 'employee-1']);
    expect(fixture.nativeElement.textContent).toContain('Nuova richiesta permesso');
    expect(fixture.nativeElement.textContent).toContain('Durata richiesta');
    expect(fixture.nativeElement.textContent).toContain('Funzionalita non ancora disponibile');
    expect(component.form.controls.deductFromBalance.disabled).toBe(true);
    expect(component.form.controls.deductedDays.disabled).toBe(true);
  });

  it('populates the edit form from the admin detail endpoint', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({ routeId: 'leave-1' });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: {
        getRawValue: () => Record<string, unknown>;
      };
    };

    expect(component.form.getRawValue()).toMatchObject({
      employeeId: 'employee-1',
      leaveRequestTypeId: 'type-1',
      startDate: '2026-05-10',
      endDate: '2026-05-12',
      durationDays: '3',
      deductFromBalance: false,
      deductedDays: '',
      status: 'SUBMITTED',
      comments: 'Created by manager',
      urgent: false
    });
  });

  it('loads a cancelled leave request in read-only detail mode', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const cancelledDetail: LeaveRequestAdministrationDetail = {
      id: 'leave-9',
      tenant: { id: 'tenant-1', code: 'TEN1', name: 'Tenant One' },
      companyProfile: { id: 'company-1', code: 'CP001', name: 'HQ' },
      employee: { id: 'employee-1', code: 'EMP001', name: 'Mario Rossi' },
      leaveRequestType: { id: 'type-1', code: 'FER', name: 'Ferie' },
      startDate: '2026-05-18',
      endDate: '2026-05-18',
      durationDays: 1,
      deductFromBalance: false,
      deductedDays: 0,
      reason: 'Cancelled by admin',
      status: 'CANCELLED',
      approver: null,
      comments: 'Cancelled request',
      urgent: false,
      urgentReason: null,
      createdAt: '2026-05-10T09:00:00Z',
      updatedAt: '2026-05-11T09:00:00Z'
    };

    const fixture = await createFixture({
      routeId: 'leave-9',
      routeMode: 'view',
      userPermissions: ['TENANT.LEAVE_REQUEST.READ'],
      service: createService({
        findLeaveRequestById: vi.fn(() => of(cancelledDetail))
      })
    });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      titleKey: () => string;
      isViewMode: () => boolean;
      form: any;
    };

    expect(component.titleKey()).toBe('leaveRequestAdministration.form.viewTitle');
    expect(component.isViewMode()).toBe(true);
    expect(component.form.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Annullato');
    expect(fixture.nativeElement.textContent).toContain('Questa richiesta e consultabile in sola lettura.');
    expect(fixture.nativeElement.querySelector('[data-status-tone="warning"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });

  it('validates required fields, date range, and urgent reason', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: any;
      submit: () => void;
      validationMessage: (controlName: string) => string;
    };

    component.form.controls.employeeId.setValue('');
    component.form.controls.leaveRequestTypeId.setValue('');
    component.form.controls.startDate.setValue('2026-05-12');
    component.form.controls.endDate.setValue('2026-05-10');
    component.form.controls.urgent.setValue(true);
    component.form.controls.urgentReason.setValue('');
    component.form.updateValueAndValidity();

    component.submit();
    fixture.detectChanges();

    expect(component.validationMessage('employeeId')).toBe('Campo obbligatorio.');
    expect(component.validationMessage('leaveRequestTypeId')).toBe('Campo obbligatorio.');
    expect(component.validationMessage('endDate')).toBe('La data fine deve essere uguale o successiva alla data inizio.');
    expect(component.validationMessage('urgentReason')).toBe('Il motivo urgenza e obbligatorio quando la richiesta e urgente.');
  });

  it('submits create payload with tenantId from the selected employee', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const router = { navigate: vi.fn(() => Promise.resolve(true)) };
    const notifications = { success: vi.fn(), error: vi.fn() };
    const fixture = await createFixture({
      userType: 'PLATFORM_SUPER_ADMIN',
      service,
      router,
      notifications
    });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: any;
      selectEmployee: (value: string) => void;
      submit: () => void;
    };

    component.selectEmployee('employee-2');
    component.form.controls.leaveRequestTypeId.setValue('type-2');
    component.form.controls.startDate.setValue('2026-05-20');
    component.form.controls.endDate.setValue('2026-05-21');
    component.form.controls.durationDays.setValue('2');
    component.form.controls.reason.setValue('Training');
    component.form.controls.comments.setValue('Created in admin');
    component.form.controls.urgent.setValue(true);
    component.form.controls.urgentReason.setValue('Urgent replacement');

    component.submit();

    expect(service.createLeaveRequest).toHaveBeenCalledWith({
      tenantId: 'tenant-2',
      employeeId: 'employee-2',
      leaveRequestTypeId: 'type-2',
      startDate: '2026-05-20',
      endDate: '2026-05-21',
      durationDays: 2,
      deductFromBalance: false,
      deductedDays: null,
      reason: 'Training',
      status: 'DRAFT',
      comments: 'Created in admin',
      urgent: true,
      urgentReason: 'Urgent replacement'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/admin/leave-requests']);
    expect(notifications.success).toHaveBeenCalled();
  });

  it('submits update payload without tenantId', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture({ routeId: 'leave-1', service });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: any;
      submit: () => void;
    };

    component.form.controls.status.setValue('DRAFT');
    component.form.controls.comments.setValue('Updated in admin');
    component.submit();

    expect(service.updateLeaveRequest).toHaveBeenCalledWith('leave-1', expect.objectContaining({
      employeeId: 'employee-1',
      leaveRequestTypeId: 'type-1',
      deductFromBalance: false,
      deductedDays: null,
      status: 'DRAFT',
      comments: 'Updated in admin'
    }));
    expect((service.updateLeaveRequest as any).mock.calls[0][1]).not.toHaveProperty('tenantId');
  });

  it('shows an error notification when submit fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      createLeaveRequest: vi.fn(() => throwError(() => new Error('create failed')))
    });
    const notifications = { success: vi.fn(), error: vi.fn() };
    const fixture = await createFixture({ service, notifications });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: any;
      selectEmployee: (value: string) => void;
      submit: () => void;
    };

    component.selectEmployee('employee-1');
    component.form.controls.leaveRequestTypeId.setValue('type-1');
    component.form.controls.startDate.setValue('2026-05-20');
    component.form.controls.endDate.setValue('2026-05-20');

    component.submit();

    expect(notifications.error).toHaveBeenCalled();
  });
});

async function createFixture(options: {
  routeId?: string | null;
  routeMode?: 'create' | 'edit' | 'view';
  userType?: string;
  userPermissions?: readonly string[];
  service?: LeaveRequestAdministrationService;
  router?: { navigate: ReturnType<typeof vi.fn> };
  notifications?: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
} = {}) {
  const service = options.service ?? createService();
  const router = options.router ?? { navigate: vi.fn(() => Promise.resolve(true)) };
  const notifications = options.notifications ?? { success: vi.fn(), error: vi.fn() };

  await TestBed.configureTestingModule({
    imports: [LeaveRequestAdministrationFormComponent],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap(options.routeId ? { id: options.routeId } : {}),
            data: options.routeMode ? { formMode: options.routeMode } : {},
            routeConfig: options.routeMode && options.routeMode !== 'create'
              ? { path: options.routeMode === 'edit' ? 'leave-requests/:id/edit' : 'leave-requests/:id' }
              : { path: options.routeMode === 'create' ? 'leave-requests/new' : '' }
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
            userType: options.userType ?? 'TENANT_ADMIN',
            permissions: options.userPermissions ?? ['TENANT.LEAVE_REQUEST.CREATE', 'TENANT.LEAVE_REQUEST.UPDATE']
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

  return TestBed.createComponent(LeaveRequestAdministrationFormComponent);
}

function createService(
  overrides: Partial<LeaveRequestAdministrationService> = {}
): LeaveRequestAdministrationService {
  return {
    findEmployeeOptions: vi.fn(() => of([
      {
        id: 'employee-1',
        code: 'EMP001',
        name: 'Mario Rossi',
        tenant: { id: 'tenant-1', code: 'TEN1', name: 'Tenant One' },
        companyProfile: { id: 'company-1', code: 'CP001', name: 'HQ' },
        active: true
      },
      {
        id: 'employee-2',
        code: 'EMP002',
        name: 'Anna Bianchi',
        tenant: { id: 'tenant-2', code: 'TEN2', name: 'Tenant Two' },
        companyProfile: { id: 'company-2', code: 'CP002', name: 'Branch' },
        active: true
      }
    ])),
    findLeaveRequestById: vi.fn(() => of({
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
      reason: 'Vacation',
      status: 'SUBMITTED',
      approver: null,
      comments: 'Created by manager',
      urgent: false,
      urgentReason: null,
      createdAt: '2026-05-01T09:00:00Z',
      updatedAt: '2026-05-02T09:00:00Z'
    })),
    createLeaveRequest: vi.fn(() => of({ id: 'leave-9' })),
    updateLeaveRequest: vi.fn(() => of({ id: 'leave-1' })),
    ...overrides
  } as LeaveRequestAdministrationService;
}
