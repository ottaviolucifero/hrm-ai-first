import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
