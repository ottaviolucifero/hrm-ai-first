import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { PhoneFieldComponent } from '../../shared/form-fields/phone-field.component';
import { LookupOption } from '../../shared/lookup/lookup.models';
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
      regionId: { setValue: (value: string) => void };
      areaId: { setValue: (value: string) => void };
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
  selectGlobalZipCodeOption: (option: LookupOption | null) => void;
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

    component.selectGlobalZipCodeOption({
      id: 'zip-1',
      code: '00100',
      name: 'Roma',
      metadata: {
        countryId: 'country-1',
        regionId: 'region-1',
        areaId: 'area-1',
        provinceName: 'Rome',
        provinceCode: 'RM'
      }
    });
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

    component.selectGlobalZipCodeOption({
      id: 'zip-2',
      code: '00018',
      name: 'Palombara Sabina',
      metadata: {
        countryId: 'country-1',
        regionId: 'region-1',
        provinceName: 'Roma',
        provinceCode: 'RM'
      }
    });
    fixture.detectChanges();

    expect(component.form.controls.cityLabel.value).toBe('Palombara Sabina');
    expect(component.form.controls.provinceLabel.value).toBe('Roma (RM)');
  });

  it('loads zip code lookup with tenant and address filters', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle & {
      zipCodeLookup: (query: { page: number; size: number; search?: string }) => unknown;
    };
    const lookupService = TestBed.inject(LookupService);

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    component.form.controls.regionId.setValue('region-1');
    component.form.controls.areaId.setValue('area-1');
    (component as any).selectedRegionIdSignal.set('region-1');
    (component as any).selectedAreaIdSignal.set('area-1');
    (component.zipCodeLookup({ page: 0, size: 25, search: '00100' }) as any).subscribe();

    expect(lookupService.findZipCodeLookups).toHaveBeenCalledWith(
      { page: 0, size: 25, search: '00100' },
      'tenant-1',
      { countryId: 'country-1', regionId: 'region-1', areaId: 'area-1' }
    );
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
    component.form.controls.regionId.setValue('region-fr-1');
    component.form.controls.areaId.setValue('area-fr-1');
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

  it('keeps Italy flow without create buttons and enables guided create flow for foreign countries with master-data permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.MASTER_DATA.CREATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    component.selectCountry({ target: { value: 'country-1' } } as unknown as Event);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('lookup importato');
    expect(fixture.nativeElement.querySelectorAll('.lookup-select-create-button')).toHaveLength(0);

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    fixture.detectChanges();

    const createButtons = fixture.nativeElement.querySelectorAll('.lookup-select-create-button');
    expect(createButtons).toHaveLength(3);
    expect((createButtons[0] as HTMLButtonElement).disabled).toBe(false);
    expect((createButtons[1] as HTMLButtonElement).disabled).toBe(true);
    expect((createButtons[2] as HTMLButtonElement).disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('paesi esteri');
  });

  it('hides guided create buttons for foreign countries without master-data create or manage permissions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as CompanyProfileFormHandle;

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.lookup-select-create-button')).toHaveLength(0);
  });

  it('creates and auto-selects a foreign region from the guided dialog flow', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const createRegion = vi.fn(() => of({
      id: 'region-fr-2',
      tenantId: 'tenant-1',
      country: { id: 'country-2', code: 'FR', name: 'France' },
      code: 'RE001',
      name: 'Nouvelle-Aquitaine',
      active: true
    }));
    const fixture = await createFixture(createService({ createRegion }), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.MASTER_DATA.CREATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    fixture.detectChanges();

    component.openRegionCreateDialog();
    fixture.detectChanges();
    expect(component.geographyDialog()?.mode).toBe('region');

    component.submitGeographyCreateDialog({ mode: 'region', name: 'Nouvelle-Aquitaine' });
    fixture.detectChanges();

    expect(createRegion).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      countryId: 'country-2',
      name: 'Nouvelle-Aquitaine',
      active: true
    });
    expect(component.form.controls.regionId.value).toBe('region-fr-2');
    expect(component.form.controls.areaId.value).toBe('');
    expect(component.form.controls.globalZipCodeId.value).toBe('');
    expect(component.geographyDialog()).toBeNull();
  });

  it('creates and auto-selects a foreign area from the guided dialog flow', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const createArea = vi.fn(() => of({
      id: 'area-fr-2',
      tenantId: 'tenant-1',
      country: { id: 'country-2', code: 'FR', name: 'France' },
      region: { id: 'region-fr-1', code: 'RE001', name: 'Ile-de-France' },
      code: 'AR001',
      name: 'Paris',
      active: true
    }));
    const fixture = await createFixture(createService({ createArea }), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.MASTER_DATA.CREATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    component.selectRegionOption({ id: 'region-fr-1', code: 'IDF', name: 'Ile-de-France' });
    fixture.detectChanges();

    component.openAreaCreateDialog();
    fixture.detectChanges();
    expect(component.geographyDialog()?.mode).toBe('area');

    component.submitGeographyCreateDialog({ mode: 'area', name: 'Paris' });
    fixture.detectChanges();

    expect(createArea).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      countryId: 'country-2',
      regionId: 'region-fr-1',
      name: 'Paris',
      active: true
    });
    expect(component.form.controls.areaId.value).toBe('area-fr-2');
    expect(component.form.controls.globalZipCodeId.value).toBe('');
    expect(component.geographyDialog()).toBeNull();
  });

  it('resets dependent foreign geography fields when the parent selection changes', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.MASTER_DATA.CREATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    component.selectRegionOption({ id: 'region-fr-1', code: 'RE001', name: 'Ile-de-France' });
    component.selectAreaOption({ id: 'area-fr-1', code: 'AR001', name: 'Paris' });
    component.selectGlobalZipCodeOption({
      id: 'zip-fr-1',
      code: '75001',
      name: 'Paris',
      metadata: {
        countryId: 'country-2',
        regionId: 'region-fr-1',
        areaId: 'area-fr-1',
        areaName: 'Paris',
        areaCode: 'AR001'
      }
    });
    fixture.detectChanges();

    component.selectRegionOption({ id: 'region-fr-2', code: 'RE002', name: 'Nouvelle-Aquitaine' });
    fixture.detectChanges();

    expect(component.form.controls.regionId.value).toBe('region-fr-2');
    expect(component.form.controls.areaId.value).toBe('');
    expect(component.form.controls.globalZipCodeId.value).toBe('');
    expect(component.form.controls.cityLabel.value).toBe('');
    expect(component.form.controls.provinceLabel.value).toBe('');
  });

  it('creates and auto-selects a foreign zip code from the guided dialog flow', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const createGlobalZipCode = vi.fn(() => of({
      id: 'zip-fr-2',
      tenantId: 'tenant-1',
      country: { id: 'country-2', code: 'FR', name: 'France' },
      region: { id: 'region-fr-1', code: 'IDF', name: 'Ile-de-France' },
      area: { id: 'area-fr-1', code: 'PAR', name: 'Paris' },
      city: 'Paris',
      postalCode: '75002',
      provinceCode: null,
      provinceName: null,
      sourceType: 'MANUAL' as const,
      active: true
    }));
    const fixture = await createFixture(createService({ createGlobalZipCode }), {
      userType: 'TENANT_ADMIN',
      tenantId: 'tenant-1',
      permissions: [
        'TENANT.COMPANY_PROFILE.READ',
        'TENANT.COMPANY_PROFILE.CREATE',
        'TENANT.COMPANY_PROFILE.UPDATE',
        'TENANT.MASTER_DATA.CREATE'
      ]
    });
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.selectCountry({ target: { value: 'country-2' } } as unknown as Event);
    component.selectRegionOption({ id: 'region-fr-1', code: 'IDF', name: 'Ile-de-France' });
    component.selectAreaOption({ id: 'area-fr-1', code: 'PAR', name: 'Paris' });
    fixture.detectChanges();

    component.openZipCreateDialog();
    fixture.detectChanges();
    expect(component.geographyDialog()?.mode).toBe('zip');

    component.submitGeographyCreateDialog({ mode: 'zip', city: 'Paris', postalCode: '75002' });
    fixture.detectChanges();

    expect(createGlobalZipCode).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      countryId: 'country-2',
      regionId: 'region-fr-1',
      areaId: 'area-fr-1',
      city: 'Paris',
      postalCode: '75002',
      sourceType: 'MANUAL',
      active: true
    });
    expect(component.form.controls.globalZipCodeId.value).toBe('zip-fr-2');
    expect(component.form.controls.cityLabel.value).toBe('Paris');
    expect(component.form.controls.provinceLabel.value).toBe('Paris (PAR)');
    expect(component.geographyDialog()).toBeNull();
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
          })),
          findZipCodeLookups: vi.fn(() => of({
            content: [
              {
                id: 'zip-1',
                code: '00100',
                name: 'Roma',
                extraLabel: 'Rome (RM)',
                metadata: {
                  countryId: 'country-1',
                  regionId: 'region-1',
                  areaId: 'area-1',
                  provinceName: 'Rome',
                  provinceCode: 'RM'
                }
              }
            ],
            page: 0,
            size: 25,
            totalElements: 1,
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
      regions: [
        { id: 'region-1', tenantId: 'tenant-1', countryId: 'country-1', code: 'RG001', name: 'Lazio' },
        { id: 'region-fr-1', tenantId: 'tenant-1', countryId: 'country-2', code: 'IDF', name: 'Ile-de-France' }
      ],
      areas: [
        { id: 'area-1', tenantId: 'tenant-1', countryId: 'country-1', regionId: 'region-1', code: 'RM', name: 'Rome' },
        { id: 'area-fr-1', tenantId: 'tenant-1', countryId: 'country-2', regionId: 'region-fr-1', code: 'PAR', name: 'Paris' }
      ],
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
        {
          id: 'zip-fr-1',
          tenantId: 'tenant-1',
          countryId: 'country-2',
          regionId: 'region-fr-1',
          areaId: 'area-fr-1',
          areaCode: 'PAR',
          areaName: 'Paris',
          code: '75001',
          name: 'Paris'
        }
      ]
    })),
    findCompanyProfileById: vi.fn(() => of(detail)),
    createCompanyProfile: vi.fn(() => of({ ...detail, id: 'company-created' })),
    createRegion: vi.fn(),
    createArea: vi.fn(),
    createGlobalZipCode: vi.fn(),
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
