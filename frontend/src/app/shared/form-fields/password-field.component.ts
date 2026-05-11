import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-password-field',
  imports: [ReactiveFormsModule],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss'
})
export class PasswordFieldComponent {
  private static nextId = 0;

  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) control!: FormControl<string>;
  @Input() id = '';
  @Input() label = 'Password';
  @Input() placeholder = '';
  @Input() autocomplete = '';
  @Input() submitted = false;
  @Input() errorText = '';

  protected passwordVisible = false;
  private readonly generatedId = `app-password-field-${++PasswordFieldComponent.nextId}`;

  get inputId(): string {
    return this.id.trim() || this.generatedId;
  }

  get errorId(): string {
    return `${this.inputId}-error`;
  }

  get inputType(): 'password' | 'text' {
    return this.passwordVisible ? 'text' : 'password';
  }

  get invalidState(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }

  get showErrors(): boolean {
    return Boolean(this.resolvedErrorText);
  }

  get resolvedErrorText(): string {
    if (this.control.hasError('required') && (this.control.touched || this.submitted)) {
      return this.i18n.t('form.password.required');
    }

    if (this.errorText.trim().length > 0 && (this.control.touched || this.control.dirty || this.submitted)) {
      return this.errorText;
    }

    return '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
