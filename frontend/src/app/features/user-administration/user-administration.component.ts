import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_USER_ADMIN_PAGE_SIZE,
  EMPTY_USER_ADMIN_PAGE,
  UserAdministrationColumn,
  UserAdministrationPage,
  UserAdministrationQuery,
  UserAdministrationRowAction,
  UserAdministrationRowActionEvent,
  UserAdministrationUserListItem
} from './user-administration.models';
import { UserAdministrationService } from './user-administration.service';

@Component({
  selector: 'app-user-administration',
  imports: [AppButtonComponent, DataTableComponent],
  templateUrl: './user-administration.component.html',
  styleUrl: './user-administration.component.scss'
})
export class UserAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private deleteSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadUsers();
    });

  protected readonly columns = computed<readonly UserAdministrationColumn[]>(() => [
    {
      key: 'displayName',
      labelKey: 'userAdministration.columns.displayName',
      minWidth: '14rem'
    },
    {
      key: 'email',
      labelKey: 'userAdministration.columns.email',
      minWidth: '16rem'
    },
    {
      key: 'employeeDisplayName',
      labelKey: 'userAdministration.columns.employeeLink',
      minWidth: '13rem',
      formatter: (_value, row) => this.formatEmployeeLink(row as UserAdministrationUserListItem)
    },
    {
      key: 'userType.code',
      labelKey: 'userAdministration.columns.userType',
      minWidth: '10rem'
    },
    {
      key: 'tenant.name',
      labelKey: 'masterData.columns.tenant',
      minWidth: '12rem'
    },
    {
      key: 'active',
      labelKey: 'masterData.columns.active',
      type: 'boolean',
      minWidth: '7rem'
    },
    {
      key: 'locked',
      labelKey: 'userAdministration.columns.locked',
      type: 'boolean',
      minWidth: '7rem'
    },
    {
      key: 'roles',
      labelKey: 'nav.roles',
      minWidth: '14rem',
      formatter: (_value, row) => this.formatRoles(row as UserAdministrationUserListItem)
    },
    {
      key: 'tenantAccesses',
      labelKey: 'userAdministration.columns.tenantAccesses',
      minWidth: '14rem',
      formatter: (_value, row) => this.formatTenantAccesses(row as UserAdministrationUserListItem)
    },
    {
      key: 'updatedAt',
      labelKey: 'masterData.columns.updatedAt',
      type: 'datetime',
      minWidth: '9rem'
    }
  ]);
  protected readonly rowActions = computed<readonly UserAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: () => this.loading() || !this.modulePermissions().canView
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      disabled: () => this.loading() || this.deleting() || !this.modulePermissions().canUpdate
    },
    {
      id: 'deactivate',
      labelKey: 'userAdministration.lifecycle.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'userAdministration.lifecycle.deactivate.confirmTitle',
        messageKey: 'userAdministration.lifecycle.deactivate.confirmMessage',
        confirmLabelKey: 'userAdministration.lifecycle.deactivate.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as UserAdministrationUserListItem)
      },
      disabled: () => this.loading() || this.deleting() || !this.modulePermissions().canUpdate
    },
    {
      id: 'deletePhysical',
      labelKey: 'userAdministration.actions.deletePhysical',
      tone: 'danger',
      confirmation: {
        titleKey: 'userAdministration.deletePhysical.confirmTitle',
        messageKey: 'userAdministration.deletePhysical.confirmMessage',
        confirmLabelKey: 'userAdministration.deletePhysical.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as UserAdministrationUserListItem)
      },
      disabled: () => this.loading() || this.deleting() || !this.modulePermissions().canDelete
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<UserAdministrationPage<UserAdministrationUserListItem>>(EMPTY_USER_ADMIN_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_USER_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly deleting = signal(false);
  protected readonly hasError = signal(false);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly tenantId = signal<string | null>(null);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(
    () => this.appliedSearch() ? 'userAdministration.table.noResults' : 'userAdministration.table.empty'
  );

  constructor() {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected createUser(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }

    void this.router.navigate(['/admin/users/new']);
  }

  protected handleRowAction(event: UserAdministrationRowActionEvent): void {
    if ((event.action.id === 'view' && !this.modulePermissions().canView)
      || (event.action.id === 'edit' && !this.modulePermissions().canUpdate)
      || (event.action.id === 'deactivate' && !this.modulePermissions().canUpdate)
      || (event.action.id === 'deletePhysical' && !this.modulePermissions().canDelete)) {
      return;
    }

    const user = event.row as UserAdministrationUserListItem;
    if (event.action.id === 'view') {
      void this.router.navigate(['/admin/users', user.id]);
      return;
    }

    if (event.action.id === 'edit') {
      void this.router.navigate(['/admin/users', user.id, 'edit']);
      return;
    }

    if (event.action.id === 'deactivate') {
      this.deactivateUser(user.id);
      return;
    }

    if (event.action.id === 'deletePhysical') {
      this.deleteUserPhysically(user.id);
    }
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadUsers();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadUsers();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadUsers();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'users'));
          const platformScope = user.userType.startsWith('PLATFORM_');
          const tenantId = platformScope ? null : user.tenantId;
          this.tenantId.set(tenantId);
          return this.userAdministrationService.findUsers(tenantId, this.buildQuery());
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private buildQuery(): UserAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): UserAdministrationPage<UserAdministrationUserListItem> {
    return {
      ...EMPTY_USER_ADMIN_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private formatRoles(user: UserAdministrationUserListItem): string {
    if (user.roles.length === 0) {
      return this.i18n.t('userAdministration.values.none');
    }

    return user.roles.map((role) => role.code).join(', ');
  }

  private formatTenantAccesses(user: UserAdministrationUserListItem): string {
    if (user.tenantAccesses.length === 0) {
      return this.i18n.t('userAdministration.values.none');
    }

    return user.tenantAccesses
      .map((access) => `${access.tenantCode}: ${access.accessRole}`)
      .join(', ');
  }

  private formatEmployeeLink(user: UserAdministrationUserListItem): string {
    if (!user.hasEmployeeLink) {
      return this.i18n.t('userAdministration.values.noEmployeeAssociated');
    }

    const displayName = user.employeeDisplayName?.trim();
    return displayName || this.i18n.t('userAdministration.values.employeeLinked');
  }

  private deactivateUser(userId: string): void {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.deleteSubscription?.unsubscribe();
    this.deleteSubscription = this.userAdministrationService.deactivateUser(userId)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.handleSuccessfulMutation('userAdministration.lifecycle.deactivate.success');
        },
        error: (error) => {
          this.notificationService.error(this.resolveDeactivateErrorMessage(error), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteUserPhysically(userId: string): void {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.deleteSubscription?.unsubscribe();
    this.deleteSubscription = this.userAdministrationService.deleteUser(userId)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.handleSuccessfulMutation('userAdministration.deletePhysical.feedback.success');
        },
        error: (error) => {
          this.notificationService.error(this.resolveDeleteErrorMessage(error), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private resolveDeactivateErrorMessage(error: unknown): string {
    return resolveApiErrorMessage(this.i18n, error, {
      fallbackKey: 'userAdministration.deactivate.error.generic',
      statusKeys: {
        401: 'userAdministration.deactivate.error.unauthorized',
        403: 'userAdministration.deactivate.error.forbidden',
        404: 'userAdministration.deactivate.error.notFound'
      }
    });
  }

  private resolveDeleteErrorMessage(error: unknown): string {
    return resolveApiErrorMessage(this.i18n, error, {
      fallbackKey: 'userAdministration.deletePhysical.error.generic',
      statusKeys: {
        401: 'userAdministration.deletePhysical.error.unauthorized',
        403: 'userAdministration.deletePhysical.error.forbidden',
        404: 'userAdministration.deletePhysical.error.notFound',
        409: 'userAdministration.deletePhysical.error.conflict'
      }
    });
  }

  private handleSuccessfulMutation(successKey: I18nKey): void {
    if (this.rows().length === 1 && this.pageIndex() > 0) {
      this.pageIndex.update((page) => Math.max(0, page - 1));
    }
    this.notificationService.success(this.i18n.t(successKey), {
      titleKey: 'alert.title.success'
    });
    this.loadUsers();
  }

  private confirmationTarget(user: UserAdministrationUserListItem): string {
    const displayName = user.displayName.trim();
    if (displayName.length > 0) {
      return displayName;
    }

    return user.email.trim();
  }
}
