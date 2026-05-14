import { Injectable } from '@angular/core';

import { AuthenticatedUser } from '../auth/auth.models';
import {
  FROZEN_MODULE_PERMISSION_SUMMARY,
  isPermissionAction,
  ModulePermissionSummary,
  MODULE_PERMISSION_RESOURCE_MAP,
  ParsedPermissionCode,
  PermissionAction,
  PermissionCodeAction,
  PermissionModuleId,
  PermissionResourceCode,
  PermissionScopeCode
} from './permission-summary.models';

const BACKEND_TO_FRONTEND_ACTION_MAP: Record<Exclude<PermissionCodeAction, 'MANAGE'>, PermissionAction> = {
  READ: 'view',
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};

@Injectable({
  providedIn: 'root'
})
export class PermissionSummaryService {
  summaryForModule(user: AuthenticatedUser | null | undefined, moduleId: PermissionModuleId): ModulePermissionSummary {
    const resource = MODULE_PERMISSION_RESOURCE_MAP[moduleId];
    if (!resource) {
      return FROZEN_MODULE_PERMISSION_SUMMARY;
    }

    const actions = new Set<PermissionAction>();
    for (const code of this.permissionCodes(user)) {
      const parsedCode = this.parsePermissionCode(code);
      if (!parsedCode || parsedCode.resource !== resource || parsedCode.action === 'MANAGE') {
        continue;
      }

      actions.add(BACKEND_TO_FRONTEND_ACTION_MAP[parsedCode.action]);
    }

    return this.createSummary(actions);
  }

  canAccess(user: AuthenticatedUser | null | undefined, moduleId: PermissionModuleId, action: PermissionAction): boolean {
    if (!isPermissionAction(action)) {
      return false;
    }

    const summary = this.summaryForModule(user, moduleId);
    switch (action) {
      case 'view':
        return summary.canView;
      case 'create':
        return summary.canCreate;
      case 'update':
        return summary.canUpdate;
      case 'delete':
        return summary.canDelete;
    }
  }

  hasAnyPermission(user: AuthenticatedUser | null | undefined, moduleId: PermissionModuleId): boolean {
    return this.summaryForModule(user, moduleId).hasAnyPermission;
  }

  isFrozen(user: AuthenticatedUser | null | undefined, moduleId: PermissionModuleId): boolean {
    return this.summaryForModule(user, moduleId).isFrozen;
  }

  private createSummary(actions: ReadonlySet<PermissionAction>): ModulePermissionSummary {
    const canView = actions.has('view');
    const canCreate = actions.has('create');
    const canUpdate = actions.has('update');
    const canDelete = actions.has('delete');
    const hasAnyPermission = canView || canCreate || canUpdate || canDelete;

    if (!hasAnyPermission) {
      return FROZEN_MODULE_PERMISSION_SUMMARY;
    }

    return {
      canView,
      canCreate,
      canUpdate,
      canDelete,
      hasAnyPermission,
      isFrozen: false
    };
  }

  private permissionCodes(user: AuthenticatedUser | null | undefined): readonly string[] {
    const permissions = this.normalizeCodes(user?.permissions);
    if (permissions.length > 0) {
      return permissions;
    }

    return this.normalizeCodes(user?.authorities);
  }

  private normalizeCodes(codes: readonly string[] | null | undefined): readonly string[] {
    if (!codes || codes.length === 0) {
      return [];
    }

    const uniqueCodes = new Set<string>();
    for (const code of codes) {
      const normalizedCode = code.trim().toUpperCase();
      if (normalizedCode.length > 0) {
        uniqueCodes.add(normalizedCode);
      }
    }

    return Array.from(uniqueCodes);
  }

  private parsePermissionCode(code: string): ParsedPermissionCode | null {
    const parts = code.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [scope, resource, action] = parts;
    if (!this.isPermissionScope(scope) || !this.isPermissionResource(resource) || !this.isPermissionCodeAction(action)) {
      return null;
    }

    return { scope, resource, action };
  }

  private isPermissionScope(value: string): value is PermissionScopeCode {
    return value === 'PLATFORM' || value === 'TENANT';
  }

  private isPermissionResource(value: string): value is PermissionResourceCode {
    return value === 'TENANT'
      || value === 'COMPANY_PROFILE'
      || value === 'MASTER_DATA'
      || value === 'ROLE'
      || value === 'PERMISSION'
      || value === 'USER';
  }

  private isPermissionCodeAction(value: string): value is PermissionCodeAction {
    return value === 'READ' || value === 'VIEW' || value === 'CREATE' || value === 'UPDATE' || value === 'DELETE' || value === 'MANAGE';
  }
}
