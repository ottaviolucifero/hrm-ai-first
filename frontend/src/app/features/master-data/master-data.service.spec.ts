import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MasterDataService } from './master-data.service';

describe('MasterDataService', () => {
  let masterDataService: MasterDataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    masterDataService = TestBed.inject(MasterDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('sends pagination and search query params', () => {
    masterDataService.fetchRows(
      {
        id: 'countries',
        titleKey: 'masterData.entities.countries',
        endpoint: '/api/master-data/global/countries',
        columns: []
      },
      {
        page: 1,
        size: 25,
        search: 'italy'
      }
    ).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/master-data/global/countries' &&
      httpRequest.params.get('page') === '1' &&
      httpRequest.params.get('size') === '25' &&
      httpRequest.params.get('search') === 'italy'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 1,
      size: 25,
      totalElements: 0,
      totalPages: 0,
      first: false,
      last: true
    });
  });

  it('creates a row with the expected payload', () => {
    masterDataService.createRow(
      {
        id: 'departments',
        titleKey: 'masterData.entities.departments',
        endpoint: '/api/master-data/hr-business/departments',
        columns: []
      },
      {
        tenantId: 'tenant-1',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    ).subscribe();

    const request = httpTestingController.expectOne('/api/master-data/hr-business/departments');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      tenantId: 'tenant-1',
      code: 'HR',
      name: 'Human Resources',
      active: true
    });
    request.flush({ id: 'department-1' });
  });

  it('updates a row with the expected payload', () => {
    masterDataService.updateRow(
      {
        id: 'departments',
        titleKey: 'masterData.entities.departments',
        endpoint: '/api/master-data/hr-business/departments',
        columns: []
      },
      'department-1',
      {
        tenantId: 'tenant-1',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    ).subscribe();

    const request = httpTestingController.expectOne('/api/master-data/hr-business/departments/department-1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      tenantId: 'tenant-1',
      code: 'HR',
      name: 'Human Resources',
      active: true
    });
    request.flush({ id: 'department-1' });
  });

  it('sends the deactivation request to the expected DELETE endpoint', () => {
    masterDataService.deleteRow(
      {
        id: 'departments',
        titleKey: 'masterData.entities.departments',
        endpoint: '/api/master-data/hr-business/departments',
        columns: []
      },
      'department-1'
    ).subscribe();

    const request = httpTestingController.expectOne('/api/master-data/hr-business/departments/department-1');

    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
