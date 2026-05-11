import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserAdministrationService } from './user-administration.service';

describe('UserAdministrationService', () => {
  let service: UserAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests tenant users with tenant filter and pagination', () => {
    service.findUsers('tenant-1', { page: 0, size: 20, search: 'ada' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users' &&
      httpRequest.params.get('tenantId') === 'tenant-1' &&
      httpRequest.params.get('page') === '0' &&
      httpRequest.params.get('size') === '20' &&
      httpRequest.params.get('search') === 'ada'
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

  it('requests platform users without tenant filter', () => {
    service.findUsers(null, { page: 1, size: 50 }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/users' &&
      !httpRequest.params.has('tenantId') &&
      httpRequest.params.get('page') === '1' &&
      httpRequest.params.get('size') === '50'
    );

    expect(request.request.method).toBe('GET');
    request.flush({
      content: [],
      page: 1,
      size: 50,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  });

  it('requests user detail', () => {
    service.findUserById('user-1').subscribe();

    const request = httpTestingController.expectOne('/api/admin/users/user-1');

    expect(request.request.method).toBe('GET');
    request.flush({ id: 'user-1' });
  });
});
