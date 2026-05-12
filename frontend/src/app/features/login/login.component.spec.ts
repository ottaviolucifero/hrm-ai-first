import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('shows login error immediately and resets loading after failed login', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const authService = {
      login: vi.fn(() => throwError(() => ({ status: 401 })))
    };

    const fixture = await createLoginFixture(authService);
    fixture.detectChanges();

    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');

    const component = fixture.componentInstance as unknown as {
      loginForm: {
        controls: {
          email: { setValue(value: string): void };
          password: { setValue(value: string): void };
        };
      };
    };
    component.loginForm.controls.email.setValue('user@example.com');
    component.loginForm.controls.password.setValue('wrong-password');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith('Email o password non corretti.', expect.objectContaining({ titleKey: 'alert.title.danger' }));
  });

  it('shows the inactive account message when the API returns AUTH_ACCOUNT_INACTIVE', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const authService = {
      login: vi.fn(() => throwError(() => ({ status: 401, error: { code: 'AUTH_ACCOUNT_INACTIVE' } })))
    };

    const fixture = await createLoginFixture(authService);
    fixture.detectChanges();

    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    submitLoginForm(fixture, 'user@example.com', 'Secret1!');

    expect(errorSpy).toHaveBeenCalledWith('Account disattivato', expect.objectContaining({ titleKey: 'alert.title.danger' }));
  });

  it('shows the locked account message when the API returns AUTH_ACCOUNT_LOCKED', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const authService = {
      login: vi.fn(() => throwError(() => ({ status: 401, error: { code: 'AUTH_ACCOUNT_LOCKED' } })))
    };

    const fixture = await createLoginFixture(authService);
    fixture.detectChanges();

    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    submitLoginForm(fixture, 'user@example.com', 'Secret1!');

    expect(errorSpy).toHaveBeenCalledWith('Account bloccato', expect.objectContaining({ titleKey: 'alert.title.danger' }));
  });

  it('keeps the shared password field configured for login semantics', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createLoginFixture();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#loginPassword') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.getAttribute('autocomplete')).toBe('current-password');
  });

  it('syncs the language selector with the current fr language', async () => {
    window.localStorage.setItem('hrflow.language', 'fr');

    const fixture = await createLoginFixture();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('fr');
    expect(select.selectedOptions[0]?.textContent?.trim()).toBe('Français');
  });

  it('updates language storage when the selector changes to en', async () => {
    window.localStorage.setItem('hrflow.language', 'fr');

    const fixture = await createLoginFixture();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'en';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(select.value).toBe('en');
    expect(window.localStorage.getItem('hrflow.language')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('localizes the legal footer aria labels', async () => {
    window.localStorage.setItem('hrflow.language', 'en');

    const fixture = await createLoginFixture();
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('footer.login-footer') as HTMLElement;
    const nav = fixture.nativeElement.querySelector('nav.login-footer-links') as HTMLElement;

    expect(footer.getAttribute('aria-label')).toBe('Login legal links navigation');
    expect(nav.getAttribute('aria-label')).toBe('Legal links');
  });
});

async function createLoginFixture(authService = { login: vi.fn() }) {
  await TestBed.configureTestingModule({
    imports: [LoginComponent],
    providers: [
      provideRouter([]),
      { provide: AuthService, useValue: authService }
    ]
  }).compileComponents();

  return TestBed.createComponent(LoginComponent);
}

function submitLoginForm(
  fixture: {
    detectChanges(): void;
    nativeElement: ParentNode;
    componentInstance: unknown;
  },
  email: string,
  password: string
): void {
  const component = fixture.componentInstance as {
    loginForm: {
      controls: {
        email: { setValue(value: string): void };
        password: { setValue(value: string): void };
      };
    };
  };
  component.loginForm.controls.email.setValue(email);
  component.loginForm.controls.password.setValue(password);
  fixture.detectChanges();

  const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  fixture.detectChanges();
}
