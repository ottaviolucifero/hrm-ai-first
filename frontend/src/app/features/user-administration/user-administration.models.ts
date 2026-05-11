import {
  DataTableAction,
  DataTableColumn,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_USER_ADMIN_PAGE_SIZE = 20;

export interface UserAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface UserAdministrationCompanyProfile {
  readonly id: string;
  readonly code: string;
  readonly legalName: string;
  readonly tradeName: string;
}

export interface UserAdministrationEmployee {
  readonly id: string;
  readonly employeeCode: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
}

export interface UserAdministrationRole {
  readonly id: string;
  readonly tenantId: string;
  readonly tenantCode: string;
  readonly tenantName: string;
  readonly code: string;
  readonly name: string;
  readonly systemRole: boolean;
  readonly active: boolean;
}

export interface UserAdministrationTenantAccess {
  readonly id: string;
  readonly tenantId: string;
  readonly tenantCode: string;
  readonly tenantName: string;
  readonly accessRole: string;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserAdministrationUserListItem extends DataTableRow {
  readonly id: string;
  readonly displayName: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly email: string;
  readonly userType: UserAdministrationReference;
  readonly tenant: UserAdministrationReference;
  readonly companyProfile: UserAdministrationCompanyProfile | null;
  readonly active: boolean;
  readonly locked: boolean;
  readonly roles: readonly UserAdministrationRole[];
  readonly tenantAccesses: readonly UserAdministrationTenantAccess[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserAdministrationUserDetail extends UserAdministrationUserListItem {
  readonly primaryTenant: UserAdministrationReference | null;
  readonly employee: UserAdministrationEmployee | null;
  readonly authenticationMethod: UserAdministrationReference;
  readonly preferredLanguage: string | null;
  readonly timeZone: UserAdministrationReference | null;
  readonly emailVerifiedAt: string | null;
  readonly passwordChangedAt: string | null;
  readonly lastLoginAt: string | null;
  readonly failedLoginAttempts: number;
  readonly emailOtpEnabled: boolean;
  readonly appOtpEnabled: boolean;
  readonly strongAuthenticationRequired: boolean;
}

export interface UserAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface UserAdministrationPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export type UserAdministrationColumn = DataTableColumn;
export type UserAdministrationRowAction = DataTableAction;
export type UserAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_USER_ADMIN_PAGE: UserAdministrationPage<UserAdministrationUserListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_USER_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
