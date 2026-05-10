import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subscription, forkJoin, switchMap, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { AppCheckboxComponent } from '../../shared/components/checkbox/app-checkbox.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  ParsedRolePermissionCode,
  ROLE_PERMISSION_VISIBLE_ACTIONS,
  RolePermissionActionCode,
  RolePermissionMatrixPermission,
  RolePermissionMatrixRoleDetail,
  RolePermissionMatrixRoleListItem,
  RolePermissionMatrixRow,
  RolePermissionResourceCode,
  RolePermissionScopeCode,
  RolePermissionVisibleAction
} from './role-permission-matrix.models';
import { RolePermissionMatrixService } from './role-permission-matrix.service';

const ROLE_PAGE_SIZE = 100;
const PERMISSION_PAGE_SIZE = 100;
const RESOURCE_ORDER: readonly RolePermissionResourceCode[] = ['MASTER_DATA', 'ROLE'];
const VISIBLE_RESOURCES = new Set<RolePermissionResourceCode>(RESOURCE_ORDER);

const MODULE_LABELS: Record<RolePermissionResourceCode, I18nKey> = {
  TENANT: 'rolePermissions.modules.tenant',
  USER: 'rolePermissions.modules.user',
  ROLE: 'rolePermissions.modules.role',
  PERMISSION: 'rolePermissions.modules.permission',
  MASTER_DATA: 'rolePermissions.modules.masterData',
  EMPLOYEE: 'rolePermissions.modules.employee',
  CONTRACT: 'rolePermissions.modules.contract',
  DEVICE: 'rolePermissions.modules.device',
  PAYROLL_DOCUMENT: 'rolePermissions.modules.payrollDocument',
  LEAVE_REQUEST: 'rolePermissions.modules.leaveRequest'
};

const SCOPE_LABELS: Record<RolePermissionScopeCode, I18nKey> = {
  PLATFORM: 'rolePermissions.scope.platform',
  TENANT: 'rolePermissions.scope.tenant'
};

const ACTION_LABELS: Record<RolePermissionVisibleAction, I18nKey> = {
  READ: 'rolePermissions.actions.read',
  CREATE: 'rolePermissions.actions.write',
  UPDATE: 'rolePermissions.actions.update',
  DELETE: 'rolePermissions.actions.delete'
};

@Component({
  selector: 'app-role-permission-matrix',
  imports: [AppButtonComponent, AppCheckboxComponent],
  templateUrl: './role-permission-matrix.component.html',
  styleUrl: './role-permission-matrix.component.scss'
})
export class RolePermissionMatrixComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly rolePermissionMatrixService = inject(RolePermissionMatrixService);
  protected readonly i18n = inject(I18nService);

  private foundationSubscription?: Subscription;
  private selectionSubscription?: Subscription;
  private saveSubscription?: Subscription;
  private readonly resourceOrderIndex = new Map(
    RESOURCE_ORDER.map((resource, index) => [resource, index] as const)
  );

  protected readonly loading = signal(true);
  protected readonly loadingSelection = signal(false);
  protected readonly saving = signal(false);
  protected readonly hasPageError = signal(false);
  protected readonly hasSelectionError = signal(false);
  protected readonly currentTenantId = signal<string | null>(null);
  protected readonly roles = signal<readonly RolePermissionMatrixRoleListItem[]>([]);
  protected readonly selectedRoleId = signal<string | null>(null);
  protected readonly selectedRole = signal<RolePermissionMatrixRoleDetail | null>(null);
  protected readonly permissionCatalog = signal<readonly RolePermissionMatrixPermission[]>([]);
  protected readonly initialPermissionIds = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedPermissionIds = signal<ReadonlySet<string>>(new Set());

  protected readonly selectedRoleListItem = computed(
    () => this.roles().find((role) => role.id === this.selectedRoleId()) ?? null
  );
  protected readonly selectedRoleReadOnly = computed(
    () => this.selectedRole()?.systemRole === true
  );
  protected readonly visibleActions = ROLE_PERMISSION_VISIBLE_ACTIONS;
  protected readonly hasUnsavedChanges = computed(
    () => !this.samePermissionSet(this.initialPermissionIds(), this.selectedPermissionIds())
  );
  protected readonly isRoleListEmpty = computed(
    () => !this.loading() && !this.hasPageError() && this.roles().length === 0
  );
  protected readonly matrixRows = computed(() => this.buildMatrixRows());

  constructor() {
    this.loadFoundation();
  }

  ngOnDestroy(): void {
    this.foundationSubscription?.unsubscribe();
    this.selectionSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  protected selectRole(roleId: string): void {
    if (!roleId || (roleId === this.selectedRoleId() && this.selectedRole() !== null)) {
      return;
    }

    this.selectedRoleId.set(roleId);
    this.loadRoleSelection(roleId);
  }

  protected togglePermission(permissionId: string, checked: boolean): void {
    this.selectedPermissionIds.update((selectedIds) => {
      const nextIds = new Set(selectedIds);

      if (checked) {
        nextIds.add(permissionId);
      } else {
        nextIds.delete(permissionId);
      }

      return nextIds;
    });
  }

  protected resetChanges(): void {
    this.selectedPermissionIds.set(new Set(this.initialPermissionIds()));
  }

  protected retryLoad(): void {
    this.loadFoundation();
  }

  protected saveChanges(): void {
    const roleId = this.selectedRoleId();
    if (!roleId || this.selectedRoleReadOnly() || this.saving() || !this.hasUnsavedChanges()) {
      return;
    }

    const permissionIds = Array.from(this.selectedPermissionIds()).sort();
    this.saving.set(true);
    this.saveSubscription?.unsubscribe();
    this.saveSubscription = this.rolePermissionMatrixService.updateAssignedPermissions(roleId, permissionIds)
      .subscribe({
        next: (response) => {
          const nextPermissionIds = new Set(response.permissions.map((permission) => permission.id));
          this.initialPermissionIds.set(nextPermissionIds);
          this.selectedPermissionIds.set(new Set(nextPermissionIds));
          this.saving.set(false);
          this.notificationService.success(this.i18n.t('rolePermissions.feedback.saveSuccess'), {
            titleKey: 'alert.title.success'
          });
        },
        error: () => {
          this.saving.set(false);
          this.notificationService.error(this.i18n.t('rolePermissions.errors.saveGeneric'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected canReset(): boolean {
    return Boolean(this.selectedRoleId()) && !this.selectedRoleReadOnly() && !this.saving() && this.hasUnsavedChanges();
  }

  protected canSave(): boolean {
    return Boolean(this.selectedRoleId()) && !this.selectedRoleReadOnly() && !this.saving() && !this.loadingSelection() && this.hasUnsavedChanges();
  }

  protected roleBadgeKey(role: Pick<RolePermissionMatrixRoleListItem, 'systemRole'>): I18nKey {
    return role.systemRole ? 'rolePermissions.badges.system' : 'rolePermissions.badges.custom';
  }

  protected roleStatusKey(role: Pick<RolePermissionMatrixRoleListItem, 'active'>): I18nKey {
    return role.active ? 'rolePermissions.badges.active' : 'rolePermissions.badges.inactive';
  }

  protected actionLabelKey(action: RolePermissionVisibleAction): I18nKey {
    return ACTION_LABELS[action];
  }

  protected isPermissionChecked(permission: RolePermissionMatrixPermission | null): boolean {
    return permission !== null && this.selectedPermissionIds().has(permission.id);
  }

  protected isPermissionDisabled(permission: RolePermissionMatrixPermission | null): boolean {
    return permission === null || permission.active !== true || this.loadingSelection() || this.saving() || this.selectedRoleReadOnly();
  }

  protected checkboxAriaLabel(row: RolePermissionMatrixRow, action: RolePermissionVisibleAction): string {
    return `${this.i18n.t('rolePermissions.matrix.togglePermission')} ${this.i18n.t(row.moduleKey)} ${this.i18n.t(this.actionLabelKey(action))}`;
  }

  protected permissionForAction(
    row: RolePermissionMatrixRow,
    action: RolePermissionVisibleAction
  ): RolePermissionMatrixPermission | null {
    return row.permissions[action];
  }

  private loadFoundation(): void {
    this.loading.set(true);
    this.hasPageError.set(false);
    this.hasSelectionError.set(false);
    this.roles.set([]);
    this.selectedRoleId.set(null);
    this.selectedRole.set(null);
    this.initialPermissionIds.set(new Set());
    this.selectedPermissionIds.set(new Set());

    this.foundationSubscription?.unsubscribe();
    this.foundationSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.currentTenantId.set(user.tenantId);
          return forkJoin({
            rolesPage: this.rolePermissionMatrixService.findRoles(user.tenantId, {
              page: 0,
              size: ROLE_PAGE_SIZE
            }),
            permissions: this.rolePermissionMatrixService.findPermissionCatalog(PERMISSION_PAGE_SIZE)
          });
        })
      )
      .subscribe({
        next: ({ rolesPage, permissions }) => {
          this.loading.set(false);
          this.permissionCatalog.set(permissions);
          this.roles.set(rolesPage.content);

          const firstRole = rolesPage.content[0];
          if (firstRole) {
            this.selectRole(firstRole.id);
          }
        },
        error: () => {
          this.loading.set(false);
          this.hasPageError.set(true);
        }
      });
  }

  private loadRoleSelection(roleId: string): void {
    this.loadingSelection.set(true);
    this.hasSelectionError.set(false);
    this.selectedRole.set(null);

    this.selectionSubscription?.unsubscribe();
    this.selectionSubscription = forkJoin({
      role: this.rolePermissionMatrixService.findRole(roleId),
      permissions: this.rolePermissionMatrixService.findAssignedPermissions(roleId)
    }).subscribe({
      next: ({ role, permissions }) => {
        const permissionIds = new Set(permissions.map((permission) => permission.id));
        this.selectedRole.set(role);
        this.initialPermissionIds.set(permissionIds);
        this.selectedPermissionIds.set(new Set(permissionIds));
        this.loadingSelection.set(false);
      },
      error: () => {
        this.selectedRole.set(null);
        this.initialPermissionIds.set(new Set());
        this.selectedPermissionIds.set(new Set());
        this.loadingSelection.set(false);
        this.hasSelectionError.set(true);
      }
    });
  }

  private buildMatrixRows(): readonly RolePermissionMatrixRow[] {
    const role = this.selectedRole();
    if (!role) {
      return [];
    }

    const tenantPermissions = this.permissionCatalog()
      .filter((permission) => permission.tenantId === role.tenant.id)
      .map((permission) => ({
        permission,
        parsedCode: this.parsePermissionCode(permission.code)
      }))
      .filter(
        (entry): entry is { permission: RolePermissionMatrixPermission; parsedCode: ParsedRolePermissionCode } =>
          entry.parsedCode !== null &&
          entry.parsedCode.scope === 'TENANT' &&
          VISIBLE_RESOURCES.has(entry.parsedCode.resource) &&
          this.isVisibleAction(entry.parsedCode.action)
      );

    const scopeByResource = new Map<RolePermissionResourceCode, Set<RolePermissionScopeCode>>();
    for (const entry of tenantPermissions) {
      const scopes = scopeByResource.get(entry.parsedCode.resource) ?? new Set<RolePermissionScopeCode>();
      scopes.add(entry.parsedCode.scope);
      scopeByResource.set(entry.parsedCode.resource, scopes);
    }

    const rowsByKey = new Map<string, RolePermissionMatrixRow>();
    for (const entry of tenantPermissions) {
      const action = entry.parsedCode.action;
      if (!this.isVisibleAction(action)) {
        continue;
      }

      const hasScopeCollision = (scopeByResource.get(entry.parsedCode.resource)?.size ?? 0) > 1;
      const rowKey = hasScopeCollision
        ? `${entry.parsedCode.scope}.${entry.parsedCode.resource}`
        : entry.parsedCode.resource;
      const existingRow = rowsByKey.get(rowKey) ?? {
        key: rowKey,
        moduleKey: MODULE_LABELS[entry.parsedCode.resource],
        scopeKey: hasScopeCollision ? SCOPE_LABELS[entry.parsedCode.scope] : null,
        permissions: {
          READ: null,
          CREATE: null,
          UPDATE: null,
          DELETE: null
        }
      };

      existingRow.permissions[action] = entry.permission;
      rowsByKey.set(rowKey, existingRow);
    }

    return Array.from(rowsByKey.values()).sort((left, right) => {
      const leftPermission = this.firstPermission(left);
      const rightPermission = this.firstPermission(right);

      const leftResourceIndex = this.resourceOrderIndex.get(leftPermission?.resource ?? 'TENANT') ?? Number.MAX_SAFE_INTEGER;
      const rightResourceIndex = this.resourceOrderIndex.get(rightPermission?.resource ?? 'TENANT') ?? Number.MAX_SAFE_INTEGER;
      if (leftResourceIndex !== rightResourceIndex) {
        return leftResourceIndex - rightResourceIndex;
      }

      const leftScope = leftPermission?.scope ?? 'TENANT';
      const rightScope = rightPermission?.scope ?? 'TENANT';
      if (leftScope !== rightScope) {
        return leftScope.localeCompare(rightScope);
      }

      return left.key.localeCompare(right.key);
    });
  }

  private firstPermission(row: RolePermissionMatrixRow): ParsedRolePermissionCode | null {
    for (const action of ROLE_PERMISSION_VISIBLE_ACTIONS) {
      const permission = row.permissions[action];
      if (permission) {
        return this.parsePermissionCode(permission.code);
      }
    }

    return null;
  }

  private parsePermissionCode(code: string): ParsedRolePermissionCode | null {
    const parts = code.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [scope, resource, action] = parts;
    if (!this.isScope(scope) || !this.isResource(resource) || !this.isAction(action)) {
      return null;
    }

    return {
      scope,
      resource,
      action
    };
  }

  private isVisibleAction(action: RolePermissionActionCode): action is RolePermissionVisibleAction {
    return action !== 'MANAGE';
  }

  private isScope(value: string): value is RolePermissionScopeCode {
    return value === 'PLATFORM' || value === 'TENANT';
  }

  private isResource(value: string): value is RolePermissionResourceCode {
    return value in MODULE_LABELS;
  }

  private isAction(value: string): value is RolePermissionActionCode {
    return value === 'READ' || value === 'CREATE' || value === 'UPDATE' || value === 'DELETE' || value === 'MANAGE';
  }

  private samePermissionSet(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
    if (left.size !== right.size) {
      return false;
    }

    for (const permissionId of left) {
      if (!right.has(permissionId)) {
        return false;
      }
    }

    return true;
  }
}
