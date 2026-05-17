import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppDateTimeFieldComponent } from '../../shared/components/date-time-field/app-date-time-field.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  HolidayCalendarAdministrationHolidayCreateRequest,
  HolidayCalendarAdministrationHolidayListItem
} from './holiday-calendar-administration.models';

type HolidayCalendarHolidayFormMode = 'create' | 'edit';

function holidayDateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = String(control.get('startDate')?.value ?? '').trim();
    const endDate = String(control.get('endDate')?.value ?? '').trim();

    if (!startDate || !endDate) {
      return null;
    }

    return endDate < startDate ? { invalidHolidayRange: true } : null;
  };
}

export interface HolidayCalendarHolidayFormDialogConfig {
  readonly mode: HolidayCalendarHolidayFormMode;
  readonly calendarName: string;
  readonly calendarYear: number;
  readonly holiday?: HolidayCalendarAdministrationHolidayListItem | null;
}

@Component({
  selector: 'app-holiday-calendar-holiday-form-dialog',
  imports: [
    AppButtonComponent,
    AppDateTimeFieldComponent,
    AppInputComponent,
    LookupSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './holiday-calendar-holiday-form-dialog.component.html',
  styleUrl: './holiday-calendar-holiday-form-dialog.component.scss'
})
export class HolidayCalendarHolidayFormDialogComponent implements OnChanges {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) config!: HolidayCalendarHolidayFormDialogConfig;
  @Input() submitting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<HolidayCalendarAdministrationHolidayCreateRequest>();

  protected readonly submitted = false;
  protected submittedState = false;
  protected readonly showAdvancedOptions = signal(false);
  protected readonly typeOptions = computed<readonly LookupOption[]>(() => {
    this.i18n.language();
    return [
      { id: 'FIXED', code: 'FIXED', name: this.i18n.t('holidayCalendar.holidays.typeFixed') },
      { id: 'MOBILE', code: 'MOBILE', name: this.i18n.t('holidayCalendar.holidays.typeMobile') }
    ];
  });
  protected readonly generationRuleOptions = computed<readonly LookupOption[]>(() => {
    this.i18n.language();
    return [
      { id: 'FIXED_DATE', code: 'FIXED_DATE', name: this.i18n.t('holidayCalendar.holidays.generationRuleFixedDate') },
      { id: 'MANUAL', code: 'MANUAL', name: this.i18n.t('holidayCalendar.holidays.generationRuleManual') },
      { id: 'EASTER_BASED', code: 'EASTER_BASED', name: this.i18n.t('holidayCalendar.holidays.generationRuleEasterBased') }
    ];
  });
  protected readonly lookupClosedLabelBuilder = (option: LookupOption): string => option.name;
  protected readonly lookupOptionLabelBuilder = (option: LookupOption): string => option.name;

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    type: ['FIXED', [Validators.required]],
    generationRule: ['MANUAL', [Validators.required]],
    description: ['', [Validators.maxLength(1000)]]
  }, {
    validators: holidayDateRangeValidator()
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.submittedState = false;
      const holiday = this.config.holiday;
      const defaultDate = this.defaultDateValue();
      this.showAdvancedOptions.set(this.config.mode === 'edit');
      this.form.reset({
        name: holiday?.name ?? '',
        startDate: holiday?.startDate ?? (this.config.mode === 'create' ? defaultDate : ''),
        endDate: holiday?.endDate ?? (this.config.mode === 'create' ? defaultDate : ''),
        type: holiday?.type ?? 'FIXED',
        generationRule: holiday?.generationRule ?? 'MANUAL',
        description: holiday?.description ?? ''
      });
    }
  }

  protected titleKey(): I18nKey {
    return this.config.mode === 'create'
      ? 'holidayCalendar.holidays.form.createTitle'
      : 'holidayCalendar.holidays.form.editTitle';
  }

  protected submitLabelKey(): I18nKey {
    return this.config.mode === 'create'
      ? 'holidayCalendar.holidays.actions.create'
      : 'holidayCalendar.holidays.actions.save';
  }

  protected submitLoadingLabelKey(): I18nKey {
    return this.config.mode === 'create'
      ? 'holidayCalendar.holidays.actions.creating'
      : 'holidayCalendar.holidays.actions.saving';
  }

  protected cancelDialog(): void {
    if (!this.submitting) {
      this.cancel.emit();
    }
  }

  protected toggleAdvancedOptions(): void {
    this.showAdvancedOptions.update((currentValue) => !currentValue);
  }

  protected submit(): void {
    this.submittedState = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.submitRequested.emit({
      name: value.name.trim(),
      startDate: value.startDate,
      endDate: value.endDate,
      type: value.type as 'FIXED' | 'MOBILE',
      generationRule: value.generationRule as 'FIXED_DATE' | 'MANUAL' | 'EASTER_BASED',
      description: this.optionalValue(value.description)
    });
  }

  protected fieldError(controlName: 'name' | 'startDate' | 'endDate' | 'type' | 'generationRule' | 'description'): string {
    const control = this.form.controls[controlName];
    if (!(this.submittedState || control.touched)) {
      return '';
    }

    if (control.hasError('required')) {
      return this.i18n.t('holidayCalendar.holidays.form.validation.required');
    }

    if (control.hasError('maxlength')) {
      return this.i18n.t('holidayCalendar.holidays.form.validation.maxLength');
    }

    if (controlName === 'endDate' && this.form.hasError('invalidHolidayRange')) {
      return this.i18n.t('holidayCalendar.holidays.form.validation.invalidDateRange');
    }

    return '';
  }

  private optionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private defaultDateValue(): string {
    const fallbackYear = new Date().getFullYear();
    const calendarYear = Number(this.config.calendarYear);
    const resolvedYear = Number.isInteger(calendarYear) && calendarYear >= 1900 && calendarYear <= 9999
      ? calendarYear
      : fallbackYear;

    return `${resolvedYear}-01-01`;
  }
}
