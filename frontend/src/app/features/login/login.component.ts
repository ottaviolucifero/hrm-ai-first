import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AlertMessageComponent } from '../../shared/feedback/alert-message.component';
import { EmailFieldComponent } from '../../shared/form-fields/email-field.component';
import { PasswordFieldComponent } from '../../shared/form-fields/password-field.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AlertMessageComponent,
    EmailFieldComponent,
    PasswordFieldComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected submitted = false;
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected submit(): void {
    this.submitted = true;
    this.errorMessage.set('');

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
        error: () => this.errorMessage.set('Email o password non corretti.')
      });
  }
}
