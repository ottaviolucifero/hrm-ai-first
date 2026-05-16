import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { I18nService } from '../../../core/i18n/i18n.service';
import { AppDateTimeFieldComponent } from './app-date-time-field.component';

@Component({
  imports: [ReactiveFormsModule, AppDateTimeFieldComponent],
  template: `
    <form [formGroup]="form">
      <app-date-time-field
        formControlName="purchaseDate"
        [label]="'Purchase date'"
        [helpText]="'Choose a date'"
        [errorText]="purchaseError"
        [required]="true" />
      <app-date-time-field
        formControlName="assignedAt"
        [label]="'Assigned at'"
        [mode]="'datetime'"
        [readonly]="isReadonly" />
    </form>
  `
})
class DateTimeFieldHostComponent {
  readonly form;
  isReadonly = false;
  purchaseError = '';

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      purchaseDate: ['2026-05-15'],
      assignedAt: ['2026-05-15T09:30']
    });
  }
}

describe('AppDateTimeFieldComponent', () => {
  let fixture: ComponentFixture<DateTimeFieldHostComponent>;
  let host: DateTimeFieldHostComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');
    await TestBed.configureTestingModule({
      imports: [DateTimeFieldHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimeFieldHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders label, editable input, calendar icon, help and error text', () => {
    host.purchaseError = 'Invalid date';
    fixture.detectChanges();

    const firstField = dateTimeFields()[0];
    const input = fieldInput(0);
    const textContent = firstField.textContent as string;

    expect(input.type).toBe('text');
    expect(input.readOnly).toBe(false);
    expect(input.value).toBe('15/05/2026');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(firstField.querySelector('.ki-calendar')).not.toBeNull();
    expect(textContent).toContain('Purchase date');
    expect(textContent).toContain('Choose a date');
    expect(textContent).toContain('Invalid date');
  });

  it('opens a date popup without time columns', () => {
    fixture.detectChanges();

    openField(0);

    expect(firstPanel()).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('maggio');
    expect(fixture.nativeElement.textContent).toContain('lu');
    expect(firstPanel()?.querySelector('.app-date-time-time')).toBeNull();
  });

  it('updates the form from manual valid date input and keeps the popup in sync', () => {
    fixture.detectChanges();

    typeDigits(0, '20062026');

    expect(host.form.controls.purchaseDate.value).toBe('2026-06-20');
    expect(fieldInput(0).value).toBe('20/06/2026');

    openField(0);
    expect(panelText()).toContain('giugno');
    expect(selectedDayButton()?.textContent?.trim()).toBe('20');
  });

  it('updates the form from manual valid datetime input', () => {
    fixture.detectChanges();

    typeDigits(1, '160520261145');

    expect(host.form.controls.assignedAt.value).toBe('2026-05-16T11:45');
    expect(fieldInput(1).value).toBe('16/05/2026 11:45');
  });

  it('keeps the last valid model value for incomplete manual input and shows local format error on blur', () => {
    fixture.detectChanges();

    typeDigits(0, '1605');
    blurField(0);

    expect(host.form.controls.purchaseDate.value).toBe('2026-05-15');
    expect(fieldInput(0).getAttribute('aria-invalid')).toBe('true');
    expect(fieldText(0)).toContain('Formato non valido. Usa gg/mm/aaaa.');
  });

  it('updates the visible text after popup selection', () => {
    fixture.detectChanges();

    openField(0);
    clickCalendarDay('20');
    clickButton(firstPanel(), 'Conferma');

    expect(host.form.controls.purchaseDate.value).toBe('2026-05-20');
    expect(fieldInput(0).value).toBe('20/05/2026');
  });

  it('supports year selection without month-by-month navigation', () => {
    fixture.detectChanges();

    openField(0);
    changeYear(2030);

    expect(panelText()).toContain('2030');
    clickCalendarDay('15');
    clickButton(firstPanel(), 'Conferma');

    expect(host.form.controls.purchaseDate.value).toBe('2030-05-15');
    expect(fieldInput(0).value).toBe('15/05/2030');
  });

  it('shows time columns only for datetime fields', () => {
    fixture.detectChanges();

    openField(1);
    expect(firstPanel()?.querySelector('.app-date-time-time')).not.toBeNull();

    clickCalendarDay('16');
    clickTimeOption(0, '11');
    clickTimeOption(1, '45');
    clickButton(firstPanel(), 'Conferma');

    expect(host.form.controls.assignedAt.value).toBe('2026-05-16T11:45');
  });

  it('sets today as draft value and confirms current date and time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 16, 6, 34));
    fixture.detectChanges();

    openField(1);
    clickButton(firstPanel(), 'Oggi');
    clickButton(firstPanel(), 'Conferma');

    expect(host.form.controls.assignedAt.value).toBe('2026-05-16T06:34');
    expect(fieldInput(1).value).toBe('16/05/2026 06:34');
  });

  it('cancels popup changes without changing the reactive form value', () => {
    fixture.detectChanges();

    openField(0);
    clickCalendarDay('20');
    clickButton(firstPanel(), 'Annulla');

    expect(host.form.controls.purchaseDate.value).toBe('2026-05-15');
    expect(fieldInput(0).value).toBe('15/05/2026');
    expect(firstPanel()).toBeNull();
  });

  it('renders localized placeholders and footer labels', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('fr');
    host.form.controls.purchaseDate.setValue('');
    fixture.detectChanges();

    expect(fieldInput(0).placeholder).toBe('jj/mm/aaaa');

    openField(0);
    const textContent = panelText();

    expect(textContent).toContain('Annuler');
    expect(textContent).toContain("Aujourd'hui");
    expect(textContent).toContain('Confirmer');
    expect(textContent).toContain('lun');
  });

  it('supports readonly mode by blocking popup opening', () => {
    host.isReadonly = true;
    fixture.detectChanges();

    openField(1);

    const toggle = dateTimeFields()[1].querySelector('.app-date-time-toggle') as HTMLButtonElement;
    expect(toggle.disabled).toBe(true);
    expect(firstPanel()).toBeNull();
  });

  function dateTimeFields(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.app-date-time-field')) as HTMLElement[];
  }

  function firstPanel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.app-date-time-panel') as HTMLElement | null;
  }

  function fieldInput(index: number): HTMLInputElement {
    return dateTimeFields()[index].querySelector('input') as HTMLInputElement;
  }

  function fieldText(index: number): string {
    return dateTimeFields()[index].textContent ?? '';
  }

  function panelText(): string {
    return firstPanel()?.textContent ?? '';
  }

  function selectedDayButton(): HTMLButtonElement | null {
    return firstPanel()?.querySelector('.app-date-time-day-selected') as HTMLButtonElement | null;
  }

  function openField(index: number): void {
    fieldInput(index).dispatchEvent(new Event('focus'));
    fixture.detectChanges();
  }

  function blurField(index: number): void {
    fieldInput(index).dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
  }

  function typeDigits(index: number, value: string): void {
    const input = fieldInput(index);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function clickButton(root: HTMLElement | null, label: string): void {
    const button = Array.from(root?.querySelectorAll('button') ?? [])
      .find((candidate) => candidate.textContent?.trim() === label) as HTMLButtonElement | undefined;

    expect(button).toBeTruthy();
    button?.click();
    fixture.detectChanges();
  }

  function clickCalendarDay(label: string): void {
    const button = Array.from(firstPanel()?.querySelectorAll('.app-date-time-day') ?? [])
      .find((candidate) => candidate.textContent?.trim() === label) as HTMLButtonElement | undefined;

    expect(button).toBeTruthy();
    button?.click();
    fixture.detectChanges();
  }

  function clickTimeOption(columnIndex: number, label: string): void {
    const columns = Array.from(
      firstPanel()?.querySelectorAll('.app-date-time-time-column') ?? []
    ) as HTMLElement[];
    const button = Array.from(columns[columnIndex]?.querySelectorAll('button') ?? [])
      .find((candidate) => candidate.textContent?.trim() === label) as HTMLButtonElement | undefined;

    expect(button).toBeTruthy();
    button?.click();
    fixture.detectChanges();
  }

  function changeYear(year: number): void {
    const select = firstPanel()?.querySelector('.app-date-time-year-select') as HTMLSelectElement;
    select.value = String(year);
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }
});
