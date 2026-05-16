export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export type PermissionModuleId = 'master-data' | 'tenants' | 'company-profiles' | 'roles' | 'permissions' | 'users' | 'devices';

export type PermissionScopeCode = 'PLATFORM' | 'TENANT';

export type PermissionResourceCode = 'TENANT' | 'COMPANY_PROFILE' | 'MASTER_DATA' | 'ROLE' | 'PERMISSION' | 'USER' | 'DEVICE';

export type PermissionCodeAction = 'READ' | 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'MANAGE';

export interface ParsedPermissionCode {
  readonly scope: PermissionScopeCode;
  readonly resource: PermissionResourceCode;
  readonly action: PermissionCodeAction;
}

export interface ModulePermissionSummary {
  readonly canView: boolean;
  readonly canCreate: boolean;
  readonly canUpdate: boolean;
  readonly canDelete: boolean;
  readonly hasAnyPermission: boolean;
  readonly isFrozen: boolean;
}

export const MODULE_PERMISSION_RESOURCE_MAP: Record<PermissionModuleId, PermissionResourceCode> = {
  'master-data': 'MASTER_DATA',
  tenants: 'TENANT',
  'company-profiles': 'COMPANY_PROFILE',
  roles: 'ROLE',
  permissions: 'PERMISSION',
  users: 'USER',
  devices: 'DEVICE'
};

export const FROZEN_MODULE_PERMISSION_SUMMARY: ModulePermissionSummary = Object.freeze({
  canView: false,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  hasAnyPermission: false,
  isFrozen: true
});

export function isPermissionAction(value: unknown): value is PermissionAction {
  return value === 'view' || value === 'create' || value === 'update' || value === 'delete';
}

export function isPermissionModuleId(value: unknown): value is PermissionModuleId {
  return value === 'master-data'
    || value === 'tenants'
    || value === 'company-profiles'
    || value === 'roles'
    || value === 'permissions'
    || value === 'users'
    || value === 'devices';
}
