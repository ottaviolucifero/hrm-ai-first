import {
  DataTableAction,
  DataTableColumn,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_DEVICE_ADMIN_PAGE_SIZE = 20;

export interface DeviceAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface DeviceAdministrationEmployeeOption extends DeviceAdministrationReference {
  readonly companyProfileId: string;
}

export interface DeviceAdministrationDeviceListItem extends DataTableRow {
  readonly id: string;
  readonly tenant: DeviceAdministrationReference;
  readonly companyProfile: DeviceAdministrationReference;
  readonly name: string;
  readonly assetCode: string;
  readonly barcodeValue: string;
  readonly type: DeviceAdministrationReference;
  readonly brand: DeviceAdministrationReference;
  readonly model: string | null;
  readonly serialNumber: string;
  readonly purchaseDate: string | null;
  readonly warrantyEndDate: string | null;
  readonly deviceStatus: DeviceAdministrationReference;
  readonly assignedTo: DeviceAdministrationReference | null;
  readonly assignedAt: string | null;
  readonly active: boolean;
  readonly updatedAt: string;
}

export interface DeviceAdministrationDeviceDetail extends DeviceAdministrationDeviceListItem {
  readonly createdAt: string;
}

export interface DeviceAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface DeviceAdministrationCreateRequest {
  readonly tenantId: string;
  readonly companyProfileId: string;
  readonly name: string;
  readonly deviceTypeId: string;
  readonly deviceBrandId: string;
  readonly model: string | null;
  readonly serialNumber: string;
  readonly purchaseDate: string | null;
  readonly warrantyEndDate: string | null;
  readonly deviceStatusId: string;
  readonly assignedToEmployeeId: string | null;
  readonly assignedAt: string | null;
}

export interface DeviceAdministrationUpdateRequest {
  readonly companyProfileId: string;
  readonly name: string;
  readonly deviceTypeId: string;
  readonly deviceBrandId: string;
  readonly model: string | null;
  readonly serialNumber: string;
  readonly purchaseDate: string | null;
  readonly warrantyEndDate: string | null;
  readonly deviceStatusId: string;
  readonly assignedToEmployeeId: string | null;
  readonly assignedAt: string | null;
}

export interface DeviceAdministrationFormOptions {
  readonly tenants: readonly DeviceAdministrationReference[];
  readonly companyProfiles: readonly DeviceAdministrationReference[];
  readonly deviceTypes: readonly DeviceAdministrationReference[];
  readonly deviceBrands: readonly DeviceAdministrationReference[];
  readonly deviceStatuses: readonly DeviceAdministrationReference[];
  readonly employees: readonly DeviceAdministrationEmployeeOption[];
}

export interface DeviceAdministrationPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export type DeviceAdministrationColumn = DataTableColumn;
export type DeviceAdministrationRowAction = DataTableAction;
export type DeviceAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_DEVICE_ADMIN_PAGE: DeviceAdministrationPage<DeviceAdministrationDeviceListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_DEVICE_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
