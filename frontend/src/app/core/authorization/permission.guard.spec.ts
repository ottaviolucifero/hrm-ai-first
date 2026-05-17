import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  beforeEach(() => {
    window.localStorage.setItem('hrflow.language', 'it');
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('allows navigation when the required permission is available', async () => {
    await configureTestBed(['TENANT.USER.READ']);
    const notificationService = TestBed.inject(NotificationService);
    const warningSpy = vi.spyOn(notificationService, 'warning');

    const result = await runGuard({
      permissionModule: 'users',
      requiredAction: 'view'
    });

    expect(result).toBe(true);
    expect(warningSpy).not.toHaveBeenCalled();
  });

  it('redirects to home and shows a warning when view is missing', async () => {
    await configureTestBed(['TENANT.USER.CREATE']);
    const notificationService = TestBed.inject(NotificationService);
    const router = TestBed.inject(Router);
    const warningSpy = vi.spyOn(notificationService, 'warning');

    const result = await runGuard({
      permissionModule: 'users',
      requiredAction: 'view'
    });

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/');
    expect(warningSpy).toHaveBeenCalledWith(
      'Non hai il permesso per accedere a questa sezione.',
      expect.objectContaining({ titleKey: 'alert.title.warning' })
    );
  });

  it('allows navigation for device routes when device view permission is available', async () => {
    await configureTestBed(['TENANT.DEVICE.READ']);

    const result = await runGuard({
      permissionModule: 'devices',
      requiredAction: 'view'
    });

    expect(result).toBe(true);
  });

  it('allows navigation for holiday calendar routes when holiday calendar view permission is available', async () => {
    await configureTestBed(['TENANT.HOLIDAY_CALENDAR.READ']);

    const result = await runGuard({
      permissionModule: 'holiday-calendars',
      requiredAction: 'view'
    });

    expect(result).toBe(true);
  });
});

async function configureTestBed(permissions: readonly string[]) {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
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
      }
    ]
  }).compileComponents();
}

async function runGuard(data: Record<string, unknown>) {
  const result = TestBed.runInInjectionContext(
    () => permissionGuard({ data } as ActivatedRouteSnapshot, {} as never)
  );

  return firstValueFrom(result as Observable<boolean | UrlTree>);
}
