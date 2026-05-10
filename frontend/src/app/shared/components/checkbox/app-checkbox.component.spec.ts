import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { AppCheckboxComponent } from './app-checkbox.component';

@Component({
  selector: 'app-checkbox-form-host',
  imports: [ReactiveFormsModule, AppCheckboxComponent],
  template: `
    <form [formGroup]="form">
      <app-checkbox
        (checkedChange)="onCheckedChange($event)"
        formControlName="active"
        label="Campo attivo"
        [labelRequired]="true"
      />
    </form>
  `
})
class CheckboxFormHostComponent {
  readonly form;
  lastChecked = false;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      active: [false]
    });
  }

  protected onCheckedChange(value: boolean): void {
    this.lastChecked = value;
  }
}

describe('AppCheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxFormHostComponent>;
  let host: CheckboxFormHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CheckboxFormHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxFormHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders label and required marker', () => {
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.app-checkbox-label') as HTMLElement;
    expect(label.textContent).toContain('Campo attivo');
    expect(label.textContent).toContain('*');
  });

  it('updates form control when toggled', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(host.form.controls.active.value).toBe(true);
    expect(input.checked).toBe(true);
  });

  it('keeps value when form control is programmatically updated', () => {
    fixture.detectChanges();

    host.form.controls.active.setValue(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('disables interaction when the control is disabled', () => {
    fixture.detectChanges();

    host.form.controls.active.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
    expect(host.form.controls.active.disabled).toBe(true);
  });

  it('emits checkedChange on user toggle', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    fixture.detectChanges();

    expect(host.lastChecked).toBe(true);
  });
});
