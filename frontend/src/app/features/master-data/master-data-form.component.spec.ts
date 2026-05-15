import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MasterDataFormComponent } from './master-data-form.component';

describe('MasterDataFormComponent', () => {
  let fixture: ComponentFixture<MasterDataFormComponent>;
  let component: MasterDataFormComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [MasterDataFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterDataFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('validates required fields in create mode', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [
      { key: 'code', labelKey: 'masterData.columns.code', required: true },
      { key: 'name', labelKey: 'masterData.columns.name', required: true }
    ];

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('.kt-btn-primary') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Campo obbligatorio.');
  });

  it('emits save payload in edit mode', () => {
    const saveSpy = vi.fn();
    component.save.subscribe(saveSpy);
    component.mode = 'edit';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [
      { key: 'code', labelKey: 'masterData.columns.code', required: true },
      { key: 'name', labelKey: 'masterData.columns.name', required: true },
      { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean' }
    ];
    component.value = { code: 'HR', name: 'Human Resources', active: true };

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('.kt-btn-primary') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'edit',
        value: expect.objectContaining({ code: 'HR', name: 'Human Resources', active: true })
      })
    );
  });

  it('renders shared checkbox control for boolean field', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'active', labelKey: 'masterData.columns.active', type: 'boolean' }];
    component.value = { active: true };

    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('app-checkbox input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(false);
  });

  it('renders shared input control for text field', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'code', labelKey: 'masterData.columns.code', required: true }];
    component.value = { code: 'HR' };

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.app-input-control') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('.app-input-label') as HTMLElement;

    expect(input).toBeTruthy();
    expect(label.textContent).toContain('Codice');
    expect(label.textContent).toContain('*');
    expect(input.value).toBe('HR');
  });

  it('keeps fields readonly in view mode', () => {
    component.mode = 'view';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'name', labelKey: 'masterData.columns.name', required: true }];
    component.value = { name: 'Human Resources' };

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.app-input-control') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('keeps close action only in the header and operational actions in the footer', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [
      { key: 'code', labelKey: 'masterData.columns.code', required: true },
      { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean' }
    ];

    fixture.detectChanges();

    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const closeButtons = buttons.filter((button) => button.getAttribute('aria-label') === 'Chiudi');
    const footer = fixture.nativeElement.querySelector('.master-data-form-actions') as HTMLElement;

    expect(closeButtons).toHaveLength(1);
    expect(footer?.textContent).toContain('Annulla');
    expect(footer?.textContent).toContain('Salva');
    expect(footer?.textContent).not.toContain('Chiudi');
  });

  it('omits auto-code field in create mode', () => {
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [
      { key: 'code', labelKey: 'masterData.columns.code', readOnly: true, modes: ['edit', 'view'] },
      { key: 'name', labelKey: 'masterData.columns.name', required: true }
    ];
    component.mode = 'create';
    component.value = { code: 'DE001', name: 'Human Resources' };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.app-input-control')).toHaveLength(1);
  });

  it('renders lookup fields for Region and Area forms', () => {
    component.resourceTitleKey = 'masterData.entities.areas';
    component.fields = [
      {
        key: 'countryId',
        labelKey: 'masterData.columns.country',
        type: 'lookup',
        required: true,
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      },
      {
        key: 'regionId',
        labelKey: 'masterData.columns.region',
        type: 'lookup',
        required: true,
        dependsOn: ['countryId'],
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      }
    ];
    component.mode = 'create';

    fixture.detectChanges();

    const lookupInputs = fixture.nativeElement.querySelectorAll('app-lookup-select input') as NodeListOf<HTMLInputElement>;
    expect(lookupInputs).toHaveLength(2);
  });

  it('disables dependent Area region lookup until country is selected and clears stale values', () => {
    component.resourceTitleKey = 'masterData.entities.areas';
    component.fields = [
      {
        key: 'countryId',
        labelKey: 'masterData.columns.country',
        type: 'lookup',
        required: true,
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      },
      {
        key: 'regionId',
        labelKey: 'masterData.columns.region',
        type: 'lookup',
        required: true,
        dependsOn: ['countryId'],
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      }
    ];
    component.mode = 'create';

    fixture.detectChanges();
    const componentWithForm = component as MasterDataFormComponent & {
      form: MasterDataFormComponent['form'];
    };

    expect(componentWithForm.form.controls['regionId'].disabled).toBe(true);

    componentWithForm.form.controls['countryId'].setValue('country-1');
    fixture.detectChanges();

    expect(componentWithForm.form.controls['regionId'].enabled).toBe(true);

    componentWithForm.form.controls['regionId'].setValue('region-1');
    componentWithForm.form.controls['countryId'].setValue('country-2');
    fixture.detectChanges();

    expect(componentWithForm.form.controls['regionId'].value).toBe('');
  });

  it('hydrates Region country lookup from the nested reference when the id field is absent', () => {
    component.resourceTitleKey = 'masterData.entities.regions';
    component.fields = [
      {
        key: 'countryId',
        labelKey: 'masterData.columns.country',
        type: 'lookup',
        required: true,
        initialOptionResolver: (row) => {
          const country = row?.['country'] as { id: string; code: string; name: string } | undefined;
          return country ? { id: country.id, code: country.code, name: country.name } : null;
        },
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      },
      { key: 'code', labelKey: 'masterData.columns.code' },
      { key: 'name', labelKey: 'masterData.columns.name' }
    ];
    component.mode = 'edit';
    component.value = {
      code: 'RE001',
      name: 'Lazio',
      country: { id: 'country-1', code: 'IT', name: 'Italy' }
    };

    fixture.detectChanges();
    const componentWithForm = component as MasterDataFormComponent & {
      form: MasterDataFormComponent['form'];
    };

    expect(componentWithForm.form.controls['countryId'].value).toBe('country-1');
    const lookupInput = fixture.nativeElement.querySelector('app-lookup-select input') as HTMLInputElement;
    expect(lookupInput.value).toContain('IT - Italy');
  });

  it('hydrates Area country and region lookups from nested references without resetting region on initial load', () => {
    component.resourceTitleKey = 'masterData.entities.areas';
    component.fields = [
      {
        key: 'countryId',
        labelKey: 'masterData.columns.country',
        type: 'lookup',
        required: true,
        initialOptionResolver: (row) => {
          const country = row?.['country'] as { id: string; code: string; name: string } | undefined;
          return country ? { id: country.id, code: country.code, name: country.name } : null;
        },
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      },
      {
        key: 'regionId',
        labelKey: 'masterData.columns.region',
        type: 'lookup',
        required: true,
        dependsOn: ['countryId'],
        initialOptionResolver: (row) => {
          const region = row?.['region'] as { id: string; code: string; name: string } | undefined;
          return region ? { id: region.id, code: region.code, name: region.name } : null;
        },
        lookupLoadPage: () => of({ content: [], page: 0, size: 25, totalElements: 0, totalPages: 0, first: true, last: true })
      }
    ];
    component.mode = 'edit';
    component.value = {
      country: { id: 'country-1', code: 'IT', name: 'Italy' },
      region: { id: 'region-1', code: 'RE001', name: 'Lazio' }
    };

    fixture.detectChanges();
    const componentWithForm = component as MasterDataFormComponent & {
      form: MasterDataFormComponent['form'];
    };

    expect(componentWithForm.form.controls['countryId'].value).toBe('country-1');
    expect(componentWithForm.form.controls['regionId'].value).toBe('region-1');
    expect(componentWithForm.form.controls['regionId'].enabled).toBe(true);

    const lookupInputs = fixture.nativeElement.querySelectorAll('app-lookup-select input') as NodeListOf<HTMLInputElement>;
    expect(lookupInputs[0].value).toContain('IT - Italy');
    expect(lookupInputs[1].value).toContain('RE001 - Lazio');
  });
});
