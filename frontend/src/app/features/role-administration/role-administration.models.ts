import {
  DataTableAction,
  DataTableColumn,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_ROLE_ADMIN_PAGE_SIZE = 20;

export interface RoleAdministrationRoleListItem extends DataTableRow {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;
  readonly systemRole: boolean;
  readonly active: boolean;
  readonly updatedAt: string;
}

export interface RoleAdministrationRoleDetail extends DataTableRow {
  readonly id: string;
  readonly tenant: {
    readonly id: string;
    readonly code: string;
    readonly name: string;
  };
  readonly code: string;
  readonly name: string;
  readonly description: string | null;
  readonly systemRole: boolean;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RoleAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface RoleAdministrationPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export interface RoleAdministrationCreateRequest {
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string | null;
  readonly active?: boolean;
}

export interface RoleAdministrationUpdateRequest {
  readonly name: string;
  readonly description?: string | null;
}

export type RoleAdministrationColumn = DataTableColumn;
export type RoleAdministrationRowAction = DataTableAction;
export type RoleAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_ROLE_ADMIN_PAGE: RoleAdministrationPage<RoleAdministrationRoleListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_ROLE_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
