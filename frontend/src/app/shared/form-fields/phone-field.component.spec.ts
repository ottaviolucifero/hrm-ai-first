import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { defer, of } from 'rxjs';

import { LookupQuery } from '../lookup/lookup.models';
import { LookupSelectComponent } from '../components/lookup-select/lookup-select.component';
import { PhoneFieldComponent } from './phone-field.component';

@Component({
  imports: [ReactiveFormsModule, PhoneFieldComponent],
  template: `
    <form [formGroup]="form">
      <app-phone-field
        formControlName="phone"
        [required]="true"
        [emitMode]="emitMode"
        [selectedCountryCode]="selectedCountryCode"
        [dialCodeLookup]="dialCodeLookup" />
    </form>
  `
})
class PhoneFieldHostComponent {
  readonly form;
  emitMode: 'structured' | 'compat-string' = 'compat-string';
  selectedCountryCode = 'IT';
  private readonly dialCodeOptions = [
    { id: '+39', code: '+39', name: 'Italy', metadata: { countryCode: 'IT', phoneCode: '+39' } },
    { id: '+216', code: '+216', name: 'Tunisia', metadata: { countryCode: 'TN', phoneCode: '+216' } }
  ];
  dialCodeLookup = vi.fn((_query: LookupQuery) => defer(() => Promise.resolve({
    content: this.filterDialCodeOptions(_query.search),
    page: 0,
    size: 25,
    totalElements: this.filterDialCodeOptions(_query.search).length,
    totalPages: 1,
    first: true,
    last: true
  })));

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      phone: ['']
    });
  }

  private filterDialCodeOptions(search?: string): readonly { id: string; code: string; name: string; metadata: { countryCode: string; phoneCode: string } }[] {
    const normalizedSearch = search?.trim().toLowerCase();
    if (!normalizedSearch) {
      return this.dialCodeOptions;
    }

    return this.dialCodeOptions.filter((option) =>
      [option.code, option.name, option.metadata.countryCode, option.metadata.phoneCode]
        .some((value) => value.toLowerCase().includes(normalizedSearch)));
  }
}

describe('PhoneFieldComponent', () => {
  let fixture: ComponentFixture<PhoneFieldHostComponent>;
  let host: PhoneFieldHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneFieldHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneFieldHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('emits a backend-compatible string in compat mode', () => {
    fixture.detectChanges();
    const component = getPhoneFieldComponent();
    component['handleDialCodeChange']('+39');
    component['handleNationalNumberInput'](makeInputEvent('3331234567'));
    fixture.detectChanges();

    expect(host.form.controls.phone.value).toBe('+39 3331234567');
  });

  it('emits a structured value in structured mode', () => {
    host.emitMode = 'structured';
    fixture.detectChanges();

    const component = getPhoneFieldComponent();
    component['handleDialCodeChange']('+216');
    component['handleNationalNumberInput'](makeInputEvent('20123456'));
    fixture.detectChanges();

    expect(host.form.controls.phone.value).toEqual({
      dialCode: '+216',
      nationalNumber: '20123456',
      fullNumber: '+216 20123456'
    });
  });

  it('applies Italy and Tunisia defaults without overriding a manual change', () => {
    fixture.detectChanges();
    const component = getPhoneFieldComponent();
    expect(component.structuredValue.dialCode).toBe('+39');

    component['handleDialCodeChange']('+216');
    host.selectedCountryCode = 'IT';
    fixture.detectChanges();

    expect(component.structuredValue.dialCode).toBe('+216');
  });

  it('parses an initial backend phone string into the structured model', () => {
    fixture.detectChanges();
    host.form.controls.phone.setValue('+39 3331234567');
    fixture.detectChanges();

    const component = getPhoneFieldComponent();
    expect(component.structuredValue).toEqual({
      dialCode: '+39',
      nationalNumber: '3331234567',
      fullNumber: '+39 3331234567'
    });
  });

  it('marks the control invalid when the number contains unsupported characters', () => {
    fixture.detectChanges();
    const component = getPhoneFieldComponent();
    component['handleNationalNumberInput'](makeInputEvent('ABC123'));
    fixture.detectChanges();

    expect(host.form.controls.phone.hasError('phoneFormat')).toBe(true);
  });

  it('shows prefix labels through the nested lookup select', () => {
    fixture.detectChanges();

    const lookupSelect = fixture.debugElement.query(By.directive(LookupSelectComponent)).componentInstance as LookupSelectComponent;
    expect(lookupSelect['optionLabelBuilder']({ id: '+39', code: '+39', name: 'Italy' })).toBe('+39 - Italy');
    expect(lookupSelect['optionLabelBuilder']({ id: '+216', code: '+216', name: 'Tunisia' })).toBe('+216 - Tunisia');
    expect(lookupSelect['closedLabelBuilder']({ id: '+39', code: '+39', name: 'Italy' })).toBe('+39');
  });

  it('renders a compact prefix lookup with the clear button inside the field', () => {
    fixture.detectChanges();

    const compactField = fixture.nativeElement.querySelector('.lookup-select-field.lookup-select-field-compact') as HTMLElement;
    const control = compactField.querySelector('.lookup-select-control.lookup-select-control-autocomplete') as HTMLElement;
    const clearButton = control.querySelector('.lookup-select-clear-button') as HTMLButtonElement;

    expect(compactField).not.toBeNull();
    expect(clearButton).not.toBeNull();
    expect(clearButton.getAttribute('aria-label')).toBeTruthy();
  });

  it('triggers the nested dial-code lookup after 700 ms without blur', async () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.value = 'tunisia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.dialCodeLookup).not.toHaveBeenCalledWith(expect.objectContaining({ search: 'tunisia' }));

    await vi.advanceTimersByTimeAsync(699);
    expect(host.dialCodeLookup).not.toHaveBeenCalledWith(expect.objectContaining({ search: 'tunisia' }));

    await vi.advanceTimersByTimeAsync(1);
    expect(host.dialCodeLookup).toHaveBeenCalledWith(expect.objectContaining({ search: 'tunisia' }));
  });

  it('renders Tunisia in the prefix dropdown and selects +216 on Enter', async () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    input.value = 'tunisia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    await flushLookupAsync();
    fixture.detectChanges();
    const lookupSelect = fixture.debugElement.query(By.directive(LookupSelectComponent)).componentInstance as LookupSelectComponent;
    expect((lookupSelect as any).renderedOptions).toHaveLength(1);
    expect((lookupSelect as any).renderedOptions[0].name).toBe('Tunisia');

    const optionButtons = fixture.nativeElement.querySelectorAll('.lookup-select-option');
    expect(optionButtons).toHaveLength(1);
    expect((optionButtons[0] as HTMLButtonElement).textContent).toContain('+216 - Tunisia');
    expect((optionButtons[0] as HTMLButtonElement).classList.contains('lookup-select-option-highlighted')).toBe(true);

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    input.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(true);
    expect(getPhoneFieldComponent().structuredValue.dialCode).toBe('+216');
    expect(input.value).toBe('+216');
  });

  function getPhoneFieldComponent(): PhoneFieldComponent {
    return fixture.debugElement.query(By.directive(PhoneFieldComponent)).componentInstance as PhoneFieldComponent;
  }

  function makeInputEvent(value: string): Event {
    return { target: { value } } as unknown as Event;
  }

  async function flushLookupAsync(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  }
});
