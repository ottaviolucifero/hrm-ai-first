import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  effect,
  forwardRef,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { I18nKey } from '../../../core/i18n/i18n.messages';
import { I18nService } from '../../../core/i18n/i18n.service';
import { LanguageCode } from '../../../core/i18n/i18n.models';

type AppDateTimeFieldMode = 'date' | 'datetime';

interface CalendarCell {
  readonly date: Date;
  readonly day: number;
  readonly isoDate: string;
  readonly outsideMonth: boolean;
  readonly selected: boolean;
  readonly today: boolean;
}

interface ParsedManualValue {
  readonly date: Date;
  readonly isoValue: string;
  readonly displayValue: string;
}

@Component({
  selector: 'app-date-time-field',
  templateUrl: './app-date-time-field.component.html',
  styleUrl: './app-date-time-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDateTimeFieldComponent),
      multi: true
    }
  ]
})
export class AppDateTimeFieldComponent implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;
  private static readonly HOURS = Array.from({ length: 24 }, (_value, index) => index);
  private static readonly MINUTES = Array.from({ length: 60 }, (_value, index) => index);
  private static readonly WEEKDAYS: Record<LanguageCode, readonly string[]> = {
    it: ['lu', 'ma', 'me', 'gi', 've', 'sa', 'do'],
    fr: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly i18n = inject(I18nService);

  @Input() label = '';
  @Input() labelRequired = false;
  @Input() placeholder = '';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() mode: AppDateTimeFieldMode = 'date';
  @Input() id = '';
  @Output() valueChange = new EventEmitter<string>();

  protected value = '';
  protected textValue = '';
  protected touched = false;
  protected panelOpen = false;
  protected displayedYear = new Date().getFullYear();
  protected displayedMonth = new Date().getMonth();
  protected draftDate: Date | null = null;
  protected draftHour = 0;
  protected draftMinute = 0;
  protected localFormatError = false;
  protected readonly hours = AppDateTimeFieldComponent.HOURS;
  protected readonly minutes = AppDateTimeFieldComponent.MINUTES;

  @ViewChild('inputElement', { static: true }) private inputElement?: ElementRef<HTMLInputElement>;
  private readonly generatedId = `app-date-time-field-${++AppDateTimeFieldComponent.nextId}`;
  private readonly languageEffect = effect(() => {
    this.i18n.language();
    this.applyTextValueToInput();
  });
  private valueBeforeOpen = '';
  private textBeforeOpen = '';
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

  protected get panelId(): string {
    return `${this.inputId}-panel`;
  }

  protected get yearSelectId(): string {
    return `${this.inputId}-year`;
  }

  protected get helpId(): string {
    return `${this.inputId}-help`;
  }

  protected get errorId(): string {
    return `${this.inputId}-error`;
  }

  protected get disabledState(): boolean {
    return this.disabled || this.internalDisabled;
  }

  protected get readonlyState(): boolean {
    return this.readonly || this.disabledState;
  }

  protected get helpTextToRender(): string {
    return this.helpText;
  }

  protected get errorTextToRender(): string {
    if (this.errorText.trim()) {
      return this.errorText;
    }

    return this.localFormatError ? this.i18n.t(this.invalidFormatKey()) : '';
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

  protected get placeholderText(): string {
    if (this.placeholder.trim()) {
      return this.placeholder;
    }

    return this.i18n.t(this.mode === 'datetime'
      ? 'dateTimeField.placeholder.datetime'
      : 'dateTimeField.placeholder.date');
  }

  protected get monthLabel(): string {
    return new Intl.DateTimeFormat(this.i18n.language(), {
      month: 'long'
    }).format(new Date(this.displayedYear, this.displayedMonth, 1));
  }

  protected get weekdayLabels(): readonly string[] {
    return AppDateTimeFieldComponent.WEEKDAYS[this.i18n.language()];
  }

  protected get yearOptions(): readonly number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 101 }, (_value, index) => currentYear - 80 + index);
  }

  protected get calendarCells(): readonly CalendarCell[] {
    const monthStart = new Date(this.displayedYear, this.displayedMonth, 1);
    const mondayOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(this.displayedYear, this.displayedMonth, 1 - mondayOffset);
    const cells: CalendarCell[] = [];

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
      cells.push({
        date,
        day: date.getDate(),
        isoDate: this.toDateValue(date),
        outsideMonth: date.getMonth() !== this.displayedMonth,
        selected: this.draftDate ? this.sameDate(date, this.draftDate) : false,
        today: this.sameDate(date, new Date())
      });
    }

    return cells;
  }

  protected get showTimePicker(): boolean {
    return this.mode === 'datetime';
  }

  protected openPanel(): void {
    if (this.readonlyState) {
      return;
    }

    this.valueBeforeOpen = this.value;
    this.textBeforeOpen = this.textValue;
    this.initializeDraft(this.value);
    this.panelOpen = true;
  }

  protected togglePanel(): void {
    if (this.panelOpen) {
      this.closePanelPreservingInput();
      return;
    }

    this.openPanel();
  }

  protected previousMonth(): void {
    const previous = new Date(this.displayedYear, this.displayedMonth - 1, 1);
    this.displayedYear = previous.getFullYear();
    this.displayedMonth = previous.getMonth();
  }

  protected nextMonth(): void {
    const next = new Date(this.displayedYear, this.displayedMonth + 1, 1);
    this.displayedYear = next.getFullYear();
    this.displayedMonth = next.getMonth();
  }

  protected changeDisplayedYear(event: Event): void {
    const nextYear = Number((event.target as HTMLSelectElement).value);
    if (Number.isNaN(nextYear)) {
      return;
    }

    this.displayedYear = nextYear;
    if (this.draftDate) {
      const adjustedDate = this.createValidDate(
        nextYear,
        this.draftDate.getMonth() + 1,
        this.draftDate.getDate(),
        this.draftHour,
        this.draftMinute
      );
      if (adjustedDate) {
        this.draftDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate());
        this.draftHour = adjustedDate.getHours();
        this.draftMinute = adjustedDate.getMinutes();
      }
    }
  }

  protected selectDate(cell: CalendarCell): void {
    this.draftDate = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate());
    this.displayedYear = cell.date.getFullYear();
    this.displayedMonth = cell.date.getMonth();
  }

  protected selectHour(hour: number): void {
    this.draftHour = hour;
  }

  protected selectMinute(minute: number): void {
    this.draftMinute = minute;
  }

  protected useToday(): void {
    const now = new Date();
    this.draftDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.displayedYear = now.getFullYear();
    this.displayedMonth = now.getMonth();

    if (this.mode === 'datetime') {
      this.draftHour = now.getHours();
      this.draftMinute = now.getMinutes();
    }
  }

  protected cancelSelection(): void {
    this.value = this.valueBeforeOpen;
    this.textValue = this.textBeforeOpen;
    this.localFormatError = false;
    this.applyTextValueToInput();
    this.panelOpen = false;
    this.markTouched();
  }

  protected confirmSelection(): void {
    if (!this.draftDate) {
      this.useToday();
    }

    if (!this.draftDate) {
      return;
    }

    const nextValue = this.mode === 'datetime'
      ? `${this.toDateValue(this.draftDate)}T${this.pad(this.draftHour)}:${this.pad(this.draftMinute)}`
      : this.toDateValue(this.draftDate);

    this.commitValue(nextValue);
    this.panelOpen = false;
  }

  protected onManualInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.formatManualInput(input.value);
    this.textValue = formatted;
    this.localFormatError = false;
    this.applyTextValueToInput();

    if (!formatted.trim()) {
      this.commitValue('', true);
      return;
    }

    const parsedValue = this.parseManualInput(formatted);
    if (!parsedValue) {
      return;
    }

    this.syncDraftFromDate(parsedValue.date);
    this.commitValue(parsedValue.isoValue, true, parsedValue.displayValue);
  }

  protected onBlur(event: FocusEvent): void {
    this.markTouched();

    const nextTarget = event.relatedTarget;
    if (nextTarget && this.elementRef.nativeElement.contains(nextTarget as Node)) {
      return;
    }

    this.validateCurrentText();
  }

  protected formatNumber(value: number): string {
    return this.pad(value);
  }

  protected isSelectedHour(hour: number): boolean {
    return hour === this.draftHour;
  }

  protected isSelectedMinute(minute: number): boolean {
    return minute === this.draftMinute;
  }

  ngAfterViewInit(): void {
    this.applyTextValueToInput();
  }

  writeValue(value: unknown): void {
    this.value = value == null ? '' : String(value);
    this.textValue = this.displayFromIsoValue(this.value);
    this.syncDraftFromIsoValue(this.value);
    this.localFormatError = false;
    this.applyTextValueToInput();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled = isDisabled;
    if (isDisabled) {
      this.closePanelPreservingInput();
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: Event): void {
    if (!this.panelOpen) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closePanelPreservingInput();
    }
  }

  @HostListener('keydown.escape')
  protected handleEscape(): void {
    if (this.panelOpen) {
      this.closePanelPreservingInput();
    }
  }

  private initializeDraft(value: string): void {
    const parsedValue = this.parseIsoValue(value);
    const fallback = new Date();
    const draft = parsedValue ?? fallback;

    this.syncDraftFromDate(draft);
  }

  private syncDraftFromIsoValue(value: string): void {
    const parsedValue = this.parseIsoValue(value);
    if (!parsedValue) {
      return;
    }

    this.syncDraftFromDate(parsedValue);
  }

  private syncDraftFromDate(date: Date): void {
    this.draftDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.displayedYear = date.getFullYear();
    this.displayedMonth = date.getMonth();
    this.draftHour = this.mode === 'datetime' ? date.getHours() : 0;
    this.draftMinute = this.mode === 'datetime' ? date.getMinutes() : 0;
  }

  private parseIsoValue(value: string): Date | null {
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }

    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return this.createValidDate(Number(year), Number(month), Number(day), 0, 0);
    }

    const dateTimeMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(normalized);
    if (dateTimeMatch) {
      const [, year, month, day, hour, minute] = dateTimeMatch;
      return this.createValidDate(
        Number(year),
        Number(month),
        Number(day),
        Number(hour),
        Number(minute)
      );
    }

    const parsedDate = new Date(normalized);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private parseManualInput(value: string): ParsedManualValue | null {
    const digits = this.manualDigits(value);
    const expectedDigits = this.mode === 'datetime' ? 12 : 8;
    if (digits.length !== expectedDigits) {
      return null;
    }

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    const hour = this.mode === 'datetime' ? Number(digits.slice(8, 10)) : 0;
    const minute = this.mode === 'datetime' ? Number(digits.slice(10, 12)) : 0;
    const parsedDate = this.createValidDate(year, month, day, hour, minute);
    if (!parsedDate) {
      return null;
    }

    return {
      date: parsedDate,
      isoValue: this.mode === 'datetime'
        ? `${this.toDateValue(parsedDate)}T${this.pad(parsedDate.getHours())}:${this.pad(parsedDate.getMinutes())}`
        : this.toDateValue(parsedDate),
      displayValue: this.mode === 'datetime'
        ? `${this.formatDateParts(day, month, year)} ${this.pad(hour)}:${this.pad(minute)}`
        : this.formatDateParts(day, month, year)
    };
  }

  private formatManualInput(value: string): string {
    const digits = this.manualDigits(value);
    if (this.mode === 'datetime') {
      return this.formatDateTimeDigits(digits);
    }

    return this.formatDateDigits(digits);
  }

  private formatDateDigits(digits: string): string {
    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  private formatDateTimeDigits(digits: string): string {
    const dateDigits = digits.slice(0, 8);
    const timeDigits = digits.slice(8, 12);
    const formattedDate = this.formatDateDigits(dateDigits);
    if (!timeDigits) {
      return formattedDate;
    }

    if (timeDigits.length <= 2) {
      return `${formattedDate} ${timeDigits}`;
    }

    return `${formattedDate} ${timeDigits.slice(0, 2)}:${timeDigits.slice(2, 4)}`;
  }

  private validateCurrentText(): void {
    const normalized = this.textValue.trim();
    if (!normalized) {
      this.localFormatError = false;
      this.applyTextValueToInput();
      return;
    }

    const parsedValue = this.parseManualInput(normalized);
    if (parsedValue) {
      this.localFormatError = false;
      this.textValue = parsedValue.displayValue;
      this.commitValue(parsedValue.isoValue, true, parsedValue.displayValue);
      return;
    }

    this.localFormatError = true;
    this.applyTextValueToInput();
  }

  private closePanelPreservingInput(): void {
    this.panelOpen = false;
    this.validateCurrentText();
  }

  private commitValue(nextValue: string, skipTouched = false, displayOverride?: string): void {
    this.value = nextValue;
    this.textValue = displayOverride ?? this.displayFromIsoValue(nextValue);
    this.localFormatError = false;
    this.applyTextValueToInput();
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
    if (!skipTouched) {
      this.markTouched();
    }
  }

  private displayFromIsoValue(value: string): string {
    const parsedValue = this.parseIsoValue(value);
    if (!parsedValue) {
      return '';
    }

    const datePart = this.formatDateParts(
      parsedValue.getDate(),
      parsedValue.getMonth() + 1,
      parsedValue.getFullYear()
    );
    if (this.mode === 'date') {
      return datePart;
    }

    return `${datePart} ${this.pad(parsedValue.getHours())}:${this.pad(parsedValue.getMinutes())}`;
  }

  private createValidDate(year: number, month: number, day: number, hour: number, minute: number): Date | null {
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    const candidate = new Date(year, month - 1, day, hour, minute);
    if (Number.isNaN(candidate.getTime())) {
      return null;
    }

    if (
      candidate.getFullYear() !== year
      || candidate.getMonth() !== month - 1
      || candidate.getDate() !== day
      || candidate.getHours() !== hour
      || candidate.getMinutes() !== minute
    ) {
      return null;
    }

    return candidate;
  }

  private invalidFormatKey(): I18nKey {
    return this.mode === 'datetime'
      ? 'dateTimeField.validation.invalidDateTime'
      : 'dateTimeField.validation.invalidDate';
  }

  private manualDigits(value: string): string {
    const maxDigits = this.mode === 'datetime' ? 12 : 8;
    return value.replace(/\D/g, '').slice(0, maxDigits);
  }

  private formatDateParts(day: number, month: number, year: number): string {
    return `${this.pad(day)}/${this.pad(month)}/${year}`;
  }

  private applyTextValueToInput(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = this.textValue;
    }
  }

  private markTouched(): void {
    if (this.touched) {
      return;
    }

    this.touched = true;
    this.onTouched();
  }

  private sameDate(left: Date, right: Date): boolean {
    return left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate();
  }

  private toDateValue(date: Date): string {
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
