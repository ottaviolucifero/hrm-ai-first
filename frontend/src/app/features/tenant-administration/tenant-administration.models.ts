import {
  DataTableAction,
  DataTableColumn,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_TENANT_ADMIN_PAGE_SIZE = 20;

export interface TenantAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface TenantAdministrationTenantListItem extends DataTableRow {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly legalName: string;
  readonly defaultCountry: TenantAdministrationReference;
  readonly defaultCurrency: TenantAdministrationReference;
  readonly active: boolean;
  readonly updatedAt: string;
}

export interface TenantAdministrationTenantDetail extends TenantAdministrationTenantListItem {
  readonly createdAt: string;
}

export interface TenantAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface TenantAdministrationCreateRequest {
  readonly name: string;
  readonly legalName: string;
  readonly defaultCountryId: string;
  readonly defaultCurrencyId: string;
  readonly active?: boolean;
}

export interface TenantAdministrationUpdateRequest {
  readonly name: string;
  readonly legalName: string;
  readonly defaultCountryId: string;
  readonly defaultCurrencyId: string;
}

export interface TenantAdministrationFormOptions {
  readonly countries: readonly TenantAdministrationReference[];
  readonly currencies: readonly TenantAdministrationReference[];
}

export interface TenantAdministrationPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export type TenantAdministrationColumn = DataTableColumn;
export type TenantAdministrationRowAction = DataTableAction;
export type TenantAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_TENANT_ADMIN_PAGE: TenantAdministrationPage<TenantAdministrationTenantListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_TENANT_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
