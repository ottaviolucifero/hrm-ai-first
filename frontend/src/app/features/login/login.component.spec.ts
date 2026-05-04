import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  it('shows login error immediately and resets loading after failed login', async () => {
    const authService = {
      login: vi.fn(() => throwError(() => ({ status: 401 })))
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

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
    expect(fixture.nativeElement.textContent).toContain('Email o password non corretti.');
  });
});
