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
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) control!: FormControl<string>;
  @Input() label = 'Password';
  @Input() placeholder = 'Password';
  @Input() submitted = false;

  protected passwordVisible = false;

  get inputType(): 'password' | 'text' {
    return this.passwordVisible ? 'text' : 'password';
  }

  get showErrors(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
