import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { PhoneFieldComponent } from '../../shared/form-fields/phone-field.component';
import { LookupService } from '../../shared/lookup/lookup.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { CompanyProfileAdministrationFormComponent } from './company-profile-administration-form.component';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

@Component({
  template: ''
})
class DummyRouteComponent {}

interface CompanyProfileFormHandle {
  readonly form: {
    controls: {
      tenantId: { disabled: boolean };
      tenantLabel: { value: string };
      companyProfileTypeId: { setValue: (value: string) => void };
      legalName: { setValue: (value: string) => void };
      tradeName: { setValue: (value: string) => void };
      vatNumber: { setValue: (value: string) => void };
      taxIdentifier: { setValue: (value: string) => void };
      taxNumber: { setValue: (value: string) => void };
      email: { setValue: (value: string) => void };
      countryId: { setValue: (value: string) => void };
      globalZipCodeId: { setValue: (value: string) => void };
      cityLabel: { value: string };
      provinceLabel: { value: string };
      phone: { setValue: (value: string) => void; value: string };
      street: { setValue: (value: string) => void };
      streetNumber: { setValue: (value: string) => void };
    };
  };
  submit: () => void;
  selectTenant: (event: Event) => void;
  selectCountry: (event: Event) => void;
}

describe('CompanyProfileAdministrationFormComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders create form with generated code and readonly active state', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nuovo profilo aziendale');
    expect(fixture.nativeElement.textContent).toContain('Generato automaticamente');
    const checkbox = fixture.nativeElement.querySelector('app-checkbox input') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('forces the authenticated tenant for tenant users', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    expect(component.form.controls.tenantId.disabled).toBe(true);
    expect(component.form.controls.tenantLabel.value).toBe('Tenant (TENANT)');
  });

  it('shows tenant select for platform users and filters company profile types', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), { userType: 'PLATFORM_OPERATOR', tenantId: 'tenant-1' });
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    expect(component.form.controls.tenantId.disabled).toBe(false);
    component.selectTenant({ target: { value: 'tenant-2' } } as unknown as Event);
    fixture.detectChanges();

    const contextCard = fixture.nativeElement.querySelector('[aria-labelledby="company-profile-form-tenant-type"]') as HTMLElement;
    expect(contextCard.textContent).toContain('Branch');
    expect(contextCard.textContent).not.toContain('Legal entity');
  });

  it('defaults the phone prefix from country without overriding manual changes', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;
    const phoneField = getPhoneFieldComponent(fixture);

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();
    expect(phoneField.structuredValue.dialCode).toBe('+39');

    (phoneField as any).handleDialCodeChange('+216');
    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    fixture.detectChanges();

    expect(phoneField.structuredValue.dialCode).toBe('+216');
  });

  it('switches fiscal fields by country', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();
    let textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Partita IVA');
    expect(textContent).toContain('Codice fiscale');
    expect(textContent).not.toContain('Identificativo fiscale');

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    fixture.detectChanges();
    textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Identificativo fiscale');
    expect(textContent).not.toContain('Partita IVA');
    expect(textContent).not.toContain('Codice fiscale');
  });

  it('renders countries with Italy and Tunisia first, then alphabetical', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    const countrySelect = fixture.nativeElement.querySelector('select[formcontrolname="countryId"]') as HTMLSelectElement;
    const optionLabels = Array.from(countrySelect.options).map((option) => option.textContent?.trim() ?? '');

    expect(optionLabels[1]).toContain('Italy');
    expect(optionLabels[2]).toContain('Tunisia');
    expect(optionLabels[3]).toContain('France');
    expect(optionLabels[4]).toContain('Germany');
    expect(optionLabels[5]).toContain('Spain');
  });

  it('fills province from zip code option when available', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();

    const zipSelect = fixture.nativeElement.querySelector('select[formcontrolname="globalZipCodeId"]') as HTMLSelectElement;
    zipSelect.value = 'zip-1';
    zipSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(component.form.controls.provinceLabel.value).toBe('Rome (RM)');
  });

  it('fills province from zip code province fields when area is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();

    const zipSelect = fixture.nativeElement.querySelector('select[formcontrolname="globalZipCodeId"]') as HTMLSelectElement;
    zipSelect.value = 'zip-2';
    zipSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(component.form.controls.cityLabel.value).toBe('Palombara Sabina');
    expect(component.form.controls.provinceLabel.value).toBe('Roma (RM)');
  });

  it('submits create payload with backend-compatible phone string and without code or active', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;
    const phoneField = getPhoneFieldComponent(fixture);

    component.form.controls.companyProfileTypeId.setValue('type-1');
    component.form.controls.legalName.setValue('Legal');
    component.form.controls.tradeName.setValue('Trade');
    component.form.controls.vatNumber.setValue('IT-VAT-1');
    component.form.controls.taxIdentifier.setValue('IT-TID-1');
    component.form.controls.taxNumber.setValue('IT-CF-1');
    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();
    component.form.controls.globalZipCodeId.setValue('zip-1');
    component.form.controls.email.setValue('legal@example.com');
    (phoneField as any).handleNationalNumberInput(makeInputEvent('0941123456'));
    component.form.controls.street.setValue('Street');
    component.form.controls.streetNumber.setValue('1');
    component.submit();

    expect(service.createCompanyProfile).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      companyProfileTypeId: 'type-1',
      legalName: 'Legal',
      tradeName: 'Trade',
      vatNumber: 'IT-VAT-1',
      taxIdentifier: null,
      taxNumber: 'IT-CF-1',
      email: 'legal@example.com',
      pecEmail: null,
      phone: '+39 0941123456',
      sdiCode: null,
      countryId: 'country-1',
      regionId: null,
      areaId: null,
      globalZipCodeId: 'zip-1',
      street: 'Street',
      streetNumber: '1'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles', 'company-created']);
  });

  it('submits foreign fiscal payload using only tax identifier', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;
    const phoneField = getPhoneFieldComponent(fixture);

    component.form.controls.companyProfileTypeId.setValue('type-1');
    component.form.controls.legalName.setValue('Legal');
    component.form.controls.tradeName.setValue('Trade');
    component.form.controls.vatNumber.setValue('FR-VAT-1');
    component.form.controls.taxIdentifier.setValue('FR-TID-1');
    component.form.controls.taxNumber.setValue('FR-CF-1');
    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    component.form.controls.globalZipCodeId.setValue('zip-fr-1');
    component.form.controls.email.setValue('foreign@example.com');
    (phoneField as any).handleNationalNumberInput(makeInputEvent('1234567'));
    component.form.controls.street.setValue('Street');
    component.form.controls.streetNumber.setValue('1');
    component.submit();

    expect(service.createCompanyProfile).toHaveBeenCalledWith(expect.objectContaining({
      vatNumber: null,
      taxIdentifier: 'FR-TID-1',
      taxNumber: null,
      countryId: 'country-2'
    }));
  });

  it('renders edit form with readonly code and submits update without tenant or active', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service, undefined, 'company-1');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;
    const phoneField = getPhoneFieldComponent(fixture);

    const codeInput = fixture.nativeElement.querySelector('app-input[formcontrolname="codeLabel"] input') as HTMLInputElement;
    expect(codeInput.value).toBe('CP001');

    component.form.controls.companyProfileTypeId.setValue('type-1');
    component.form.controls.legalName.setValue('Updated Legal');
    component.form.controls.tradeName.setValue('Updated Trade');
    component.form.controls.vatNumber.setValue('IT-VAT-2');
    component.form.controls.email.setValue('updated@example.com');
    component.form.controls.countryId.setValue('country-1');
    component.form.controls.globalZipCodeId.setValue('zip-1');
    (phoneField as any).handleDialCodeChange('+39');
    (phoneField as any).handleNationalNumberInput(makeInputEvent('123456'));
    component.form.controls.street.setValue('Updated Street');
    component.form.controls.streetNumber.setValue('2');
    component.submit();

    expect(service.updateCompanyProfile).toHaveBeenCalledWith('company-1', {
      companyProfileTypeId: 'type-1',
      legalName: 'Updated Legal',
      tradeName: 'Updated Trade',
      vatNumber: 'IT-VAT-2',
      taxIdentifier: null,
      taxNumber: null,
      email: 'updated@example.com',
      pecEmail: null,
      phone: '+39 123456',
      sdiCode: null,
      countryId: 'country-1',
      regionId: null,
      areaId: null,
      globalZipCodeId: 'zip-1',
      street: 'Updated Street',
      streetNumber: '2'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles', 'company-1']);
  });

  it('shows backend errors through notifications', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      createCompanyProfile: vi.fn(() => throwError(() => new HttpErrorResponse({
        status: 409,
        error: { message: 'Company profile code generation collision for tenant. Retry create operation.' }
      })))
    });
    const fixture = await createFixture(service);
    fixture.detectChanges();
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;
    const phoneField = getPhoneFieldComponent(fixture);

    component.form.controls.companyProfileTypeId.setValue('type-1');
    component.form.controls.legalName.setValue('Legal');
    component.form.controls.tradeName.setValue('Trade');
    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    component.form.controls.vatNumber.setValue('IT-VAT-3');
    component.form.controls.globalZipCodeId.setValue('zip-1');
    component.form.controls.email.setValue('notify@example.com');
    (phoneField as any).handleNationalNumberInput(makeInputEvent('111222333'));
    component.form.controls.street.setValue('Street');
    component.form.controls.streetNumber.setValue('1');
    component.submit();

    expect(errorSpy).toHaveBeenCalledWith(
      'Impossibile creare il profilo aziendale.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });
});

async function createFixture(
  service: CompanyProfileAdministrationService,
  authenticatedUser: {
    userType: string;
    tenantId: string;
    permissions?: readonly string[];
  } = {
    userType: 'TENANT_ADMIN',
    tenantId: 'tenant-1',
    permissions: ['TENANT.COMPANY_PROFILE.READ', 'TENANT.COMPANY_PROFILE.CREATE', 'TENANT.COMPANY_PROFILE.UPDATE']
  },
  companyProfileId: string | null = null
) {
  await TestBed.configureTestingModule({
    imports: [CompanyProfileAdministrationFormComponent],
    providers: [
      provideRouter([
        {
          path: 'admin',
          children: [
            { path: 'company-profiles', component: DummyRouteComponent },
            { path: 'company-profiles/:id', component: DummyRouteComponent }
          ]
        }
      ]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? companyProfileId : null
            }
          }
        }
      },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'current-user',
            tenantId: authenticatedUser.tenantId,
            email: 'current@example.com',
            userType: authenticatedUser.userType,
            permissions: authenticatedUser.permissions
          })
        }
      },
      {
        provide: LookupService,
        useValue: {
          findCountryLookups: vi.fn(() => of({
            content: [
              { id: 'country-1', code: 'IT', name: 'Italy', extraLabel: '+39', metadata: { phoneCode: '+39' } },
              { id: 'country-2', code: 'FR', name: 'France', extraLabel: '+33', metadata: { phoneCode: '+33' } },
              { id: 'country-3', code: 'TN', name: 'Tunisia', extraLabel: '+216', metadata: { phoneCode: '+216' } }
            ],
            page: 0,
            size: 25,
            totalElements: 3,
            totalPages: 1,
            first: true,
            last: true
          }))
        }
      },
      {
        provide: CompanyProfileAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(CompanyProfileAdministrationFormComponent);
}

function createService(overrides: Partial<CompanyProfileAdministrationService> = {}): CompanyProfileAdministrationService {
  const detail = {
    id: 'company-1',
    tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfileType: { id: 'type-1', code: 'CP001', name: 'Legal entity' },
    code: 'CP001',
    legalName: 'Legal One',
    tradeName: 'Trade One',
    vatNumber: null,
    taxIdentifier: null,
    taxNumber: null,
    email: null,
    pecEmail: null,
    phone: '+39 111222333',
    sdiCode: null,
    country: { id: 'country-1', code: 'IT', name: 'Italy' },
    region: null,
    area: null,
    globalZipCode: null,
    street: 'Street',
    streetNumber: '1',
    active: true,
    createdAt: '2026-05-13T09:00:00Z',
    updatedAt: '2026-05-13T10:00:00Z'
  };

  return {
    findCompanyProfiles: vi.fn(),
    findFormOptions: vi.fn(() => of({
      tenants: [
        { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        { id: 'tenant-2', code: 'TENANT_2', name: 'Tenant Two' }
      ],
      companyProfileTypes: [
        { id: 'type-1', tenantId: 'tenant-1', code: 'CP001', name: 'Legal entity' },
        { id: 'type-2', tenantId: 'tenant-2', code: 'CP002', name: 'Branch' }
      ],
      countries: [
        { id: 'country-5', code: 'ES', name: 'Spain' },
        { id: 'country-2', code: 'FR', name: 'France' },
        { id: 'country-3', code: 'TN', name: 'Tunisia' },
        { id: 'country-1', code: 'IT', name: 'Italy' },
        { id: 'country-4', code: 'DE', name: 'Germany' }
      ],
      regions: [{ id: 'region-1', tenantId: 'tenant-1', countryId: 'country-1', code: 'RG001', name: 'Lazio' }],
      areas: [{ id: 'area-1', tenantId: 'tenant-1', countryId: 'country-1', regionId: 'region-1', code: 'RM', name: 'Rome' }],
      globalZipCodes: [
        { id: 'zip-1', tenantId: 'tenant-1', countryId: 'country-1', regionId: 'region-1', areaId: 'area-1', code: '00100', name: 'Roma' },
        {
          id: 'zip-2',
          tenantId: null,
          countryId: 'country-1',
          regionId: null,
          areaId: null,
          code: '00018',
          name: 'Palombara Sabina',
          provinceName: 'Roma',
          provinceCode: 'RM'
        },
        { id: 'zip-fr-1', tenantId: null, countryId: 'country-2', regionId: null, areaId: null, code: '75001', name: 'Paris' }
      ]
    })),
    findCompanyProfileById: vi.fn(() => of(detail)),
    createCompanyProfile: vi.fn(() => of({ ...detail, id: 'company-created' })),
    updateCompanyProfile: vi.fn(() => of(detail)),
    activateCompanyProfile: vi.fn(),
    deactivateCompanyProfile: vi.fn(),
    deleteCompanyProfile: vi.fn(),
    ...overrides
  } as CompanyProfileAdministrationService;
}

function getPhoneFieldComponent(fixture: ComponentFixture<CompanyProfileAdministrationFormComponent>): PhoneFieldComponent {
  return fixture.debugElement.query(By.directive(PhoneFieldComponent)).componentInstance as PhoneFieldComponent;
}

function makeInputEvent(value: string): Event {
  return { target: { value } } as unknown as Event;
}
