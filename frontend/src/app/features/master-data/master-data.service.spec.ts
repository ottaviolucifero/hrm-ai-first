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
});
