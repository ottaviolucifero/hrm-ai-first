import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type AppInputType = 'text' | 'email' | 'number';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true
    }
  ],
  imports: [FormsModule]
})
export class AppInputComponent implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;

  @Input() label = '';
  @Input() labelRequired = false;
  @Input() placeholder = '';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() required = false;
  @Input() type: AppInputType = 'text';
  @Input() id = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  protected value = '';
  protected touched = false;

  @ViewChild('inputElement', { static: true }) private inputElement?: ElementRef<HTMLInputElement>;
  private readonly generatedId = `app-input-${++AppInputComponent.nextId}`;
  private onChange = (_value: string): void => {
    // placeholder for form control callback
  };
  private onTouched = (): void => {
    // placeholder for form control callback
  };
  private internalDisabled = false;

  protected get inputId(): string {
    return this.id.trim() || this.generatedId;
  }

  protected get disabledState(): boolean {
    return this.disabled || this.internalDisabled;
  }

  protected get helpId(): string {
    return `${this.inputId}-help`;
  }

  protected get errorId(): string {
    return `${this.inputId}-error`;
  }

  protected get helpTextToRender(): string {
    return this.helpText;
  }

  protected get errorTextToRender(): string {
    return this.errorText;
  }

  protected get hasError(): boolean {
    return this.errorTextToRender.trim().length > 0;
  }

  protected get describedByAttribute(): string | null {
    const ids = [];

    if (this.helpTextToRender) {
      ids.push(this.helpId);
    }

    if (this.errorTextToRender) {
      ids.push(this.errorId);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  }

  ngAfterViewInit(): void {
    this.applyValueToInput(this.value);
  }

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value = nextValue;
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  protected onBlur(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  writeValue(value: unknown): void {
    this.value = value == null ? '' : String(value);
    this.applyValueToInput(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled = isDisabled;
  }

  private applyValueToInput(inputValue: string): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = inputValue;
    }
  }
}

