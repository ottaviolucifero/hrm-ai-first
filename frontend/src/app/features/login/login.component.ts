import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { LanguageCode } from '../../core/i18n/i18n.models';
import { I18nService } from '../../core/i18n/i18n.service';
import { EmailFieldComponent } from '../../shared/form-fields/email-field.component';
import { PasswordFieldComponent } from '../../shared/form-fields/password-field.component';
import { NotificationService } from '../../shared/feedback/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    EmailFieldComponent,
    PasswordFieldComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private static readonly accountInactiveCode = 'AUTH_ACCOUNT_INACTIVE';
  private static readonly accountLockedCode = 'AUTH_ACCOUNT_LOCKED';

  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  protected readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected submitted = false;
  protected readonly loading = signal(false);
  protected readonly languageOptions: ReadonlyArray<{ readonly code: LanguageCode; readonly label: string }> = [
    { code: 'it', label: 'Italiano' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  protected updateLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.i18n.setLanguage(select.value as LanguageCode);
  }

  protected submit(): void {
    this.submitted = true;
    const email = this.loginForm.controls.email.value.trim().toLowerCase();
    const password = this.loginForm.controls.password.value;
    this.loginForm.controls.email.setValue(email);

    if (password.trim().length === 0) {
      this.loginForm.controls.password.setErrors({ required: true });
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.login(email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: (error) =>
          this.notificationService.error(this.i18n.t(this.resolveErrorMessageKey(error)), {
            titleKey: 'alert.title.danger',
            dismissible: true
          })
      });
  }

  private resolveErrorMessageKey(error: unknown): I18nKey {
    const code = this.readApiErrorCode(error);
    if (code === LoginComponent.accountInactiveCode) {
      return 'login.errorAccountInactive';
    }
    if (code === LoginComponent.accountLockedCode) {
      return 'login.errorAccountLocked';
    }
    return 'login.errorInvalidCredentials';
  }

  private readApiErrorCode(error: unknown): string | null {
    if (typeof error !== 'object' || error === null || !('error' in error)) {
      return null;
    }
    const apiError = (error as { error?: { code?: unknown } }).error;
    return typeof apiError?.code === 'string' ? apiError.code : null;
  }
}
