import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PasswordFieldComponent } from './password-field.component';

@Component({
  selector: 'app-password-field-host',
  imports: [ReactiveFormsModule, PasswordFieldComponent],
  template: `
    <form [formGroup]="form">
      <app-password-field
        [control]="form.controls.password"
        [id]="fieldId"
        [label]="label"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        [submitted]="submitted"
        [errorText]="errorText" />
    </form>
  `
})
class PasswordFieldHostComponent {
  readonly form;
  fieldId = 'test-password';
  label = 'Password';
  placeholder = 'Insert password';
  autocomplete = 'new-password';
  submitted = false;
  errorText = '';

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }
}

describe('PasswordFieldComponent', () => {
  let fixture: ComponentFixture<PasswordFieldHostComponent>;
  let host: PasswordFieldHostComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PasswordFieldHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordFieldHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders configured id, autocomplete, label and placeholder', () => {
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(label.getAttribute('for')).toBe('test-password');
    expect(label.textContent).toContain('Password');
    expect(input.id).toBe('test-password');
    expect(input.getAttribute('autocomplete')).toBe('new-password');
    expect(input.placeholder).toBe('Insert password');
  });

  it('shows the required error when submitted with an empty value', () => {
    host.submitted = true;
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-destructive') as HTMLElement;
    expect(error.textContent).toContain('Password obbligatoria.');
  });

  it('shows the contextual error text when provided', () => {
    host.form.controls.password.setValue('TenantReset1!');
    host.form.controls.password.markAsTouched();
    host.errorText = 'La conferma password non coincide.';
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-destructive') as HTMLElement;
    expect(error.textContent).toContain('La conferma password non coincide.');
  });

  it('toggles password visibility', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const button = fixture.nativeElement.querySelector('button[type="button"]') as HTMLButtonElement;

    expect(input.type).toBe('password');
    button.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
  });
});
