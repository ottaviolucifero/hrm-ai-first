import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { UserAdministrationDetailComponent } from './user-administration-detail.component';
import { UserAdministrationService } from './user-administration.service';

interface UserAdministrationDetailComponentTestHandle {
  readonly passwordForm: {
    setValue: (value: { newPassword: string; confirmPassword: string }) => void;
    getRawValue: () => { newPassword: string; confirmPassword: string };
  };
  readonly user: () => { active: boolean; locked: boolean; passwordChangedAt: string | null };
  readonly passwordSaving: () => boolean;
  readonly lifecycleSaving: () => boolean;
}

describe('UserAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders user detail with inline password reset controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('#user-detail-title') as HTMLElement;
    const headerSubtitle = fixture.nativeElement.querySelector('.user-detail-subtitle') as HTMLElement;
    const headerDescription = fixture.nativeElement.querySelector('.user-detail-description') as HTMLElement;
    const detailActionBar = fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement;
    const identitySection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-identity"]') as HTMLElement;
    const tenantSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-tenant"]') as HTMLElement;
    const securitySection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-security"]') as HTMLElement;
    const roleManagementSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-role-management"]') as HTMLElement;

    expect(service.findUserById).toHaveBeenCalledWith('user-1');
    expect(title.textContent?.trim()).toBe('Ada Lovelace');
    expect(detailActionBar).toBeTruthy();
    expect(detailActionBar.textContent).toContain('Disattiva');
    expect(detailActionBar.textContent).toContain('Cancella definitivamente');
    expect(headerSubtitle.textContent?.trim()).toBe('ada@example.com');
    expect(headerDescription.textContent).toContain('sicurezza');
    expect(headerDescription.textContent).not.toContain('accessi tenant');
    expect(fixture.nativeElement.textContent).toContain('Identità');
    expect(fixture.nativeElement.textContent).toContain('Gestione ruoli utente');
    expect(fixture.nativeElement.textContent).toContain('Reset password');
    expect(fixture.nativeElement.textContent).toContain('Ciclo di vita account');
    expect(fixture.nativeElement.textContent).toContain('Disattiva utente');
    expect(fixture.nativeElement.textContent).toContain('Blocca utente');
    expect(fixture.nativeElement.textContent).toContain('Modifica');
    expect(fixture.nativeElement.textContent).toContain('Creato');
    expect(fixture.nativeElement.textContent).toContain('Aggiornato');
    expect(fixture.nativeElement.textContent).not.toContain('accessi tenant');
    expect(fixture.nativeElement.textContent).not.toContain('Tenant abilitati');
    expect(fixture.nativeElement.textContent).toContain('Ultimo cambio password');
    expect(fixture.nativeElement.textContent).not.toContain('Riprova');
    expect(identitySection.textContent).not.toContain('Nome visualizzato');
    expect(identitySection.textContent).toContain('Amministratore tenant');
    expect(identitySection.textContent).not.toContain('TENANT_ADMIN');
    expect(identitySection.textContent).toContain('Collegamento dipendente');
    expect(identitySection.textContent).not.toContain('Stato collegamento dipendente');
    expect(identitySection.textContent).toContain('Ada Lovelace');
    expect(identitySection.textContent).not.toContain('EMP-001');
    expect(tenantSection.textContent).toContain('Tenant di appartenenza');
    expect(tenantSection.textContent).not.toContain('Tenant predefinito');
    expect(tenantSection.textContent).toContain('Azienda');
    expect(securitySection.textContent).toContain('Password');
    expect(securitySection.textContent).toContain('Mai');
    expect(securitySection.textContent).not.toContain('PASSWORD_ONLY');
    expect(securitySection.textContent).not.toContain('Lingua preferita');
    expect(securitySection.textContent).not.toContain('Fuso orario');
    expect(securitySection.textContent).not.toContain('Italiano');
    expect(securitySection.querySelector('.security-authentication')).not.toBeNull();
    expect(securitySection.querySelector('.security-grid')).not.toBeNull();
    expect(securitySection.querySelector('.security-status--success')).not.toBeNull();
    expect(securitySection.querySelector('.security-secondary-grid')).not.toBeNull();
    expect(securitySection.querySelector('.password-reset-section')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#user-detail-accesses')).toBeNull();
    expect(service.findAssignedRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(fixture.nativeElement.querySelector('#user-detail-roles')).toBeNull();
    expect(fixture.nativeElement.querySelector('#user-detail-audit')).toBeNull();
    expect(fixture.nativeElement.querySelector('.user-detail-meta')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-labelledby="user-detail-security"] form.user-detail-password-form'))
      .not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('app-password-field').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('input[type="password"]').length).toBe(2);
    expect(roleManagementSection.textContent).toContain('Ruoli assegnati nel tenant');
    expect(roleManagementSection.textContent).toContain('Ruoli disponibili');
    expect(roleManagementSection.textContent).toContain('Assegna ruolo');
    expect(roleManagementSection.textContent).toContain('Rimuovi');
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-select select')).toBeNull();
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')?.textContent).toContain('Tenant');
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')?.textContent).toContain('Tenant (TENANT)');
    expect(roleManagementSection.querySelector('.user-detail-role-select')).not.toBeNull();
  }, 15000);

  it('navigates to edit from the detail action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { editUser: () => void };

    component.editUser();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users', 'user-1', 'edit']);
  });

  it('does not duplicate the email in the header when displayName equals email', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        displayName: 'ada@example.com'
      }))
    }));
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('#user-detail-title') as HTMLElement;
    const headerSubtitle = fixture.nativeElement.querySelector('.user-detail-subtitle');

    expect(title.textContent?.trim()).toBe('ada@example.com');
    expect(headerSubtitle).toBeNull();
  });

  it('shows an explicit unlinked employee state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        displayName: 'tenant.admin@example.com',
        firstName: null,
        lastName: null,
        employee: null,
        employeeId: null,
        employeeDisplayName: null,
        hasEmployeeLink: false,
        email: 'tenant.admin@example.com'
      }))
    }));
    fixture.detectChanges();

    const identitySection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-identity"]') as HTMLElement;
    expect(identitySection.textContent).toContain('Nessun dipendente associato');
    expect(identitySection.textContent).not.toContain('EMP-001');
  });

  it('disables the edit action without update permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['TENANT.USER.READ']);
    fixture.detectChanges();

    const editButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Modifica')) as HTMLButtonElement;

    expect(editButton).toBeTruthy();
    expect(editButton.disabled).toBe(true);
  });

  it('disables deletePhysical without delete permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), ['TENANT.USER.READ', 'TENANT.USER.UPDATE']);
    fixture.detectChanges();

    const deleteButton = findButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );

    expect(deleteButton.disabled).toBe(true);
  });

  it('shows the tenant selector when multiple tenant options are available', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        tenantAccesses: [
          ...createUser().tenantAccesses,
          {
            id: 'access-2',
            tenantId: 'tenant-2',
            tenantCode: 'TENANT_2',
            tenantName: 'Tenant Two',
            accessRole: 'TENANT_ADMIN',
            active: true,
            createdAt: '2026-05-10T09:00:00Z',
            updatedAt: '2026-05-10T09:00:00Z'
          }
        ]
      }))
    }));
    fixture.detectChanges();

    const roleManagementSection = fixture.nativeElement.querySelector('[aria-labelledby="user-detail-role-management"]') as HTMLElement;
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-select')).not.toBeNull();
    expect(roleManagementSection.querySelector('.user-detail-role-tenant-static')).toBeNull();
  });

  it('shows an error state when detail loading fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findUserById: vi.fn(() => throwError(() => new Error('detail failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio utente.');
    expect(fixture.nativeElement.textContent).toContain('Riprova');
  });

  it('shows empty role states when a valid tenant has no assigned or available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findAssignedRoles: vi.fn(() => of([])),
      findAvailableRoles: vi.fn(() => of([]))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findAssignedRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledWith('user-1', 'tenant-1');
    expect(fixture.nativeElement.textContent).toContain('Nessun ruolo assegnato per il tenant selezionato.');
    expect(fixture.nativeElement.textContent).toContain('Nessun ruolo disponibile da assegnare.');
    expect(fixture.nativeElement.textContent).not.toContain('Impossibile caricare i ruoli utente.');
  });

  it('assigns an available role and refreshes available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as {
      selectRoleForAssignment: (event: Event) => void;
      assignSelectedRole: () => void;
    };

    component.selectRoleForAssignment({ target: { value: 'role-2' } } as unknown as Event);
    component.assignSelectedRole();
    fixture.detectChanges();

    expect(service.assignRole).toHaveBeenCalledWith('user-1', {
      tenantId: 'tenant-1',
      roleId: 'role-2'
    });
    expect(service.findAvailableRoles).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Ruolo assegnato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('removes an assigned role and refreshes available roles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as {
      removeRole: (role: {
        id: string;
        tenantId: string;
        tenantCode: string;
        tenantName: string;
        code: string;
        name: string;
        systemRole: boolean;
        active: boolean;
      }) => void;
    };

    component.removeRole({
      id: 'role-1',
      tenantId: 'tenant-1',
      tenantCode: 'TENANT',
      tenantName: 'Tenant',
      code: 'TENANT_ADMIN',
      name: 'Tenant admin',
      systemRole: true,
      active: true
    });
    fixture.detectChanges();

    expect(service.removeRole).toHaveBeenCalledWith('user-1', 'role-1', 'tenant-1');
    expect(service.findAvailableRoles).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith(
      'Ruolo rimosso correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('resets password, clears the form and updates passwordChangedAt', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;

    component.passwordForm.setValue({
      newPassword: 'TenantReset1!',
      confirmPassword: 'TenantReset1!'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).toHaveBeenCalledWith('user-1', {
      tenantId: 'tenant-1',
      newPassword: 'TenantReset1!'
    });
    expect(component.passwordForm.getRawValue()).toEqual({
      newPassword: '',
      confirmPassword: ''
    });
    expect(component.user().passwordChangedAt).toBe('2026-05-11T10:15:30Z');
    expect(successSpy).toHaveBeenCalledWith(
      'Password aggiornata correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('opens confirm dialog and deactivates an active user from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Disattiva utente'
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Conferma disattivazione utente');
    expect(fixture.nativeElement.textContent).toContain('Vuoi disattivare questo utente?');

    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Disattiva');
    fixture.detectChanges();

    expect(service.deactivateUser).toHaveBeenCalledWith('user-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Utente disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('cancels deactivate without invoking the handler', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Disattiva utente'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Annulla');
    fixture.detectChanges();

    expect(service.deactivateUser).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('activates an inactive user without confirmation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        active: false
      })),
      activateUser: vi.fn(() => of({
        ...createUser(),
        active: true
      }))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Attiva utente'
    );
    fixture.detectChanges();

    expect(service.activateUser).toHaveBeenCalledWith('user-1');
    expect((fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle).user().active).toBe(true);
    expect(successSpy).toHaveBeenCalledWith(
      'Utente attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(fixture.nativeElement.textContent).not.toContain('Conferma disattivazione utente');
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('unlocks a locked user without confirmation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findUserById: vi.fn(() => of({
        ...createUser(),
        locked: true,
        failedLoginAttempts: 4
      })),
      unlockUser: vi.fn(() => of({
        ...createUser(),
        locked: false,
        failedLoginAttempts: 4
      }))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle & {
      triggerLockAction: () => void;
    };

    component.triggerLockAction();
    fixture.detectChanges();

    expect(service.unlockUser).toHaveBeenCalledWith('user-1');
    expect(component.user().locked).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Conferma blocco utente');
  });

  it('shows lifecycle API error and restores loading state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deactivateUser: vi.fn(() => throwError(() => new HttpErrorResponse({
        status: 400,
        error: { message: 'User lifecycle update failed.' }
      })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Disattiva utente'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Disattiva');
    fixture.detectChanges();

    expect(service.deactivateUser).toHaveBeenCalledWith('user-1');
    expect((fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle).lifecycleSaving()).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile disattivare l utente.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('opens confirm dialog and deletes the user from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, ['TENANT.USER.READ', 'TENANT.USER.UPDATE', 'TENANT.USER.DELETE']);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Cancella definitivamente');
    fixture.detectChanges();

    expect(service.deleteUser).toHaveBeenCalledWith('user-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Utente cancellato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users']);
  });

  it('cancels deletePhysical without invoking the handler', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, ['TENANT.USER.READ', 'TENANT.USER.UPDATE', 'TENANT.USER.DELETE']);
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Annulla');
    fixture.detectChanges();

    expect(service.deleteUser).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('shows the translated delete conflict message on 409 from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteUser: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service, ['TENANT.USER.READ', 'TENANT.USER.UPDATE', 'TENANT.USER.DELETE']);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Cancella definitivamente');
    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      'Utente non cancellabile perche gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('retries loading from the detail action bar after an error', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findUserById: vi.fn()
        .mockReturnValueOnce(throwError(() => new Error('detail failed')))
        .mockReturnValueOnce(of(createUser()))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio utente.');
    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Riprova'
    );
    fixture.detectChanges();

    expect(service.findUserById).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
  });

  it('blocks password reset when confirmation does not match', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;
    fixture.detectChanges();

    component.passwordForm.setValue({
      newPassword: 'TenantReset1!',
      confirmPassword: 'Different1!'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('La conferma password non coincide.');
  });

  it('shows backend password policy error and restores loading state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      resetPassword: vi.fn(() => throwError(() => new HttpErrorResponse({
        status: 400,
        error: { message: 'Password does not satisfy the current password policy.' }
      })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as unknown as UserAdministrationDetailComponentTestHandle;

    component.passwordForm.setValue({
      newPassword: 'weak',
      confirmPassword: 'weak'
    });
    fixture.nativeElement.querySelector('form.user-detail-password-form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(service.resetPassword).toHaveBeenCalled();
    expect(component.passwordSaving()).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile aggiornare la password utente.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });
});

async function createFixture(
  serviceOverrides: Partial<UserAdministrationService>,
  permissions: readonly string[] = ['TENANT.USER.READ', 'TENANT.USER.UPDATE']
) {
  await TestBed.configureTestingModule({
    imports: [UserAdministrationDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'current-user',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType: 'TENANT_ADMIN',
            permissions
          })
        }
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'user-1' : null
            }
          }
        }
      },
      {
        provide: UserAdministrationService,
        useValue: createService(serviceOverrides)
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(UserAdministrationDetailComponent);
}

function createService(overrides: Partial<UserAdministrationService> = {}): UserAdministrationService {
  const user = createUser();

  return {
    findUsers: vi.fn(),
    findUserById: vi.fn(() => of(user)),
    deleteUser: vi.fn(() => of(void 0)),
    activateUser: vi.fn(() => of({
      ...user,
      active: true
    })),
    deactivateUser: vi.fn(() => of({
      ...user,
      active: false
    })),
    findAssignedRoles: vi.fn(() => of(user.roles)),
    findAvailableRoles: vi.fn(() => of([
      {
        id: 'role-2',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        code: 'HR_MANAGER',
        name: 'HR manager',
        systemRole: false,
        active: true
      }
    ])),
    assignRole: vi.fn(() => of([
      ...user.roles,
      {
        id: 'role-2',
        tenantId: 'tenant-1',
        tenantCode: 'TENANT',
        tenantName: 'Tenant',
        code: 'HR_MANAGER',
        name: 'HR manager',
        systemRole: false,
        active: true
      }
    ])),
    resetPassword: vi.fn(() => of({
      userId: 'user-1',
      tenantId: 'tenant-1',
      passwordChangedAt: '2026-05-11T10:15:30Z',
      locked: false,
      failedLoginAttempts: 0
    })),
    lockUser: vi.fn(() => of({
      ...user,
      locked: true
    })),
    removeRole: vi.fn(() => of(void 0)),
    unlockUser: vi.fn(() => of({
      ...user,
      locked: false
    })),
    ...overrides
  } as UserAdministrationService;
}

function findButtonByExactText(container: HTMLElement, label: string): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll('button'))
    .find((candidate) => candidate.textContent?.trim() === label) as HTMLButtonElement | undefined;

  if (!button) {
    throw new Error(`Button not found: ${label}`);
  }

  return button;
}

function clickButtonByExactText(container: HTMLElement, label: string): void {
  findButtonByExactText(container, label).click();
}

function createUser() {
  return {
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
    primaryTenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfile: { id: 'company-1', code: 'COMPANY', legalName: 'Company Legal', tradeName: 'Company' },
    employee: { id: 'employee-1', employeeCode: 'EMP-001', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    authenticationMethod: { id: 'auth-1', code: 'PASSWORD_ONLY', name: 'Password only' },
    preferredLanguage: 'it',
    timeZone: null,
    active: true,
    locked: false,
    emailVerifiedAt: null,
    passwordChangedAt: null,
    lastLoginAt: null,
    failedLoginAttempts: 0,
    emailOtpEnabled: false,
    appOtpEnabled: false,
    strongAuthenticationRequired: false,
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
  };
}
