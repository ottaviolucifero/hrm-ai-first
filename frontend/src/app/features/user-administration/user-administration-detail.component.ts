import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, finalize } from 'rxjs';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  UserAdministrationRole,
  UserAdministrationTenantAccess,
  UserAdministrationUserDetail
} from './user-administration.models';
import { UserAdministrationService } from './user-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

@Component({
  selector: 'app-user-administration-detail',
  imports: [AppButtonComponent],
  templateUrl: './user-administration-detail.component.html',
  styleUrl: './user-administration-detail.component.scss'
})
export class UserAdministrationDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private roleLoadSubscription?: Subscription;
  private roleMutationSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly user = signal<UserAdministrationUserDetail | null>(null);
  protected readonly selectedTenantId = signal<string | null>(null);
  protected readonly selectedRoleId = signal('');
  protected readonly roleLoading = signal(false);
  protected readonly roleSaving = signal(false);
  protected readonly roleError = signal(false);
  protected readonly assignedRoles = signal<readonly UserAdministrationRole[]>([]);
  protected readonly availableRoles = signal<readonly UserAdministrationRole[]>([]);
  protected readonly roleTenantOptions = computed(() => this.buildTenantOptions(this.user()));
  protected readonly canAssignRole = computed(() =>
    Boolean(this.user() && this.selectedTenantId() && this.selectedRoleId()) && !this.roleLoading() && !this.roleSaving()
  );

  constructor() {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.roleLoadSubscription?.unsubscribe();
    this.roleMutationSubscription?.unsubscribe();
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/users']);
  }

  protected retry(): void {
    this.loadUser();
  }

  protected selectRoleTenant(event: Event): void {
    const tenantId = (event.target as HTMLSelectElement).value;
    this.selectedTenantId.set(tenantId || null);
    this.selectedRoleId.set('');
    this.loadRoleManagement();
  }

  protected selectRoleForAssignment(event: Event): void {
    this.selectedRoleId.set((event.target as HTMLSelectElement).value);
  }

  protected assignSelectedRole(): void {
    const user = this.user();
    const tenantId = this.selectedTenantId();
    const roleId = this.selectedRoleId();
    if (!user || !tenantId || !roleId) {
      return;
    }

    this.roleSaving.set(true);
    this.roleMutationSubscription?.unsubscribe();
    this.roleMutationSubscription = this.userAdministrationService.assignRole(user.id, { tenantId, roleId })
      .pipe(finalize(() => this.roleSaving.set(false)))
      .subscribe({
        next: (roles) => {
          this.assignedRoles.set(roles);
          this.selectedRoleId.set('');
          this.notificationService.success(this.i18n.t('userAdministration.roles.feedback.assignSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadAvailableRoles(user.id, tenantId);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'userAdministration.roles.errors.assign'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected removeRole(role: UserAdministrationRole): void {
    const user = this.user();
    const tenantId = this.selectedTenantId();
    if (!user || !tenantId) {
      return;
    }

    this.roleSaving.set(true);
    this.roleMutationSubscription?.unsubscribe();
    this.roleMutationSubscription = this.userAdministrationService.removeRole(user.id, role.id, tenantId)
      .pipe(finalize(() => this.roleSaving.set(false)))
      .subscribe({
        next: () => {
          this.assignedRoles.update((roles) => roles.filter((assignedRole) => assignedRole.id !== role.id));
          this.notificationService.success(this.i18n.t('userAdministration.roles.feedback.removeSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadAvailableRoles(user.id, tenantId);
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'userAdministration.roles.errors.remove'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected identityFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.columns.displayName', value: user.displayName },
      { labelKey: 'userAdministration.columns.email', value: user.email },
      { labelKey: 'userAdministration.columns.firstName', value: this.valueOrDash(user.firstName) },
      { labelKey: 'userAdministration.columns.lastName', value: this.valueOrDash(user.lastName) },
      { labelKey: 'userAdministration.columns.userType', value: user.userType.code },
      { labelKey: 'userAdministration.detail.employee', value: user.employee ? `${user.employee.employeeCode} - ${user.employee.firstName} ${user.employee.lastName}` : this.i18n.t('userAdministration.values.none') }
    ];
  }

  protected tenantFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.tenant', value: this.referenceLabel(user.tenant) },
      { labelKey: 'userAdministration.detail.primaryTenant', value: user.primaryTenant ? this.referenceLabel(user.primaryTenant) : this.i18n.t('userAdministration.values.none') },
      { labelKey: 'userAdministration.detail.companyProfile', value: user.companyProfile ? `${user.companyProfile.code} - ${user.companyProfile.tradeName}` : this.i18n.t('userAdministration.values.none') }
    ];
  }

  protected securityFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.authenticationMethod', value: user.authenticationMethod.code },
      { labelKey: 'userAdministration.detail.preferredLanguage', value: this.valueOrDash(user.preferredLanguage) },
      { labelKey: 'userAdministration.detail.timeZone', value: user.timeZone ? this.referenceLabel(user.timeZone) : this.i18n.t('userAdministration.values.none') },
      { labelKey: 'masterData.columns.active', value: this.booleanValue(user.active) },
      { labelKey: 'userAdministration.columns.locked', value: this.booleanValue(user.locked) },
      { labelKey: 'userAdministration.detail.emailVerifiedAt', value: this.dateValue(user.emailVerifiedAt) },
      { labelKey: 'userAdministration.detail.passwordChangedAt', value: this.dateValue(user.passwordChangedAt) },
      { labelKey: 'userAdministration.detail.lastLoginAt', value: this.dateValue(user.lastLoginAt) },
      { labelKey: 'userAdministration.detail.failedLoginAttempts', value: String(user.failedLoginAttempts) },
      { labelKey: 'userAdministration.detail.emailOtpEnabled', value: this.booleanValue(user.emailOtpEnabled) },
      { labelKey: 'userAdministration.detail.appOtpEnabled', value: this.booleanValue(user.appOtpEnabled) },
      { labelKey: 'masterData.columns.strongAuthRequired', value: this.booleanValue(user.strongAuthenticationRequired) }
    ];
  }

  protected auditFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.createdAt', value: this.dateValue(user.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.dateValue(user.updatedAt) }
    ];
  }

  private loadUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.hasError.set(true);
      return;
    }

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.userAdministrationService.findUserById(userId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.selectedTenantId.set(this.defaultRoleTenantId(user));
          this.loadRoleManagement();
        },
        error: () => {
          this.user.set(null);
          this.assignedRoles.set([]);
          this.availableRoles.set([]);
          this.hasError.set(true);
        }
      });
  }

  private loadRoleManagement(): void {
    const user = this.user();
    const tenantId = this.selectedTenantId();
    if (!user || !tenantId) {
      this.assignedRoles.set([]);
      this.availableRoles.set([]);
      return;
    }

    this.roleLoadSubscription?.unsubscribe();
    this.roleLoading.set(true);
    this.roleError.set(false);
    this.roleLoadSubscription = forkJoin({
      assignedRoles: this.userAdministrationService.findAssignedRoles(user.id, tenantId),
      availableRoles: this.userAdministrationService.findAvailableRoles(user.id, tenantId)
    })
      .pipe(finalize(() => this.roleLoading.set(false)))
      .subscribe({
        next: ({ assignedRoles, availableRoles }) => {
          this.assignedRoles.set(assignedRoles);
          this.availableRoles.set(availableRoles);
        },
        error: () => {
          this.assignedRoles.set([]);
          this.availableRoles.set([]);
          this.roleError.set(true);
        }
      });
  }

  private loadAvailableRoles(userId: string, tenantId: string): void {
    this.userAdministrationService.findAvailableRoles(userId, tenantId)
      .subscribe({
        next: (roles) => this.availableRoles.set(roles),
        error: () => this.roleError.set(true)
      });
  }

  private defaultRoleTenantId(user: UserAdministrationUserDetail): string {
    const activeAccess = user.tenantAccesses.find((access) => access.active && access.tenantId === user.tenant.id)
      ?? user.tenantAccesses.find((access) => access.active);
    return activeAccess?.tenantId ?? user.tenant.id;
  }

  private buildTenantOptions(user: UserAdministrationUserDetail | null): readonly UserAdministrationTenantAccess[] {
    if (!user) {
      return [];
    }

    const activeAccesses = user.tenantAccesses.filter((access) => access.active);
    if (activeAccesses.some((access) => access.tenantId === user.tenant.id)) {
      return activeAccesses;
    }

    return [
      {
        id: user.tenant.id,
        tenantId: user.tenant.id,
        tenantCode: user.tenant.code,
        tenantName: user.tenant.name,
        accessRole: user.userType.code,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      ...activeAccesses
    ];
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    const response = error instanceof HttpErrorResponse
      ? error
      : (error as { error?: { message?: unknown; validationErrors?: unknown } });

    const validationErrors = response.error?.validationErrors;
    if (validationErrors && typeof validationErrors === 'object') {
      const messages = Object.values(validationErrors as Record<string, unknown>)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    const apiMessage = response.error?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    return this.i18n.t(fallbackKey);
  }

  private referenceLabel(reference: { code: string; name: string }): string {
    return `${reference.code} - ${reference.name}`;
  }

  private booleanValue(value: boolean): string {
    return value ? this.i18n.t('dataTable.boolean.yes') : this.i18n.t('dataTable.boolean.no');
  }

  private dateValue(value: string | null): string {
    if (!value) {
      return this.i18n.t('userAdministration.values.none');
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(parsedDate);
  }

  private valueOrDash(value: string | null): string {
    return value?.trim() ? value : this.i18n.t('userAdministration.values.none');
  }
}
