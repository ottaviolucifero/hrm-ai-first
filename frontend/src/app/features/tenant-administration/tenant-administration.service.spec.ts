import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TenantAdministrationService } from './tenant-administration.service';

describe('TenantAdministrationService', () => {
  let service: TenantAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TenantAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests tenants with pagination and search', () => {
    service.findTenants({ page: 0, size: 20, search: 'foundation' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/tenants' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '20' &&
      httpRequest.params.get('search') === 'foundation'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('requests form options and detail', () => {
    service.findFormOptions().subscribe();
    service.findTenantById('tenant-1').subscribe();

    const formOptionsRequest = httpTestingController.expectOne('/api/admin/tenants/form-options');
    const detailRequest = httpTestingController.expectOne('/api/admin/tenants/tenant-1');

    expect(formOptionsRequest.request.method).toBe('GET');
    expect(detailRequest.request.method).toBe('GET');

    formOptionsRequest.flush({ countries: [], currencies: [] });
    detailRequest.flush({ id: 'tenant-1' });
  });

  it('creates updates toggles and deletes tenants', () => {
    service.createTenant({
      code: 'TENANT_A',
      name: 'Tenant A',
      legalName: 'Tenant A Legal',
      defaultCountryId: 'country-1',
      defaultCurrencyId: 'currency-1',
      active: true
    }).subscribe();
    service.updateTenant('tenant-1', {
      code: 'TENANT_B',
      name: 'Tenant B',
      legalName: 'Tenant B Legal',
      defaultCountryId: 'country-2',
      defaultCurrencyId: 'currency-2'
    }).subscribe();
    service.activateTenant('tenant-1').subscribe();
    service.deactivateTenant('tenant-1').subscribe();
    service.deleteTenant('tenant-1').subscribe();

    const createRequest = httpTestingController.expectOne('/api/admin/tenants');
    const updateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/tenants/tenant-1' &&
      httpRequest.method === 'PUT'
    );
    const activateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/tenants/tenant-1/activate' &&
      httpRequest.method === 'PUT'
    );
    const deactivateRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/tenants/tenant-1/deactivate' &&
      httpRequest.method === 'PUT'
    );
    const deleteRequest = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/tenants/tenant-1' &&
      httpRequest.method === 'DELETE'
    );

    expect(createRequest.request.method).toBe('POST');
    expect(updateRequest.request.method).toBe('PUT');
    expect(activateRequest.request.method).toBe('PUT');
    expect(deactivateRequest.request.method).toBe('PUT');
    expect(deleteRequest.request.method).toBe('DELETE');

    createRequest.flush({ id: 'tenant-1' });
    updateRequest.flush({ id: 'tenant-1' });
    activateRequest.flush({ id: 'tenant-1' });
    deactivateRequest.flush({ id: 'tenant-1' });
    deleteRequest.flush(null);
  });
});
