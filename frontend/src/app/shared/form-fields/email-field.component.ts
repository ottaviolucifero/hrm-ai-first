import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-field',
  imports: [ReactiveFormsModule],
  templateUrl: './email-field.component.html',
  styleUrl: './email-field.component.scss'
})
export class EmailFieldComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() label = 'Email';
  @Input() placeholder = 'name@company.com';
  @Input() submitted = false;

  get showErrors(): boolean {
    return this.control.invalid && (this.control.touched || this.submitted);
  }
}
