import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { CompanyProfileAdministrationComponent } from './company-profile-administration.component';
import { CompanyProfileAdministrationService } from './company-profile-administration.service';

interface CompanyProfileAdministrationListHandle {
  handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
}

describe('CompanyProfileAdministrationComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads tenant company profiles using the authenticated tenant id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    fixture.detectChanges();

    expect(service.findCompanyProfiles).toHaveBeenCalledWith('tenant-1', expect.objectContaining({ page: 0, size: 20 }));
    expect(fixture.nativeElement.textContent).toContain('Profili aziendali');
    expect(fixture.nativeElement.textContent).toContain('Nuovo profilo aziendale');
    expect(fixture.nativeElement.textContent).toContain('Vista tenant');
    expect(fixture.nativeElement.textContent).toContain('CP001');
    expect(fixture.nativeElement.textContent).toContain('Legal One');
    expect(fixture.nativeElement.textContent).toContain('VAT-1');
  }, 10000);

  it('shows fiscal summary as tax identifier for non-italian company profiles', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfiles: vi.fn(() => of({
        content: [
          {
            id: 'company-2',
            tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
            companyProfileType: { id: 'type-2', code: 'CP002', name: 'Branch' },
            code: 'CP002',
            legalName: 'Legal Two',
            tradeName: 'Trade Two',
            vatNumber: 'VAT-2',
            taxIdentifier: 'TID-2',
            taxNumber: 'TAX-2',
            country: { id: 'country-2', code: 'FR', name: 'France' },
            active: true,
            updatedAt: '2026-05-13T10:00:00Z'
          }
        ],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true
      }))
    }));
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('TID-2');
    expect(textContent).not.toContain('VAT-2');
    expect(textContent).not.toContain('TAX-2');
  });

  it('keeps the create action visible but disabled without create permission', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService(), 'TENANT_ADMIN', ['TENANT.COMPANY_PROFILE.READ']);
    fixture.detectChanges();

    const createButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => (button as HTMLButtonElement).textContent?.includes('Nuovo profilo aziendale')) as HTMLButtonElement;

    expect(createButton).toBeTruthy();
    expect(createButton.disabled).toBe(true);
  });

  it('navigates to detail and edit from row actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService());
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as CompanyProfileAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'view' },
      row: { id: 'company-1' }
    });
    component.handleRowAction({
      action: { id: 'edit' },
      row: { id: 'company-1' }
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles', 'company-1']);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/company-profiles', 'company-1', 'edit']);
  });

  it('handles activate and delete actions from the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService();
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as CompanyProfileAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'activate' },
      row: { id: 'company-2', code: 'CP002', legalName: 'Legal Two', tradeName: 'Trade Two', active: false }
    });
    component.handleRowAction({
      action: { id: 'deletePhysical' },
      row: { id: 'company-1', code: 'CP001', legalName: 'Legal One', tradeName: 'Trade One', active: true }
    });

    expect(service.activateCompanyProfile).toHaveBeenCalledWith('company-2');
    expect(service.deleteCompanyProfile).toHaveBeenCalledWith('company-1');
    expect(successSpy).toHaveBeenCalledWith(
      'Profilo aziendale attivato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(successSpy).toHaveBeenCalledWith(
      'Profilo aziendale cancellato correttamente.',
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('shows the translated conflict delete message on 409', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createService({
      deleteCompanyProfile: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 409 })))
    });
    const fixture = await createFixture(service);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as CompanyProfileAdministrationListHandle;
    component.handleRowAction({
      action: { id: 'deletePhysical' },
      row: { id: 'company-1', code: 'CP001', legalName: 'Legal One', tradeName: 'Trade One', active: true }
    });

    expect(errorSpy).toHaveBeenCalledWith(
      'Profilo aziendale non cancellabile perche gia referenziato. Puoi disattivarlo.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('shows the error state when the page fails to load', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createService({
      findCompanyProfiles: vi.fn(() => throwError(() => new Error('load failed')))
    }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i profili aziendali.');
  });
});

async function createFixture(
  service: CompanyProfileAdministrationService,
  userType = 'TENANT_ADMIN',
  permissions: readonly string[] = [
    'TENANT.COMPANY_PROFILE.READ',
    'TENANT.COMPANY_PROFILE.CREATE',
    'TENANT.COMPANY_PROFILE.UPDATE',
    'TENANT.COMPANY_PROFILE.DELETE'
  ]
) {
  await TestBed.configureTestingModule({
    imports: [CompanyProfileAdministrationComponent],
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({
            id: 'user-1',
            tenantId: 'tenant-1',
            email: 'qa@example.com',
            userType,
            permissions
          })
        }
      },
      {
        provide: CompanyProfileAdministrationService,
        useValue: service
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(CompanyProfileAdministrationComponent);
}

function createService(overrides: Partial<CompanyProfileAdministrationService> = {}): CompanyProfileAdministrationService {
  return {
    findCompanyProfiles: vi.fn(() => of({
      content: [
        {
          id: 'company-1',
          tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
          companyProfileType: { id: 'type-1', code: 'CP001', name: 'Legal entity' },
          code: 'CP001',
          legalName: 'Legal One',
          tradeName: 'Trade One',
          vatNumber: 'VAT-1',
          taxIdentifier: null,
          taxNumber: 'TAX-1',
          country: { id: 'country-1', code: 'IT', name: 'Italy' },
          active: true,
          updatedAt: '2026-05-13T10:00:00Z'
        }
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })),
    findFormOptions: vi.fn(),
    findCompanyProfileById: vi.fn(),
    createCompanyProfile: vi.fn(),
    updateCompanyProfile: vi.fn(),
    activateCompanyProfile: vi.fn(() => of({
      id: 'company-2',
      tenant: { id: 'tenant-1', code: 'TENANT', name: 'Tenant' },
      companyProfileType: { id: 'type-2', code: 'CP002', name: 'Branch' },
      code: 'CP002',
      legalName: 'Legal Two',
      tradeName: 'Trade Two',
      vatNumber: null,
      taxIdentifier: null,
      taxNumber: null,
      active: true,
      updatedAt: '2026-05-13T11:00:00Z',
      country: { id: 'country-1', code: 'IT', name: 'Italy' }
    })),
    deactivateCompanyProfile: vi.fn(),
    deleteCompanyProfile: vi.fn(() => of(void 0)),
    ...overrides
  } as CompanyProfileAdministrationService;
}
