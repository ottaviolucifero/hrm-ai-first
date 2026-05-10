import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { AppInputComponent } from './app-input.component';

@Component({
  selector: 'app-input-form-host',
  imports: [ReactiveFormsModule, AppInputComponent],
  template: `
    <form [formGroup]="form">
      <app-input
        #inputControl
        [label]="label"
        [labelRequired]="required"
        [placeholder]="placeholder"
        [required]="required"
        [helpText]="helpText"
        [errorText]="errorText"
        (valueChange)="onValueChange($event)"
        formControlName="name" />
    </form>
  `
})
class InputFormHostComponent {
  readonly form;
  label = 'Nome';
  placeholder = 'Es. Mario';
  required = false;
  helpText = '';
  errorText = '';
  lastValue = '';

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      name: ['']
    });
  }

  protected onValueChange(value: string): void {
    this.lastValue = value;
  }
}

describe('AppInputComponent', () => {
  let fixture: ComponentFixture<InputFormHostComponent>;
  let host: InputFormHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InputFormHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputFormHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders label, required marker and placeholder', () => {
    host.required = true;
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.app-input-label') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;

    expect(label.textContent).toContain('Nome');
    expect(label.textContent).toContain('*');
    expect(input.placeholder).toBe('Es. Mario');
  });

  it('updates form control when user types', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    input.value = 'Anna';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.name.value).toBe('Anna');
    expect(host.lastValue).toBe('Anna');
  });

  it('renders error text when provided', () => {
    host.errorText = 'Campo obbligatorio.';
    fixture.detectChanges();

    const errorText = fixture.nativeElement.querySelector('.app-input-error') as HTMLElement;
    expect(errorText.textContent).toContain('Campo obbligatorio.');
    expect(fixture.nativeElement.querySelector('input[type="text"]')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('keeps value when form control is programmatically updated', () => {
    fixture.detectChanges();

    host.form.controls.name.setValue('Luca');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input.value).toBe('Luca');
  });

  it('disables interaction when the control is disabled', () => {
    fixture.detectChanges();

    host.form.controls.name.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(host.form.controls.name.disabled).toBe(true);
  });
});
