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

  it('keeps fields readonly in view mode', () => {
    component.mode = 'view';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'name', labelKey: 'masterData.columns.name', required: true }];
    component.value = { name: 'Human Resources' };

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('renders only a close action in the footer for view mode', () => {
    component.mode = 'view';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'name', labelKey: 'masterData.columns.name', required: true }];
    component.value = { name: 'Human Resources' };

    fixture.detectChanges();

    const footerButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.kt-modal-footer-actions button')
    ) as HTMLButtonElement[];

    expect(footerButtons).toHaveLength(1);
    expect(footerButtons[0].textContent).toContain('Chiudi');
  });

  it('renders an icon-only dismiss action in the header', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [{ key: 'code', labelKey: 'masterData.columns.code', required: true }];

    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.master-data-modal-close') as HTMLButtonElement;

    expect(closeButton).not.toBeNull();
    expect(closeButton.getAttribute('aria-label')).toBe('Chiudi');
    expect(closeButton.className).toContain('kt-btn-icon');
  });

  it('renders cancel before save in the footer for editable modes', () => {
    component.mode = 'create';
    component.resourceTitleKey = 'masterData.entities.departments';
    component.fields = [
      { key: 'code', labelKey: 'masterData.columns.code', required: true },
      { key: 'name', labelKey: 'masterData.columns.name', required: true }
    ];

    fixture.detectChanges();

    const footerButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.kt-modal-footer-actions button')
    ) as HTMLButtonElement[];

    expect(footerButtons).toHaveLength(2);
    expect(footerButtons[0].textContent).toContain('Annulla');
    expect(footerButtons[0].className).toContain('kt-btn-outline');
    expect(footerButtons[1].textContent).toContain('Salva');
    expect(footerButtons[1].getAttribute('type')).toBe('submit');
  });
});
