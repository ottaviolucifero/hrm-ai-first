import { I18nKey } from '../../core/i18n/i18n.messages';

export interface RolePermissionMatrixPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export interface RolePermissionMatrixRoleListItem {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly systemRole: boolean;
  readonly active: boolean;
}

export interface RolePermissionMatrixTenant {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface RolePermissionMatrixRoleDetail {
  readonly id: string;
  readonly tenant: RolePermissionMatrixTenant;
  readonly code: string;
  readonly name: string;
  readonly systemRole: boolean;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface RolePermissionMatrixPermission {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly name: string;
  readonly systemPermission: boolean;
  readonly active: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface RolePermissionMatrixAssignmentResponse {
  readonly roleId: string;
  readonly tenantId: string;
  readonly permissions: readonly RolePermissionMatrixPermission[];
}

export type RolePermissionScopeCode = 'PLATFORM' | 'TENANT';
export type RolePermissionResourceCode =
  | 'TENANT'
  | 'COMPANY_PROFILE'
  | 'USER'
  | 'ROLE'
  | 'PERMISSION'
  | 'MASTER_DATA'
  | 'EMPLOYEE'
  | 'CONTRACT'
  | 'DEVICE'
  | 'PAYROLL_DOCUMENT'
  | 'LEAVE_REQUEST';
export type RolePermissionActionCode = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'MANAGE';
export type RolePermissionVisibleAction = Exclude<RolePermissionActionCode, 'MANAGE'>;

export interface ParsedRolePermissionCode {
  readonly scope: RolePermissionScopeCode;
  readonly resource: RolePermissionResourceCode;
  readonly action: RolePermissionActionCode;
}

export interface RolePermissionMatrixRow {
  readonly key: string;
  readonly moduleKey: I18nKey;
  readonly scopeKey: I18nKey | null;
  readonly permissions: Record<RolePermissionVisibleAction, RolePermissionMatrixPermission | null>;
}

export const ROLE_PERMISSION_VISIBLE_ACTIONS = ['READ', 'CREATE', 'UPDATE', 'DELETE'] as const satisfies readonly RolePermissionVisibleAction[];
