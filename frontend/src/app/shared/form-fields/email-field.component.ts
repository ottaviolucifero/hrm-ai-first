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
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) control!: FormControl<string>;
  @Input() label = 'Email';
  @Input() placeholder = 'name@company.com';
  @Input() submitted = false;

  get showErrors(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }
}
