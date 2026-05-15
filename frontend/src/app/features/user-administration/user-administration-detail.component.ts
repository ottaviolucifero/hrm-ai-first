import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, forkJoin, finalize, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { LookupSelectComponent } from '../../shared/components/lookup-select/lookup-select.component';
import { PasswordFieldComponent } from '../../shared/form-fields/password-field.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import { LookupOption } from '../../shared/lookup/lookup.models';
import {
  UserAdministrationRole,
  UserPasswordResetResponse,
  UserAdministrationTenantAccess,
  UserAdministrationUserDetail
} from './user-administration.models';
import { UserAdministrationService } from './user-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

type SecurityStatusVariant = 'default' | 'success' | 'warning';

interface SecurityStatusField extends ReadOnlyField {
  readonly variant: SecurityStatusVariant;
}

type UserLifecycleAction = 'activate' | 'deactivate' | 'lock' | 'unlock';

@Component({
  selector: 'app-user-administration-detail',
  imports: [AppButtonComponent, LookupSelectComponent, PasswordFieldComponent, ReactiveFormsModule],
  templateUrl: './user-administration-detail.component.html',
  styleUrl: './user-administration-detail.component.scss'
})
export class UserAdministrationDetailComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private roleLoadSubscription?: Subscription;
  private roleMutationSubscription?: Subscription;
  private passwordMutationSubscription?: Subscription;
  private lifecycleMutationSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly user = signal<UserAdministrationUserDetail | null>(null);
  protected readonly selectedTenantId = signal<string | null>(null);
  protected readonly selectedRoleId = signal('');
  protected readonly roleLoading = signal(false);
  protected readonly roleSaving = signal(false);
  protected readonly roleError = signal(false);
  protected readonly passwordSaving = signal(false);
  protected readonly lifecycleSaving = signal(false);
  protected readonly pendingLifecycleAction = signal<UserLifecycleAction | null>(null);
  protected readonly assignedRoles = signal<readonly UserAdministrationRole[]>([]);
  protected readonly availableRoles = signal<readonly UserAdministrationRole[]>([]);
  protected readonly roleTenantOptions = computed(() => this.buildTenantOptions(this.user()));
  protected readonly roleTenantLookupOptions = computed<readonly LookupOption[]>(() =>
    this.roleTenantOptions().map((access) => ({
      id: access.tenantId,
      code: access.tenantCode,
      name: access.tenantName
    })));
  protected readonly availableRoleLookupOptions = computed<readonly LookupOption[]>(() =>
    this.availableRoles().map((role) => ({
      id: role.id,
      code: role.code,
      name: role.name
    })));
  protected readonly canAssignRole = computed(() =>
    Boolean(this.user() && this.selectedTenantId() && this.selectedRoleId()) && !this.roleLoading() && !this.roleSaving()
  );
  protected readonly tenantLookupClosedLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly tenantLookupOptionLabelBuilder = (option: LookupOption): string => `${option.name} (${option.code})`;
  protected readonly roleLookupClosedLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly roleLookupOptionLabelBuilder = (option: LookupOption): string => `${option.code} - ${option.name}`;
  protected readonly passwordForm = this.formBuilder.group({
    newPassword: ['', [Validators.required, Validators.maxLength(255)]],
    confirmPassword: ['', [Validators.required]]
  });
  protected readonly canResetPassword = computed(() => {
    const user = this.user();
    const tenantId = this.selectedTenantId();
    return Boolean(user && tenantId) && !this.passwordSaving();
  });
  protected readonly hasPendingLifecycleAction = computed(() => this.pendingLifecycleAction() !== null);

  protected detailTitle(user: UserAdministrationUserDetail | null): string {
    const displayName = user?.displayName?.trim();
    return displayName || this.i18n.t('userAdministration.detail.title');
  }

  protected shouldShowEmailSubtitle(user: UserAdministrationUserDetail | null): boolean {
    if (!user) {
      return false;
    }

    const displayName = user.displayName?.trim();
    const email = user.email?.trim();
    return Boolean(email) && Boolean(displayName) && displayName.toLocaleLowerCase() !== email.toLocaleLowerCase();
  }

  protected selectedRoleTenantLabel(): string {
    const tenantId = this.selectedTenantId();
    const tenant = this.roleTenantOptions().find((access) => access.tenantId === tenantId) ?? this.roleTenantOptions()[0];
    if (!tenant) {
      return this.i18n.t('userAdministration.values.none');
    }

    const tenantName = tenant.tenantName?.trim();
    const tenantCode = tenant.tenantCode?.trim();
    if (tenantName && tenantCode) {
      return `${tenantName} (${tenantCode})`;
    }

    return tenantName || tenantCode || this.i18n.t('userAdministration.values.none');
  }

  constructor() {
    this.loadPermissionSummary();
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.roleLoadSubscription?.unsubscribe();
    this.roleMutationSubscription?.unsubscribe();
    this.passwordMutationSubscription?.unsubscribe();
    this.lifecycleMutationSubscription?.unsubscribe();
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/users']);
  }

  protected editUser(): void {
    const user = this.user();
    if (!user || !this.modulePermissions().canUpdate) {
      return;
    }

    void this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  protected retry(): void {
    this.loadUser();
  }

  protected selectRoleTenant(value: string | Event | LookupOption | null): void {
    const tenantId = this.lookupValue(value);
    this.selectedTenantId.set(tenantId || null);
    this.selectedRoleId.set('');
    this.loadRoleManagement();
  }

  protected selectRoleForAssignment(value: string | Event | LookupOption | null): void {
    this.selectedRoleId.set(this.lookupValue(value));
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

  protected resetPassword(): void {
    const user = this.user();
    const tenantId = this.selectedTenantId();
    if (!user || !tenantId) {
      return;
    }

    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid || this.hasPasswordConfirmationMismatch()) {
      return;
    }

    const newPassword = this.passwordForm.controls.newPassword.getRawValue().trim();
    this.passwordSaving.set(true);
    this.passwordMutationSubscription?.unsubscribe();
    this.passwordMutationSubscription = this.userAdministrationService.resetPassword(user.id, { tenantId, newPassword })
      .pipe(finalize(() => this.passwordSaving.set(false)))
      .subscribe({
        next: (response) => {
          this.applyPasswordResetResponse(response);
          this.passwordForm.reset();
          this.notificationService.success(this.i18n.t('userAdministration.password.feedback.success'), {
            titleKey: 'alert.title.success'
          });
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'userAdministration.password.errors.reset'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  protected triggerActiveAction(): void {
    const user = this.user();
    if (!user || this.lifecycleSaving()) {
      return;
    }

    const action: UserLifecycleAction = user.active ? 'deactivate' : 'activate';
    if (this.requiresLifecycleConfirmation(action)) {
      this.pendingLifecycleAction.set(action);
      return;
    }

    this.executeLifecycleAction(action);
  }

  protected triggerLockAction(): void {
    const user = this.user();
    if (!user || this.lifecycleSaving()) {
      return;
    }

    const action: UserLifecycleAction = user.locked ? 'unlock' : 'lock';
    if (this.requiresLifecycleConfirmation(action)) {
      this.pendingLifecycleAction.set(action);
      return;
    }

    this.executeLifecycleAction(action);
  }

  protected cancelLifecycleAction(): void {
    this.pendingLifecycleAction.set(null);
  }

  protected confirmLifecycleAction(): void {
    const action = this.pendingLifecycleAction();
    if (!action) {
      return;
    }

    this.executeLifecycleAction(action);
  }

  protected activeActionLabel(user: UserAdministrationUserDetail): string {
    return this.i18n.t(user.active
      ? 'userAdministration.lifecycle.actions.deactivate'
      : 'userAdministration.lifecycle.actions.activate');
  }

  protected activeActionLoadingLabel(user: UserAdministrationUserDetail): string {
    return this.i18n.t(user.active
      ? 'userAdministration.lifecycle.actions.deactivating'
      : 'userAdministration.lifecycle.actions.activating');
  }

  protected activeActionVariant(user: UserAdministrationUserDetail): 'primary' | 'destructive' {
    return user.active ? 'destructive' : 'primary';
  }

  protected activeActionIcon(user: UserAdministrationUserDetail): string {
    return user.active ? 'ki-filled ki-cross-circle' : 'ki-filled ki-check-circle';
  }

  protected lockActionLabel(user: UserAdministrationUserDetail): string {
    return this.i18n.t(user.locked
      ? 'userAdministration.lifecycle.actions.unlock'
      : 'userAdministration.lifecycle.actions.lock');
  }

  protected lockActionLoadingLabel(user: UserAdministrationUserDetail): string {
    return this.i18n.t(user.locked
      ? 'userAdministration.lifecycle.actions.unlocking'
      : 'userAdministration.lifecycle.actions.locking');
  }

  protected lockActionVariant(user: UserAdministrationUserDetail): 'primary' | 'destructive' {
    return user.locked ? 'primary' : 'destructive';
  }

  protected lockActionIcon(user: UserAdministrationUserDetail): string {
    return user.locked ? 'ki-filled ki-lock-2-open' : 'ki-filled ki-lock';
  }

  protected lifecycleConfirmTitle(): string {
    const action = this.pendingLifecycleAction();
    return action ? this.i18n.t(this.lifecycleKey(action, 'confirmTitle')) : '';
  }

  protected lifecycleConfirmMessage(): string {
    const action = this.pendingLifecycleAction();
    return action ? this.i18n.t(this.lifecycleKey(action, 'confirmMessage')) : '';
  }

  protected lifecycleConfirmActionLabel(): string {
    const action = this.pendingLifecycleAction();
    return action ? this.i18n.t(this.lifecycleKey(action, 'confirmAction')) : '';
  }

  protected lifecycleConfirmLoadingLabel(): string {
    const action = this.pendingLifecycleAction();
    return action ? this.i18n.t(this.lifecycleKey(action, 'processing')) : '';
  }

  protected hasPasswordConfirmationMismatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    return Boolean(confirmPassword) && newPassword !== confirmPassword;
  }

  protected confirmPasswordErrorText(): string {
    return this.hasPasswordConfirmationMismatch()
      ? this.i18n.t('userAdministration.password.validation.mismatch')
      : '';
  }

  protected identityFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.columns.email', value: user.email },
      { labelKey: 'userAdministration.columns.firstName', value: this.valueOrDash(user.firstName) },
      { labelKey: 'userAdministration.columns.lastName', value: this.valueOrDash(user.lastName) },
      { labelKey: 'userAdministration.columns.userType', value: this.userTypeValue(user.userType) },
      { labelKey: 'userAdministration.columns.employeeLink', value: this.employeeLinkValue(user) }
    ];
  }

  protected tenantFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    const fields: ReadOnlyField[] = [
      { labelKey: 'userAdministration.detail.membershipTenant', value: this.referenceNameWithCode(user.tenant) }
    ];

    if (user.primaryTenant && user.primaryTenant.id !== user.tenant.id) {
      fields.push({
        labelKey: 'userAdministration.detail.primaryTenant',
        value: this.referenceNameWithCode(user.primaryTenant)
      });
    }

    fields.push({
      labelKey: 'userAdministration.detail.companyProfile',
      value: user.companyProfile ? this.companyProfileLabel(user.companyProfile) : this.i18n.t('userAdministration.values.none')
    });

    return fields;
  }

  protected authenticationMethodField(user: UserAdministrationUserDetail): ReadOnlyField {
    return {
      labelKey: 'userAdministration.detail.authenticationMethod',
      value: this.authenticationMethodValue(user.authenticationMethod)
    };
  }

  protected securityStatusFields(user: UserAdministrationUserDetail): readonly SecurityStatusField[] {
    return [
      { labelKey: 'masterData.columns.active', value: this.booleanValue(user.active), variant: user.active ? 'success' : 'default' },
      { labelKey: 'userAdministration.columns.locked', value: this.booleanValue(user.locked), variant: user.locked ? 'warning' : 'default' },
      { labelKey: 'userAdministration.detail.emailVerifiedAt', value: this.dateValue(user.emailVerifiedAt, 'userAdministration.values.never'), variant: 'default' },
      { labelKey: 'userAdministration.detail.lastLoginAt', value: this.dateValue(user.lastLoginAt, 'userAdministration.values.never'), variant: user.lastLoginAt ? 'warning' : 'default' },
      { labelKey: 'userAdministration.detail.passwordChangedAt', value: this.dateValue(user.passwordChangedAt, 'userAdministration.values.never'), variant: 'default' },
      { labelKey: 'userAdministration.detail.failedLoginAttempts', value: String(user.failedLoginAttempts), variant: 'default' }
    ];
  }

  protected securitySecondaryFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
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

  private loadPermissionSummary(): void {
    this.authService.loadAuthenticatedUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'users')),
        error: () => this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY)
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

  private executeLifecycleAction(action: UserLifecycleAction): void {
    const user = this.user();
    if (!user) {
      return;
    }

    this.lifecycleSaving.set(true);
    this.lifecycleMutationSubscription?.unsubscribe();
    this.lifecycleMutationSubscription = this.lifecycleRequest(user.id, action)
      .pipe(finalize(() => this.lifecycleSaving.set(false)))
      .subscribe({
        next: (updatedUser) => {
          this.user.set(updatedUser);
          this.pendingLifecycleAction.set(null);
          this.notificationService.success(this.i18n.t(this.lifecycleKey(action, 'success')), {
            titleKey: 'alert.title.success'
          });
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, this.lifecycleKey(action, 'error')), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
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

  private lookupValue(value: string | Event | LookupOption | null): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if ('id' in value) {
      return value.id;
    }

    return (value.target as HTMLSelectElement).value;
  }

  private applyPasswordResetResponse(response: UserPasswordResetResponse): void {
    this.user.update((currentUser) => {
      if (!currentUser || currentUser.id !== response.userId) {
        return currentUser;
      }

      return {
        ...currentUser,
        passwordChangedAt: response.passwordChangedAt,
        locked: response.locked,
        failedLoginAttempts: response.failedLoginAttempts
      };
    });
  }

  private lifecycleRequest(userId: string, action: UserLifecycleAction): Observable<UserAdministrationUserDetail> {
    switch (action) {
      case 'activate':
        return this.userAdministrationService.activateUser(userId);
      case 'deactivate':
        return this.userAdministrationService.deactivateUser(userId);
      case 'lock':
        return this.userAdministrationService.lockUser(userId);
      case 'unlock':
        return this.userAdministrationService.unlockUser(userId);
    }
  }

  private requiresLifecycleConfirmation(action: UserLifecycleAction): boolean {
    return action === 'deactivate' || action === 'lock';
  }

  private lifecycleKey(
    action: UserLifecycleAction,
    suffix: 'confirmAction' | 'confirmMessage' | 'confirmTitle' | 'error' | 'processing' | 'success'
  ): I18nKey {
    return `userAdministration.lifecycle.${action}.${suffix}` as I18nKey;
  }

  private resolveApiMessage(error: unknown, fallbackKey: I18nKey): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey });
  }

  private userTypeValue(reference: { code: string; name: string } | null): string {
    const code = reference?.code?.trim().toUpperCase();
    if (code === 'TENANT_ADMIN') {
      return this.i18n.t('userAdministration.userType.tenantAdmin');
    }

    if (code === 'PLATFORM_SUPER_ADMIN') {
      return this.i18n.t('userAdministration.userType.platformSuperAdmin');
    }

    return this.referenceName(reference);
  }

  private authenticationMethodValue(reference: { code: string; name: string } | null): string {
    const code = reference?.code?.trim().toUpperCase();
    if (code === 'PASSWORD_ONLY') {
      return this.i18n.t('userAdministration.authenticationMethod.passwordOnly');
    }

    return this.referenceName(reference);
  }

  private referenceName(reference: { code: string; name: string } | null): string {
    if (!reference) {
      return this.i18n.t('userAdministration.values.none');
    }

    const name = reference.name?.trim();
    const code = reference.code?.trim();
    return name || code || this.i18n.t('userAdministration.values.none');
  }

  private referenceNameWithCode(reference: { code: string; name: string }): string {
    const name = reference.name?.trim();
    const code = reference.code?.trim();
    if (name && code) {
      return `${name} (${code})`;
    }

    return name || code || this.i18n.t('userAdministration.values.none');
  }

  private companyProfileLabel(companyProfile: { code: string; legalName: string; tradeName: string }): string {
    const primaryName = companyProfile.tradeName?.trim() || companyProfile.legalName?.trim();
    const code = companyProfile.code?.trim();
    if (primaryName && code) {
      return `${primaryName} (${code})`;
    }

    return primaryName || code || this.i18n.t('userAdministration.values.none');
  }

  private employeeLinkValue(user: UserAdministrationUserDetail): string {
    if (!user.hasEmployeeLink || !user.employee) {
      return this.i18n.t('userAdministration.values.noEmployeeAssociated');
    }

    const displayName = user.employeeDisplayName?.trim()
      || `${user.employee.firstName} ${user.employee.lastName}`.trim();
    return displayName || user.employee.employeeCode || this.i18n.t('userAdministration.values.employeeLinked');
  }

  private booleanValue(value: boolean): string {
    return value ? this.i18n.t('dataTable.boolean.yes') : this.i18n.t('dataTable.boolean.no');
  }

  private dateValue(value: string | null, emptyValueKey: I18nKey = 'userAdministration.values.none'): string {
    if (!value) {
      return this.i18n.t(emptyValueKey);
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
