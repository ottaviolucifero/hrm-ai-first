import { Component, Input, forwardRef, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

import { I18nService } from '../../core/i18n/i18n.service';
import { LookupSelectComponent } from '../components/lookup-select/lookup-select.component';
import { LookupLoadFn, LookupOption } from '../lookup/lookup.models';
import { PhoneFieldEmitMode, PhoneFieldValue } from './phone-field.models';

const DEFAULT_DIAL_CODES_BY_COUNTRY: Record<string, string> = {
  IT: '+39',
  TN: '+216'
};

const NATIONAL_NUMBER_PATTERN = /^[0-9\s()+-]*$/;

@Component({
  selector: 'app-phone-field',
  imports: [LookupSelectComponent],
  templateUrl: './phone-field.component.html',
  styleUrl: './phone-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneFieldComponent),
      multi: true
    }
  ]
})
export class PhoneFieldComponent implements ControlValueAccessor, Validator {
  private static nextId = 0;

  protected readonly i18n = inject(I18nService);

  @Input() label = '';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() numberPlaceholder = '';
  @Input() emitMode: PhoneFieldEmitMode = 'structured';
  @Input() minSearchLength = 0;
  @Input() pageSize = 25;
  @Input() id = '';
  @Input() dialCodeLookup: LookupLoadFn | null = null;
  @Input() set value(value: PhoneFieldValue | string | null | undefined) {
    this.writeValue(value);
  }
  @Input() set selectedCountryCode(value: string | null | undefined) {
    this.selectedCountry = value?.trim().toUpperCase() ?? '';
    this.applyDefaultDialCode(true);
  }

  protected phoneValue: PhoneFieldValue = {
    dialCode: null,
    nationalNumber: null,
    fullNumber: null
  };

  private readonly generatedId = `app-phone-field-${++PhoneFieldComponent.nextId}`;
  private selectedCountry = '';
  private dialCodeManuallyChanged = false;
  private onChange = (_value: PhoneFieldValue | string): void => {
    // placeholder for form callback
  };
  private onTouched = (): void => {
    // placeholder for form callback
  };
  private onValidatorChange = (): void => {
    // placeholder for validator callback
  };
  private internalDisabled = false;

  protected get inputId(): string {
    return this.id.trim() || this.generatedId;
  }

  protected get dialCodeFieldId(): string {
    return `${this.inputId}-dial-code`;
  }

  protected get numberFieldId(): string {
    return `${this.inputId}-number`;
  }

  protected get disabledState(): boolean {
    return this.disabled || this.internalDisabled;
  }

  protected get readonlyState(): boolean {
    return this.readonly || this.disabledState;
  }

  protected get labelText(): string {
    return this.label.trim() || this.i18n.t('companyProfileAdministration.fields.phone');
  }

  protected readonly dialCodeClosedLabel = (option: LookupOption): string => option.code;
  protected readonly dialCodeOptionLabel = (option: LookupOption): string => `${option.code} - ${option.name}`;

  get structuredValue(): PhoneFieldValue {
    return { ...this.phoneValue };
  }

  protected handleDialCodeChange(value: string): void {
    this.dialCodeManuallyChanged = true;
    this.updatePhoneValue(value || null, this.phoneValue.nationalNumber);
  }

  protected handleNationalNumberInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.setPhoneValue(this.phoneValue.dialCode, nextValue || null, true);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    const normalizedValue = this.normalizePhoneValue(value);
    this.phoneValue = normalizedValue;
    this.dialCodeManuallyChanged = normalizedValue.dialCode !== null;
    this.applyDefaultDialCode(false);
    this.onValidatorChange();
  }

  registerOnChange(fn: (value: PhoneFieldValue | string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled = isDisabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    const nationalNumber = this.phoneValue.nationalNumber ?? '';
    if (this.required && !nationalNumber.trim()) {
      return { required: true };
    }

    if (nationalNumber.trim() && !NATIONAL_NUMBER_PATTERN.test(nationalNumber)) {
      return { phoneFormat: true };
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private normalizePhoneValue(value: unknown): PhoneFieldValue {
    if (typeof value === 'string') {
      return this.parsePhoneString(value);
    }

    if (value && typeof value === 'object') {
      const candidate = value as Partial<PhoneFieldValue>;
      const dialCode = this.normalizePart(candidate.dialCode);
      const nationalNumber = this.normalizePart(candidate.nationalNumber);
      return {
        dialCode,
        nationalNumber,
        fullNumber: this.composeFullNumber(dialCode, nationalNumber)
      };
    }

    return {
      dialCode: null,
      nationalNumber: null,
      fullNumber: null
    };
  }

  private parsePhoneString(value: string): PhoneFieldValue {
    const normalized = value.trim();
    if (!normalized) {
      return {
        dialCode: null,
        nationalNumber: null,
        fullNumber: null
      };
    }

    const match = normalized.match(/^(\+\d+)\s*(.*)$/);
    if (!match) {
      return {
        dialCode: null,
        nationalNumber: normalized,
        fullNumber: normalized
      };
    }

    const dialCode = this.normalizePart(match[1]);
    const nationalNumber = this.normalizePart(match[2]);
    return {
      dialCode,
      nationalNumber,
      fullNumber: this.composeFullNumber(dialCode, nationalNumber)
    };
  }

  private updatePhoneValue(dialCode: string | null, nationalNumber: string | null): void {
    this.setPhoneValue(dialCode, nationalNumber, true);
  }

  private setPhoneValue(dialCode: string | null, nationalNumber: string | null, emitChange: boolean): void {
    const normalizedDialCode = this.normalizePart(dialCode);
    const normalizedNationalNumber = this.normalizePart(nationalNumber);
    this.phoneValue = {
      dialCode: normalizedDialCode,
      nationalNumber: normalizedNationalNumber,
      fullNumber: this.composeFullNumber(normalizedDialCode, normalizedNationalNumber)
    };
    if (emitChange) {
      this.onChange(this.emitValue());
      this.onTouched();
    }
    this.onValidatorChange();
  }

  private emitValue(): PhoneFieldValue | string {
    if (this.emitMode === 'compat-string') {
      return this.phoneValue.fullNumber ?? '';
    }

    return { ...this.phoneValue };
  }

  private applyDefaultDialCode(emitChange: boolean): void {
    if (this.dialCodeManuallyChanged) {
      return;
    }

    const nextDialCode = DEFAULT_DIAL_CODES_BY_COUNTRY[this.selectedCountry] ?? null;
    if (nextDialCode === this.phoneValue.dialCode) {
      return;
    }

    this.setPhoneValue(nextDialCode, this.phoneValue.nationalNumber, emitChange);
  }

  private composeFullNumber(dialCode: string | null, nationalNumber: string | null): string | null {
    const normalizedNationalNumber = this.normalizePart(nationalNumber);
    if (!normalizedNationalNumber) {
      return null;
    }

    const normalizedDialCode = this.normalizePart(dialCode);
    return normalizedDialCode
      ? `${normalizedDialCode} ${normalizedNationalNumber}`
      : normalizedNationalNumber;
  }

  private normalizePart(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}
