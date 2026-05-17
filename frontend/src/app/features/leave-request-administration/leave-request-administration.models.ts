import {
  DataTableAction,
  DataTableColumn,
  DataTablePage,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_LEAVE_REQUEST_ADMIN_PAGE_SIZE = 20;

export type LeaveRequestAdministrationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface LeaveRequestAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface LeaveRequestAdministrationEmployeeOption extends LeaveRequestAdministrationReference {
  readonly tenant: LeaveRequestAdministrationReference | null;
  readonly companyProfile: LeaveRequestAdministrationReference | null;
  readonly active: boolean | null;
}

export interface LeaveRequestAdministrationListItem extends DataTableRow {
  readonly id: string;
  readonly tenant: LeaveRequestAdministrationReference | null;
  readonly companyProfile: LeaveRequestAdministrationReference | null;
  readonly employee: LeaveRequestAdministrationReference | null;
  readonly leaveRequestType: LeaveRequestAdministrationReference | null;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationDays: number | string | null;
  readonly deductFromBalance: boolean | null;
  readonly deductedDays: number | string | null;
  readonly reason: string | null;
  readonly status: LeaveRequestAdministrationStatus;
  readonly approver: LeaveRequestAdministrationReference | null;
  readonly urgent: boolean | null;
}

export interface LeaveRequestAdministrationDetail extends LeaveRequestAdministrationListItem {
  readonly comments: string | null;
  readonly urgentReason: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LeaveRequestAdministrationCreateRequest {
  readonly tenantId: string;
  readonly employeeId: string;
  readonly leaveRequestTypeId: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationDays: number | null;
  readonly deductFromBalance: boolean;
  readonly deductedDays: number | null;
  readonly reason: string | null;
  readonly status: LeaveRequestAdministrationStatus | null;
  readonly comments: string | null;
  readonly urgent: boolean;
  readonly urgentReason: string | null;
}

export interface LeaveRequestAdministrationUpdateRequest {
  readonly employeeId: string;
  readonly leaveRequestTypeId: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationDays: number | null;
  readonly deductFromBalance: boolean;
  readonly deductedDays: number | null;
  readonly reason: string | null;
  readonly status: LeaveRequestAdministrationStatus;
  readonly comments: string | null;
  readonly urgent: boolean;
  readonly urgentReason: string | null;
}

export interface LeaveRequestAdministrationPage<T> extends DataTablePage {
  readonly content: readonly T[];
}

export type LeaveRequestAdministrationColumn = DataTableColumn;
export type LeaveRequestAdministrationRowAction = DataTableAction;
export type LeaveRequestAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_LEAVE_REQUEST_ADMIN_PAGE: LeaveRequestAdministrationPage<LeaveRequestAdministrationListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_LEAVE_REQUEST_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
