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

  it('keeps fields readonly in view mode', () => {
    component.mode = 'view';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'name', labelKey: 'masterData.columns.name', required: true }];
    component.value = { name: 'Human Resources' };

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
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
});
