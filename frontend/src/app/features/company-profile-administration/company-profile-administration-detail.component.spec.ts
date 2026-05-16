import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { CompanyProfileAdministrationDetailComponent } from './company-profile-administration-detail.component';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

interface CompanyProfileDetailHandle {
  goBack: () => void;
  editCompanyProfile: () => void;
  triggerActiveAction: () => void;
}

describe('CompanyProfileAdministrationDetailComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders detail cards, address ordering, and edit action', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-detail-action-bar')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Trade One');
    expect(fixture.nativeElement.textContent).toContain('Dati principali');
    expect(fixture.nativeElement.textContent).toContain('Tenant e tipo');
    expect(fixture.nativeElement.textContent).toContain('Dati fiscali');
    expect(fixture.nativeElement.textContent).toContain('Contatti');
    expect(fixture.nativeElement.textContent).toContain('Indirizzo');
    expect(fixture.nativeElement.textContent).toContain('Audit');
    expect(fixture.nativeElement.textContent).toContain('Provincia');
    expect(fixture.nativeElement.textContent).toContain('Codice fiscale');
    expect(fixture.nativeElement.textContent).not.toContain('Identificativo fiscale');
    expect(fixture.nativeElement.textContent).toContain('Modifica');
    expect(fixture.nativeElement.querySelector('.company-profile-detail-confirm')).toBeNull();
  });

  it('shows only tax identifier fiscal field for non-italian profiles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfileById: vi.fn(() => of({
        id: 'company-2',
        tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        companyProfileType: { id: 'type-2', code: 'CP002', name: 'Branch' },
        code: 'CP002',
        legalName: 'Legal Two',
        tradeName: 'Trade Two',
        vatNumber: 'VAT-2',
        taxIdentifier: 'TID-2',
        taxNumber: 'TAX-2',
        email: 'info@example.com',
        pecEmail: 'pec@example.com',
        phoneDialCode: '+33',
        phoneNationalNumber: '123456',
        phone: '+33 123456',
        sdiCode: 'SDI123',
        country: { id: 'country-2', code: 'FR', name: 'France' },
        region: null,
        area: { id: 'area-1', code: 'AR001', name: 'Paris' },
        globalZipCode: { id: 'zip-1', code: '75001', name: 'Paris' },
        street: 'Street',
        streetNumber: '10',
        active: true,
        createdAt: '2026-05-13T09:00:00Z',
        updatedAt: '2026-05-13T10:00:00Z'
      }))
    }));
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Identificativo fiscale');
    expect(textContent).toContain('TID-2');
    expect(textContent).not.toContain('Partita IVA');
    expect(textContent).not.toContain('Codice fiscale');
  });

  it('shows province fallback from zip code when area is missing', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfileById: vi.fn(() => of({
        id: 'company-3',
        tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        companyProfileType: { id: 'type-1', code: 'CP001', name: 'Legal entity' },
        code: 'CP003',
        legalName: 'Legal Three',
        tradeName: 'Trade Three',
        vatNumber: 'VAT-3',
        taxIdentifier: null,
        taxNumber: 'TAX-3',
        email: 'info3@example.com',
        pecEmail: null,
        phoneDialCode: '+39',
        phoneNationalNumber: '123456',
        phone: '+39 123456',
        sdiCode: null,
        country: { id: 'country-1', code: 'IT', name: 'Italy' },
        region: null,
        area: null,
        globalZipCode: { id: 'zip-area-null', code: '00018', name: 'Palombara Sabina' },
        street: 'Street',
        streetNumber: '10',
        active: true,
        createdAt: '2026-05-13T09:00:00Z',
        updatedAt: '2026-05-13T10:00:00Z'
      })),
      findFormOptions: vi.fn(() => of({
        tenants: [{ id: 'tenant-1', code: 'TENANT', name: 'Tenant' }],
        companyProfileTypes: [{ id: 'type-1', tenantId: 'tenant-1', code: 'CP001', name: 'Legal entity' }],
        countries: [{ id: 'country-1', code: 'IT', name: 'Italy' }],
        regions: [],
        areas: [],
        globalZipCodes: [{
          id: 'zip-area-null',
          tenantId: null,
          countryId: 'country-1',
          regionId: null,
          areaId: null,
          code: '00018',
          name: 'Palombara Sabina',
          provinceName: 'Roma',
          provinceCode: 'RM'
        }]
      }))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Roma (RM)');
  });

  it('shows a composed structured phone when the legacy bridge field is absent', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfileById: vi.fn(() => of({
        id: 'company-4',
        tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
        companyProfileType: { id: 'type-1', code: 'CP001', name: 'Legal entity' },
        code: 'CP004',
        legalName: 'Legal Four',
        tradeName: 'Trade Four',
        vatNumber: 'VAT-4',
        taxIdentifier: null,
        taxNumber: 'TAX-4',
        email: 'info4@example.com',
        pecEmail: null,
        phoneDialCode: '+216',
        phoneNationalNumber: '20123456',
        phone: null,
        sdiCode: null,
        country: { id: 'country-3', code: 'TN', name: 'Tunisia' },
        region: null,
        area: null,
        globalZipCode: null,
        street: 'Street',
        streetNumber: '11',
        active: true,
        createdAt: '2026-05-13T09:00:00Z',
        updatedAt: '2026-05-13T10:00:00Z'
      }))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('+216 20123456');
  });

  it('navigates back and edit', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as CompanyProfileDetailHandle;
    component.goBack();
    component.editCompanyProfile();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles']);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles', 'company-1', 'edit']);
  });

  it('opens confirm dialog and deactivates the company profile from the detail action bar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Disattiva'
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Conferma disattivazione profilo aziendale');

    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Disattiva');
    fixture.detectChanges();

    expect(service.deactivateCompanyProfile).toHaveBeenCalledWith('company-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Profilo aziendale disattivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('cancels deactivate without invoking the handler', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Disattiva'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Annulla');
    fixture.detectChanges();

    expect(service.deactivateCompanyProfile).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('activates the company profile without confirmation', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      findCompanyProfileById: vi.fn(() => of({
        ...createActiveDetail(),
        active: false
      })),
      activateCompanyProfile: vi.fn(() => of({
        ...createActiveDetail(),
        active: true
      }))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Attiva'
    );
    fixture.detectChanges();

    expect(service.activateCompanyProfile).toHaveBeenCalledWith('company-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Profilo aziendale attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('opens confirm dialog and shows the translated delete conflict message on 409', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteCompanyProfile: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).not.toBeNull();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Cancella definitivamente');
    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      'Profilo aziendale non cancellabile perche gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('cancels deletePhysical without invoking the handler', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    clickButtonByExactText(
      fixture.nativeElement.querySelector('app-detail-action-bar') as HTMLElement,
      'Cancella definitivamente'
    );
    fixture.detectChanges();
    clickButtonByExactText(fixture.nativeElement.querySelector('app-confirm-dialog') as HTMLElement, 'Annulla');
    fixture.detectChanges();

    expect(service.deleteCompanyProfile).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('shows the error state when the detail fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfileById: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il dettaglio profilo aziendale.');
  });
});

async function createFixture(service: CompanyProfileAdministrationService) {
  await TestBed.configureTestingModule({
    imports: [CompanyProfileAdministrationDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => key === 'id' ? 'company-1' : null
            }
          }
        }
      },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType: 'TENANT_ADMIN',
            permissions: [
              'TENANT.COMPANY_PROFILE.READ',
              'TENANT.COMPANY_PROFILE.UPDATE',
              'TENANT.COMPANY_PROFILE.DELETE'
            ]
          })
        }
      },
      {
        provide: CompanyProfileAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(CompanyProfileAdministrationDetailComponent);
}

function createService(overrides: Partial<CompanyProfileAdministrationService> = {}): CompanyProfileAdministrationService {
  const activeDetail = createActiveDetail();

  return {
    findCompanyProfiles: vi.fn(),
    findFormOptions: vi.fn(() => of({
      tenants: [{ id: 'tenant-1', code: 'TENANT', name: 'Tenant' }],
      companyProfileTypes: [{ id: 'type-1', tenantId: 'tenant-1', code: 'CP001', name: 'Legal entity' }],
      countries: [{ id: 'country-1', code: 'IT', name: 'Italy' }],
      regions: [{ id: 'region-1', tenantId: 'tenant-1', countryId: 'country-1', code: 'RG001', name: 'Lazio' }],
      areas: [{ id: 'area-1', tenantId: 'tenant-1', countryId: 'country-1', regionId: 'region-1', code: 'RM', name: 'Rome' }],
      globalZipCodes: [{ id: 'zip-1', tenantId: 'tenant-1', countryId: 'country-1', regionId: 'region-1', areaId: 'area-1', code: '00100', name: 'Roma' }]
    })),
    createCompanyProfile: vi.fn(),
    updateCompanyProfile: vi.fn(),
    findCompanyProfileById: vi.fn(() => of(activeDetail)),
    activateCompanyProfile: vi.fn(() => of({ ...activeDetail, active: true })),
    deactivateCompanyProfile: vi.fn(() => of({ ...activeDetail, active: false })),
    deleteCompanyProfile: vi.fn(() => of(void 0)),
    ...overrides
  } as CompanyProfileAdministrationService;
}

function createActiveDetail() {
  return {
    id: 'company-1',
    tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
    companyProfileType: { id: 'type-1', code: 'CP001', name: 'Legal entity' },
    code: 'CP001',
    legalName: 'Legal One',
    tradeName: 'Trade One',
    vatNumber: 'VAT-1',
    taxIdentifier: 'TID-1',
    taxNumber: 'TAX-1',
    email: 'info@example.com',
    pecEmail: 'pec@example.com',
    phoneDialCode: '+39',
    phoneNationalNumber: '123456',
    phone: '+39 123456',
    sdiCode: 'SDI123',
    country: { id: 'country-1', code: 'IT', name: 'Italy' },
    region: { id: 'region-1', code: 'RG001', name: 'Lazio' },
    area: { id: 'area-1', code: 'AR001', name: 'Rome' },
    globalZipCode: { id: 'zip-1', code: '00100', name: 'Roma' },
    street: 'Street',
    streetNumber: '10',
    active: true,
    createdAt: '2026-05-13T09:00:00Z',
    updatedAt: '2026-05-13T10:00:00Z'
  };
}

function findButtonByExactText(container: HTMLElement, label: string): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll('button'))
    .find((candidate) => candidate.textContent?.trim() === label) as HTMLButtonElement | undefined;

  if (!button) {
    throw new Error(`Button not found: ${label}`);
  }

  return button;
}

function clickButtonByExactText(container: HTMLElement, label: string): void {
  findButtonByExactText(container, label).click();
}
