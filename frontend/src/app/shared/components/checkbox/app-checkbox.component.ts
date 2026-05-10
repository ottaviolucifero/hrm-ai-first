import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  forwardRef,
  AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './app-checkbox.component.html',
  styleUrl: './app-checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppCheckboxComponent),
      multi: true
    }
  ],
  imports: [FormsModule]
})
export class AppCheckboxComponent implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;

  @Input() label = '';
  @Input() labelRequired = false;
  @Input() helpText = '';
  @Input() required = false;
  @Input() id = '';
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  protected checked = false;
  @ViewChild('checkboxInput', { static: true }) private checkboxInput?: ElementRef<HTMLInputElement>;
  protected touched = false;

  private readonly generatedId = `app-checkbox-${++AppCheckboxComponent.nextId}`;
  private onChange = (_value: boolean): void => {
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

  protected get helpTextToRender(): string {
    return this.helpText;
  }

  protected get labelledById(): string {
    return `${this.inputId}-label`;
  }

  ngAfterViewInit(): void {
    this.applyCheckedStateToInput(this.checked);
  }

  protected onCheckboxInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).checked;
    this.checked = nextValue;
    this.applyCheckedStateToInput(nextValue);
    this.onChange(nextValue);
    this.checkedChange.emit(nextValue);
  }

  protected onCheckboxBlur(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
    this.applyCheckedStateToInput(this.checked);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled = isDisabled;
  }

  private applyCheckedStateToInput(checkedValue: boolean): void {
    if (this.checkboxInput) {
      this.checkboxInput.nativeElement.checked = checkedValue;
    }
  }
}
