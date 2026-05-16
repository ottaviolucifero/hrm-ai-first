import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeviceAdministrationService } from './device-administration.service';

describe('DeviceAdministrationService', () => {
  let service: DeviceAdministrationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DeviceAdministrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests tenant devices with pagination and search', () => {
    service.findDevices('tenant-1', { page: 0, size: 20, search: 'scanner' }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/devices'
      && httpRequest.params.get('tenantId') === 'tenant-1'
      && httpRequest.params.get('page') === '0'
      && httpRequest.params.get('size') === '20'
      && httpRequest.params.get('search') === 'scanner'
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

  it('requests platform devices without tenant filter', () => {
    service.findDevices(null, { page: 1, size: 50 }).subscribe();

    const request = httpTestingController.expectOne((httpRequest) =>
      httpRequest.url === '/api/admin/devices'
      && !httpRequest.params.has('tenantId')
      && httpRequest.params.get('page') === '1'
      && httpRequest.params.get('size') === '50'
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

  it('requests detail and form options', () => {
    service.findDeviceById('device-1').subscribe();
    service.findFormOptions().subscribe();
    service.findDeviceAssignments('device-1').subscribe();

    const detailRequest = httpTestingController.expectOne('/api/admin/devices/device-1');
    const formOptionsRequest = httpTestingController.expectOne('/api/admin/devices/form-options');
    const assignmentsRequest = httpTestingController.expectOne('/api/admin/devices/device-1/assignments');

    expect(detailRequest.request.method).toBe('GET');
    expect(formOptionsRequest.request.method).toBe('GET');
    expect(assignmentsRequest.request.method).toBe('GET');

    detailRequest.flush({ id: 'device-1' });
    formOptionsRequest.flush({
      tenants: [],
      companyProfiles: [],
      deviceTypes: [],
      deviceBrands: [],
      deviceStatuses: [],
      employees: []
    });
    assignmentsRequest.flush([]);
  });

  it('creates and updates devices', () => {
    service.createDevice({
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      name: 'Scanner',
      deviceTypeId: 'type-1',
      deviceBrandId: 'brand-1',
      model: 'Model X',
      serialNumber: 'SN-001',
      purchaseDate: '2026-05-15',
      warrantyEndDate: '2028-05-15',
      deviceStatusId: 'status-1',
      assignedToEmployeeId: 'employee-1',
      assignedAt: '2026-05-15T09:00:00.000Z'
    }).subscribe();

    const createRequest = httpTestingController.expectOne('/api/admin/devices');
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({
      tenantId: 'tenant-1',
      companyProfileId: 'company-1',
      name: 'Scanner',
      deviceTypeId: 'type-1',
      deviceBrandId: 'brand-1',
      model: 'Model X',
      serialNumber: 'SN-001',
      purchaseDate: '2026-05-15',
      warrantyEndDate: '2028-05-15',
      deviceStatusId: 'status-1',
      assignedToEmployeeId: 'employee-1',
      assignedAt: '2026-05-15T09:00:00.000Z'
    });
    createRequest.flush({ id: 'device-1' });

    service.updateDevice('device-1', {
      companyProfileId: 'company-2',
      name: 'Scanner Updated',
      deviceTypeId: 'type-2',
      deviceBrandId: 'brand-2',
      model: null,
      serialNumber: 'SN-002',
      purchaseDate: null,
      warrantyEndDate: null,
      deviceStatusId: 'status-2',
      assignedToEmployeeId: null,
      assignedAt: null
    }).subscribe();

    const updateRequest = httpTestingController.expectOne('/api/admin/devices/device-1');
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual({
      companyProfileId: 'company-2',
      name: 'Scanner Updated',
      deviceTypeId: 'type-2',
      deviceBrandId: 'brand-2',
      model: null,
      serialNumber: 'SN-002',
      purchaseDate: null,
      warrantyEndDate: null,
      deviceStatusId: 'status-2',
      assignedToEmployeeId: null,
      assignedAt: null
    });
    updateRequest.flush({ id: 'device-1' });
  });

  it('updates lifecycle endpoints and delete', () => {
    service.activateDevice('device-1').subscribe();
    service.deactivateDevice('device-1').subscribe();
    service.deleteDevice('device-1').subscribe();

    const activateRequest = httpTestingController.expectOne('/api/admin/devices/device-1/activate');
    const deactivateRequest = httpTestingController.expectOne('/api/admin/devices/device-1/deactivate');
    const deleteRequest = httpTestingController.expectOne('/api/admin/devices/device-1');

    expect(activateRequest.request.method).toBe('PUT');
    expect(activateRequest.request.body).toEqual({});
    expect(deactivateRequest.request.method).toBe('PUT');
    expect(deactivateRequest.request.body).toEqual({});
    expect(deleteRequest.request.method).toBe('DELETE');

    activateRequest.flush({ id: 'device-1' });
    deactivateRequest.flush({ id: 'device-1' });
    deleteRequest.flush(null);
  });

  it('assigns, reassigns, and returns devices through assignment endpoints', () => {
    service.assignDevice('device-1', {
      employeeId: 'employee-1',
      assignedFrom: '2026-05-18T09:00:00.000Z',
      conditionOnAssign: 'Excellent',
      notes: 'Fresh handover'
    }).subscribe();

    service.returnDevice('device-1', {
      returnedAt: '2026-05-20T17:30:00.000Z',
      returnNote: 'Returned intact',
      conditionOnReturn: 'Good',
      notes: 'Desk handover'
    }).subscribe();

    const assignRequest = httpTestingController.expectOne('/api/admin/devices/device-1/assignments');
    const returnRequest = httpTestingController.expectOne('/api/admin/devices/device-1/assignments/return');

    expect(assignRequest.request.method).toBe('POST');
    expect(assignRequest.request.body).toEqual({
      employeeId: 'employee-1',
      assignedFrom: '2026-05-18T09:00:00.000Z',
      conditionOnAssign: 'Excellent',
      notes: 'Fresh handover'
    });
    expect(returnRequest.request.method).toBe('POST');
    expect(returnRequest.request.body).toEqual({
      returnedAt: '2026-05-20T17:30:00.000Z',
      returnNote: 'Returned intact',
      conditionOnReturn: 'Good',
      notes: 'Desk handover'
    });

    assignRequest.flush({ id: 'assignment-1' });
    returnRequest.flush({ id: 'assignment-1' });
  });
});
