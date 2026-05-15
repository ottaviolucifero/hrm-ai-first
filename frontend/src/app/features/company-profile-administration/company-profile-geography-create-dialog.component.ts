import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppInputComponent } from '../../shared/components/input/app-input.component';

export type CompanyProfileGeographyCreateMode = 'region' | 'area' | 'zip';

export interface CompanyProfileGeographyCreateDialogConfig {
  readonly mode: CompanyProfileGeographyCreateMode;
  readonly countryName: string;
  readonly regionName?: string | null;
  readonly areaName?: string | null;
  readonly areaLabel: string;
}

export type CompanyProfileGeographyCreateSubmitEvent =
  | { readonly mode: 'region'; readonly name: string }
  | { readonly mode: 'area'; readonly name: string }
  | { readonly mode: 'zip'; readonly city: string; readonly postalCode: string };

@Component({
  selector: 'app-company-profile-geography-create-dialog',
  imports: [AppButtonComponent, AppInputComponent, ReactiveFormsModule],
  templateUrl: './company-profile-geography-create-dialog.component.html',
  styleUrl: './company-profile-geography-create-dialog.component.scss'
})
export class CompanyProfileGeographyCreateDialogComponent implements OnChanges, OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) config!: CompanyProfileGeographyCreateDialogConfig;
  @Input() submitting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<CompanyProfileGeographyCreateSubmitEvent>();

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]]
  });
  protected submitted = false;

  ngOnInit(): void {
    this.applyModeValidators();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.submitted = false;
      this.form.reset({
        name: '',
        city: '',
        postalCode: ''
      });
      this.applyModeValidators();
    }
  }

  protected titleKey(): I18nKey {
    switch (this.config.mode) {
      case 'area':
        return 'companyProfileAdministration.geography.areaDialog.title';
      case 'zip':
        return 'companyProfileAdministration.geography.zipDialog.title';
      case 'region':
      default:
        return 'companyProfileAdministration.geography.regionDialog.title';
    }
  }

  protected submitLabelKey(): I18nKey {
    switch (this.config.mode) {
      case 'area':
        return 'companyProfileAdministration.geography.actions.createArea';
      case 'zip':
        return 'companyProfileAdministration.geography.actions.createZip';
      case 'region':
      default:
        return 'companyProfileAdministration.geography.actions.createRegion';
    }
  }

  protected submitLoadingLabelKey(): I18nKey {
    switch (this.config.mode) {
      case 'area':
        return 'companyProfileAdministration.geography.actions.creatingArea';
      case 'zip':
        return 'companyProfileAdministration.geography.actions.creatingZip';
      case 'region':
      default:
        return 'companyProfileAdministration.geography.actions.creatingRegion';
    }
  }

  protected showsNameField(): boolean {
    return this.config.mode === 'region' || this.config.mode === 'area';
  }

  protected showsZipFields(): boolean {
    return this.config.mode === 'zip';
  }

  protected areaContextLabel(): string {
    return this.config.areaLabel;
  }

  protected errorText(controlName: 'name' | 'city' | 'postalCode'): string {
    if (!this.submitted) {
      return '';
    }

    const control = this.form.controls[controlName];
    if (!control.hasError('required')) {
      return '';
    }

    switch (controlName) {
      case 'city':
        return this.i18n.t('companyProfileAdministration.geography.validation.cityRequired');
      case 'postalCode':
        return this.i18n.t('companyProfileAdministration.geography.validation.postalCodeRequired');
      case 'name':
      default:
        return this.i18n.t('companyProfileAdministration.geography.validation.nameRequired');
    }
  }

  protected cancelDialog(): void {
    this.cancel.emit();
  }

  protected submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    if (this.config.mode === 'zip') {
      this.submitRequested.emit({
        mode: 'zip',
        city: value.city.trim(),
        postalCode: value.postalCode.trim()
      });
      return;
    }

    this.submitRequested.emit({
      mode: this.config.mode,
      name: value.name.trim()
    });
  }

  private applyModeValidators(): void {
    const nameControl = this.form.controls.name;
    const postalCodeControl = this.form.controls.postalCode;
    const cityControl = this.form.controls.city;

    if (this.config.mode === 'zip') {
      this.enableControl(postalCodeControl, [Validators.required, Validators.maxLength(20)]);
      this.enableControl(cityControl, [Validators.required, Validators.maxLength(120)]);
      this.disableControl(nameControl);
      return;
    }

    this.enableControl(nameControl, [Validators.required, Validators.maxLength(100)]);
    this.disableControl(postalCodeControl);
    this.disableControl(cityControl);
  }

  private enableControl(control: AbstractControl<string>): void;
  private enableControl(control: AbstractControl<string>, validators: Parameters<AbstractControl['setValidators']>[0]): void;
  private enableControl(
    control: AbstractControl<string>,
    validators: Parameters<AbstractControl['setValidators']>[0] = null
  ): void {
    control.enable({ emitEvent: false });
    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private disableControl(control: AbstractControl<string>): void {
    control.setValue('', { emitEvent: false });
    control.clearValidators();
    control.disable({ emitEvent: false });
    control.updateValueAndValidity({ emitEvent: false });
  }
}
