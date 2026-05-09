import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { MasterDataFormField, MasterDataFormMode, MasterDataFormFieldType, MasterDataRow } from './master-data.models';

export interface MasterDataFormSubmitEvent {
  readonly mode: MasterDataFormMode;
  readonly value: Record<string, unknown>;
}

@Component({
  selector: 'app-master-data-form',
  imports: [AppButtonComponent, ReactiveFormsModule],
  templateUrl: './master-data-form.component.html',
  styleUrl: './master-data-form.component.scss'
})
export class MasterDataFormComponent implements OnChanges, OnInit {
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) mode: MasterDataFormMode = 'view';
  @Input({ required: true }) resourceTitleKey: I18nKey = 'masterData.title';
  @Input() fields: readonly MasterDataFormField[] = [];
  @Input() value: MasterDataRow | null = null;
  @Input() submitting = false;

  @Output() save = new EventEmitter<MasterDataFormSubmitEvent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected form = new FormGroup<Record<string, FormControl<unknown>>>({});
  protected submitted = false;
  protected normalizedFields: readonly MasterDataFormField[] = [];

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['mode'] || changes['value']) {
      this.buildForm();
    }
  }

  protected titleKey(): I18nKey {
    if (this.mode === 'create') {
      return 'masterData.form.title.create';
    }
    if (this.mode === 'edit') {
      return 'masterData.form.title.edit';
    }
    return 'masterData.form.title.view';
  }

  protected fieldType(field: MasterDataFormField): MasterDataFormFieldType {
    return field.type ?? 'text';
  }

  protected isFieldReadOnly(field: MasterDataFormField): boolean {
    return this.mode === 'view' || field.readOnly === true;
  }

  protected hasRequiredError(field: MasterDataFormField): boolean {
    const control = this.form.controls[field.key];
    if (!control) {
      return false;
    }
    return control.hasError('required') && (control.touched || this.submitted);
  }

  protected submit(): void {
    this.submitted = true;
    if (this.mode === 'view') {
      this.close.emit();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      mode: this.mode,
      value: this.form.getRawValue()
    });
  }

  protected resetAndCancel(): void {
    this.buildForm();
    this.cancel.emit();
  }

  private buildForm(): void {
    this.submitted = false;
    const controls: Record<string, FormControl<unknown>> = {};
    const normalizedFields: MasterDataFormField[] = [];

    for (const field of this.fields) {
      const key = field.key?.trim();
      if (!key) {
        continue;
      }

      const rawValue = this.value?.[key];
      const nextValue = rawValue ?? (this.fieldType(field) === 'boolean' ? false : '');
      controls[key] = new FormControl(
        { value: nextValue, disabled: this.isFieldReadOnly(field) },
        field.required ? [Validators.required] : []
      );
      normalizedFields.push({ ...field, key });
    }

    this.form = new FormGroup(controls);
    this.normalizedFields = normalizedFields;
  }
}
