import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
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
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
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
      disabled: () => this.loading()
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      disabled: () => this.loading()
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<UserAdministrationPage<UserAdministrationUserListItem>>(EMPTY_USER_ADMIN_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_USER_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly tenantId = signal<string | null>(null);
  protected readonly viewScopeKey = signal<I18nKey>('userAdministration.scope.tenant');
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(
    () => this.appliedSearch() ? 'userAdministration.table.noResults' : 'userAdministration.table.empty'
  );

  constructor() {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected createUser(): void {
    void this.router.navigate(['/admin/users/new']);
  }

  protected handleRowAction(event: UserAdministrationRowActionEvent): void {
    const user = event.row as UserAdministrationUserListItem;
    if (event.action.id === 'view') {
      void this.router.navigate(['/admin/users', user.id]);
      return;
    }

    if (event.action.id === 'edit') {
      void this.router.navigate(['/admin/users', user.id, 'edit']);
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
          const platformScope = user.userType.startsWith('PLATFORM_');
          const tenantId = platformScope ? null : user.tenantId;
          this.tenantId.set(tenantId);
          this.viewScopeKey.set(platformScope ? 'userAdministration.scope.platform' : 'userAdministration.scope.tenant');
          return this.userAdministrationService.findUsers(tenantId, this.buildQuery());
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
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
}
