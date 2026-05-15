import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { LookupLoadFn, LookupOption } from '../../shared/lookup/lookup.models';
import { MasterDataFormField, MasterDataFormMode, MasterDataFormFieldType, MasterDataRow } from './master-data.models';

export interface MasterDataFormSubmitEvent {
  readonly mode: MasterDataFormMode;
  readonly value: Record<string, unknown>;
}

@Component({
  selector: 'app-master-data-form',
  imports: [AppButtonComponent, ReactiveFormsModule, AppCheckboxComponent, AppInputComponent, LookupSelectComponent],
  templateUrl: './master-data-form.component.html',
  styleUrl: './master-data-form.component.scss'
})
export class MasterDataFormComponent implements OnChanges, OnDestroy, OnInit {
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
  private dependencySubscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['mode'] || changes['value']) {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.clearDependencySubscriptions();
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

  protected isFieldDisabled(field: MasterDataFormField): boolean {
    if (this.isFieldReadOnly(field)) {
      return true;
    }

    return field.dependsOn?.some((dependencyKey) => !this.stringValueOf(dependencyKey)) ?? false;
  }

  protected hasRequiredError(field: MasterDataFormField): boolean {
    const control = this.form.controls[field.key];
    if (!control) {
      return false;
    }
    return control.hasError('required') && (control.touched || this.submitted);
  }

  protected lookupLoadPage(field: MasterDataFormField): LookupLoadFn | null {
    if (field.lookupLoadPageFactory) {
      return field.lookupLoadPageFactory((key) => this.stringValueOf(key));
    }

    return field.lookupLoadPage ?? null;
  }

  protected initialLookupOption(field: MasterDataFormField): LookupOption | null {
    return field.initialOptionResolver?.(this.value) ?? null;
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
    this.clearDependencySubscriptions();
    const controls: Record<string, FormControl<unknown>> = {};
    const normalizedFields: MasterDataFormField[] = [];

    for (const field of this.fields) {
      const key = field.key?.trim();
      if (!key) {
        continue;
      }
      if (field.modes && !field.modes.includes(this.mode)) {
        continue;
      }

      const rawValue = this.value?.[key];
      const nextValue = this.resolveFieldValue(field, rawValue);
      controls[key] = new FormControl(
        { value: nextValue, disabled: this.isFieldReadOnly(field) },
        field.required ? [Validators.required] : []
      );
      normalizedFields.push({ ...field, key });
    }

    this.form = new FormGroup(controls);
    this.normalizedFields = normalizedFields;
    this.hydrateInitialLookupValues();
    this.setupDependencyHandling();
  }

  private resolveFieldValue(field: MasterDataFormField, rawValue: unknown): unknown {
    if (this.fieldType(field) === 'lookup') {
      if (typeof rawValue === 'string') {
        return rawValue;
      }

      if (rawValue && typeof rawValue === 'object') {
        const candidateId = (rawValue as Record<string, unknown>)['id'];
        if (typeof candidateId === 'string' && candidateId.trim()) {
          return candidateId;
        }
      }

      const initialOption = field.initialOptionResolver?.(this.value) ?? null;
      return initialOption?.id ?? '';
    }

    if (rawValue !== undefined && rawValue !== null) {
      return rawValue;
    }

    return this.fieldType(field) === 'boolean' ? false : '';
  }

  private hydrateInitialLookupValues(): void {
    for (const field of this.normalizedFields) {
      if (this.fieldType(field) !== 'lookup') {
        continue;
      }

      const control = this.form.controls[field.key];
      if (!control || this.stringValueOf(field.key)) {
        continue;
      }

      const initialOption = field.initialOptionResolver?.(this.value) ?? null;
      if (initialOption?.id.trim()) {
        control.setValue(initialOption.id, { emitEvent: false });
      }
    }
  }

  private setupDependencyHandling(): void {
    for (const field of this.normalizedFields) {
      this.syncDependencyState(field, false);
      for (const dependencyKey of field.dependsOn ?? []) {
        const dependencyControl = this.form.controls[dependencyKey];
        if (!dependencyControl) {
          continue;
        }

        let previousDependencyValue = this.stringValueOf(dependencyKey);
        this.dependencySubscriptions.push(
          dependencyControl.valueChanges.subscribe(() => {
            const nextDependencyValue = this.stringValueOf(dependencyKey);
            if (nextDependencyValue === previousDependencyValue) {
              return;
            }

            previousDependencyValue = nextDependencyValue;
            this.syncDependencyState(field, true);
          })
        );
      }
    }
  }

  private syncDependencyState(field: MasterDataFormField, clearValue: boolean): void {
    const control = this.form.controls[field.key];
    if (!control || this.isFieldReadOnly(field)) {
      return;
    }

    const dependenciesSatisfied = !(field.dependsOn?.some((dependencyKey) => !this.stringValueOf(dependencyKey)) ?? false);
    if (!dependenciesSatisfied) {
      if (clearValue && this.stringValueOf(field.key)) {
        control.setValue('');
      }
      control.disable({ emitEvent: false });
      return;
    }

    if (clearValue && this.stringValueOf(field.key)) {
      control.setValue('');
    }
    control.enable({ emitEvent: false });
  }

  private stringValueOf(key: string): string | null {
    const control = this.form.controls[key];
    if (!control) {
      return null;
    }

    const value = control.getRawValue();
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private clearDependencySubscriptions(): void {
    this.dependencySubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.dependencySubscriptions = [];
  }
}
