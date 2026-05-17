import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { CompanyProfileAdministrationService } from '../company-profile-administration/company-profile-administration.service';
import { TenantAdministrationService } from '../tenant-administration/tenant-administration.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupService } from '../../shared/lookup/lookup.service';
import { HolidayCalendarAdministrationFormComponent } from './holiday-calendar-administration-form.component';
import { HolidayCalendarAdministrationService } from './holiday-calendar-administration.service';

@Component({
  standalone: true,
  template: ''
})
class DummyRouteComponent {}

describe('HolidayCalendarAdministrationFormComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('creates a tenant scoped calendar for tenant users', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createHolidayService();
    const fixture = await createFixture(service);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    component.form.patchValue({
      name: 'Italy 2027',
      countryId: 'country-1',
      year: '2027',
      scope: 'TENANT',
      companyProfileId: ''
    });
    component.submit();

    expect(service.createHolidayCalendar).toHaveBeenCalledWith({
      countryId: 'country-1',
      year: 2027,
      name: 'Italy 2027',
      scope: 'TENANT',
      tenantId: 'tenant-1',
      companyProfileId: null
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/holiday-calendars', 'calendar-2']);
  });

  it('loads edit mode and updates a company profile scoped calendar', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createHolidayService();
    const fixture = await createFixture(service, true, {
      id: 'calendar-1',
      country: { id: 'country-1', code: 'IT', name: 'Italy' },
      year: 2026,
      name: 'Italy 2026',
      scope: 'COMPANY_PROFILE',
      tenant: { id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' },
      companyProfile: { id: 'company-1', code: 'CP001', name: 'Company One' },
      active: true,
      createdAt: '2026-05-10T09:00:00Z',
      updatedAt: '2026-05-15T10:00:00Z'
    });
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    component.form.patchValue({
      name: 'Italy 2026 Updated',
      countryId: 'country-1',
      year: '2026',
      scope: 'COMPANY_PROFILE',
      tenantId: 'tenant-1',
      companyProfileId: 'company-1'
    });
    component.submit();

    expect(service.updateHolidayCalendar).toHaveBeenCalledWith('calendar-1', {
      countryId: 'country-1',
      year: 2026,
      name: 'Italy 2026 Updated',
      scope: 'COMPANY_PROFILE',
      tenantId: 'tenant-1',
      companyProfileId: 'company-1'
    });
  });

  it('blocks submit when company profile scope is missing company profile id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const service = createHolidayService();
    const fixture = await createFixture(service);
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    component.form.patchValue({
      name: 'Italy 2027',
      countryId: 'country-1',
      year: '2027',
      scope: 'COMPANY_PROFILE',
      companyProfileId: ''
    });
    component.submit();

    expect(service.createHolidayCalendar).not.toHaveBeenCalled();
    expect(component.validationMessage('companyProfileId')).toContain('profilo');
  });

  it('defaults year to the current year in create mode', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture(createHolidayService());
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    expect(component.form.controls.year.getRawValue()).toBe(String(new Date().getFullYear()));
  });

  it('loads countries through the shared lookup service with server-side search parameters', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const lookupService = createLookupService();
    const fixture = await createFixture(createHolidayService(), false, undefined, lookupService);
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    component.countryLookup({ page: 1, size: 25, search: 'Tun' }).subscribe();

    expect(lookupService.findCountryLookups).toHaveBeenCalledWith({
      page: 1,
      size: 25,
      search: 'Tun'
    });
  });

  it('shows load error state when authenticated user loading fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [DummyRouteComponent, HolidayCalendarAdministrationFormComponent],
      providers: [
        provideRouter([
          { path: 'admin/holiday-calendars', component: DummyRouteComponent },
          { path: 'admin/holiday-calendars/:id', component: DummyRouteComponent },
          { path: 'admin/holiday-calendars/:id/edit', component: DummyRouteComponent }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => null }
            }
          }
        },
        {
          provide: AuthService,
          useValue: {
            loadAuthenticatedUser: () => throwError(() => new Error('load failed'))
          }
        },
        { provide: HolidayCalendarAdministrationService, useValue: createHolidayService() },
        { provide: LookupService, useValue: createLookupService() },
        { provide: TenantAdministrationService, useValue: createTenantService() },
        { provide: CompanyProfileAdministrationService, useValue: createCompanyProfileService() }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HolidayCalendarAdministrationFormComponent);
    await stabilizeFixture(fixture);

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare il form del calendario festività.');
  });
});

async function createFixture(
  holidayService: ReturnType<typeof createHolidayService>,
  editMode = false,
  detailOverride?: Record<string, unknown>,
  lookupService = createLookupService()
) {
  await TestBed.configureTestingModule({
    imports: [DummyRouteComponent, HolidayCalendarAdministrationFormComponent],
    providers: [
      provideRouter([
        { path: 'admin/holiday-calendars', component: DummyRouteComponent },
        { path: 'admin/holiday-calendars/:id', component: DummyRouteComponent },
        { path: 'admin/holiday-calendars/:id/edit', component: DummyRouteComponent }
      ]),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: (key: string) => {
                if (!editMode) {
                  return null;
                }

                return key === 'id' ? 'calendar-1' : null;
              }
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
            permissions: ['TENANT.HOLIDAY_CALENDAR.READ', 'TENANT.HOLIDAY_CALENDAR.CREATE', 'TENANT.HOLIDAY_CALENDAR.UPDATE']
          })
        }
      },
      { provide: HolidayCalendarAdministrationService, useValue: { ...holidayService, findHolidayCalendarById: vi.fn(() => of(detailOverride ?? createDefaultDetail())) } },
      { provide: LookupService, useValue: lookupService },
      { provide: TenantAdministrationService, useValue: createTenantService() },
      { provide: CompanyProfileAdministrationService, useValue: createCompanyProfileService() }
    ]
  }).compileComponents();

  return TestBed.createComponent(HolidayCalendarAdministrationFormComponent);
}

async function stabilizeFixture(fixture: any) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function createDefaultDetail() {
  return {
    id: 'calendar-1',
    country: { id: 'country-1', code: 'IT', name: 'Italy' },
    year: 2026,
    name: 'Italy 2026',
    scope: 'TENANT',
    tenant: { id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' },
    companyProfile: null,
    active: true,
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z'
  };
}

function createHolidayService() {
  return {
    findHolidayCalendarById: vi.fn(() => of(createDefaultDetail())),
    createHolidayCalendar: vi.fn(() => of({ id: 'calendar-2' })),
    updateHolidayCalendar: vi.fn(() => of({ id: 'calendar-1' }))
  };
}

function createLookupService() {
  return {
    findCountryLookups: vi.fn(() => of({
      content: [
        { id: 'country-1', code: 'IT', name: 'Italy' },
        { id: 'country-2', code: 'TN', name: 'Tunisia' }
      ],
      page: 0,
      size: 25,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true
    }))
  };
}

function createTenantService() {
  return {
    findTenants: vi.fn(() => of({
      content: [{ id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' }],
      page: 0,
      size: 100,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    }))
  };
}

function createCompanyProfileService() {
  return {
    findCompanyProfiles: vi.fn(() => of({
      content: [{
        id: 'company-1',
        tenant: { id: 'tenant-1', code: 'TENANT_1', name: 'Tenant 1' },
        companyProfileType: { id: 'type-1', code: 'LEGAL', name: 'Legal entity' },
        code: 'CP001',
        legalName: 'Company One Srl',
        tradeName: 'Company One',
        vatNumber: null,
        taxIdentifier: null,
        country: { id: 'country-1', code: 'IT', name: 'Italy' },
        active: true,
        updatedAt: '2026-05-15T10:00:00Z'
      }],
      page: 0,
      size: 100,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    }))
  };
}
