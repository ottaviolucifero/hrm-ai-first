import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-email-field',
  imports: [ReactiveFormsModule],
  templateUrl: './email-field.component.html',
  styleUrl: './email-field.component.scss'
})
export class EmailFieldComponent {
  private static nextId = 0;

  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) control!: FormControl<string>;
  @Input() id = '';
  @Input() label = 'Email';
  @Input() placeholder = 'name@company.com';
  @Input() submitted = false;
  @Input() required = false;
  private readonly generatedId = `app-email-field-${++EmailFieldComponent.nextId}`;

  get inputId(): string {
    return this.id.trim() || this.generatedId;
  }

  get errorId(): string {
    return `${this.inputId}-error`;
  }

  get showErrors(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }
}
