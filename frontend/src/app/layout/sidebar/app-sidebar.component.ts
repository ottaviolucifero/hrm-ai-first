import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';

import { PermissionModuleId } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';

interface SidebarNavNode {
  readonly id: string;
  readonly titleKey: I18nKey;
  readonly initial?: string;
  readonly route?: `/${string}`;
  readonly permissionModule?: PermissionModuleId;
  readonly children?: readonly SidebarNavNode[];
}

const SIDEBAR_NAVIGATION: readonly SidebarNavNode[] = [
  {
    id: 'home',
    titleKey: 'nav.home',
    initial: 'H',
    route: '/'
  },
  {
    id: 'people',
    titleKey: 'nav.people',
    initial: 'P',
    children: [
      {
        id: 'people-employees',
        titleKey: 'nav.peopleEmployees'
      }
    ]
  },
  {
    id: 'hr-operations',
    titleKey: 'nav.hrOperations',
    initial: 'O',
    children: [
      {
        id: 'hr-documents',
        titleKey: 'nav.payrollDocuments'
      },
      {
        id: 'hr-leave',
        titleKey: 'nav.leaveRequests'
      },
      {
        id: 'hr-holidays',
        titleKey: 'nav.holidayCalendar'
      }
    ]
  },
  {
    id: 'assets',
    titleKey: 'nav.assets',
    initial: 'A',
    children: [
      {
        id: 'assets-devices',
        titleKey: 'nav.devices'
      }
    ]
  },
  {
    id: 'governance',
    titleKey: 'nav.governance',
    initial: 'G',
    children: [
      {
        id: 'governance-master-data',
        titleKey: 'nav.masterData',
        route: '/master-data',
        permissionModule: 'master-data'
      },
      {
        id: 'governance-security',
        titleKey: 'nav.governanceSecurity',
        children: [
          {
            id: 'governance-security-tenants',
            titleKey: 'nav.tenants',
            route: '/admin/tenants',
            permissionModule: 'tenants'
          },
          {
            id: 'governance-security-roles',
            titleKey: 'nav.roles',
            route: '/admin/roles',
            permissionModule: 'roles'
          },
          {
            id: 'governance-security-users',
            titleKey: 'nav.users',
            route: '/admin/users',
            permissionModule: 'users'
          },
          {
            id: 'governance-security-permissions',
            titleKey: 'nav.permissions',
            route: '/admin/permissions',
            permissionModule: 'permissions'
          }
        ]
      }
    ]
  }
];

const ACTIVE_ROUTE_OPTIONS: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  matrixParams: 'ignored',
  fragment: 'ignored'
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './app-sidebar.component.html',
  styles: [
    `
      :host {
        display: flex;
        min-height: 100%;
        min-width: 0;
      }

      :host .app-sidebar-shell {
        background:
          radial-gradient(circle at top left, rgb(55 98 210 / 0.3), transparent 34%),
          linear-gradient(180deg, #001b44 0%, #061a42 54%, #091532 100%);
        border-inline-end-color: rgb(255 255 255 / 8%);
        box-shadow: 20px 0 48px rgb(1 12 38 / 24%);
        color: #f8fbff;
        min-width: 0;
        overflow: hidden;
      }

      :host .kt-sidebar-wrapper {
        min-height: 0;
        min-width: 0;
      }

      :host .app-sidebar-header {
        flex: 0 0 auto;
        min-height: 4.15rem;
        padding-block: 0.72rem;
      }

      :host .app-sidebar-logo img {
        filter: brightness(0) invert(1);
      }

      :host .app-sidebar-toggle {
        background: rgb(255 255 255 / 6%);
        border-color: rgb(255 255 255 / 10%);
        color: #dbe8ff;
        height: 2.35rem;
        width: 2.35rem;
      }

      :host .app-sidebar-toggle:hover:not(:disabled) {
        background: rgb(255 255 255 / 12%);
        border-color: rgb(255 255 255 / 18%);
        color: #ffffff;
      }

      :host .app-sidebar-content {
        box-sizing: border-box;
        min-height: 0;
        min-width: 0;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-block: 0.45rem 0.75rem;
        scrollbar-color: rgb(162 184 255 / 45%) transparent;
        scrollbar-width: thin;
      }

      :host .app-sidebar-search {
        border-bottom: 1px solid rgb(255 255 255 / 9%);
        margin-bottom: 0.32rem;
        padding: 0.62rem 1rem;
        position: sticky;
        top: 0;
        z-index: 1;
        background: linear-gradient(180deg, rgb(6 26 66 / 97%) 0%, rgb(6 26 66 / 92%) 100%);
      }

      :host .app-sidebar-search-input {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 0.72rem;
        color: #f8fbff;
        display: flex;
        gap: 0.48rem;
        min-height: 2.28rem;
        padding-inline: 0.62rem;
        width: 100%;
        transition:
          background-color 0.15s ease,
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      :host .app-sidebar-search-input:focus-within {
        background: rgb(255 255 255 / 9%);
        border-color: rgb(255 255 255 / 22%);
        box-shadow: 0 0 0 3px rgb(29 93 255 / 16%);
      }

      :host .app-sidebar-search-input i {
        color: #b8c6ff;
        font-size: 0.84rem;
      }

      :host .app-sidebar-search-input input {
        background: transparent;
        border: 0;
        color: #f8fbff;
        flex: 1;
        font-size: 0.84rem;
        min-width: 0;
        outline: none;
      }

      :host .app-sidebar-search-input input::placeholder {
        color: rgb(203 213 255 / 78%);
      }

      :host .app-sidebar-nav {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.12rem;
        min-width: 0;
        padding-bottom: 0.25rem;
        padding-inline: 0.75rem 0.95rem;
      }

      :host .app-sidebar-item {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        min-width: 0;
      }

      :host .app-sidebar-link {
        align-items: center;
        border-radius: 0.82rem;
        box-sizing: border-box;
        color: #c9d6ff;
        display: flex;
        gap: 0.65rem;
        min-height: 2.42rem;
        padding: 0.5rem 0.88rem;
        position: relative;
        text-align: left;
        transition:
          background-color 0.15s ease,
          box-shadow 0.15s ease,
          color 0.15s ease;
        width: auto;
      }

      :host .app-sidebar-link:hover:not(:disabled) {
        background: rgb(255 255 255 / 7%);
        color: #ffffff;
      }

      :host .app-sidebar-link:disabled {
        background: transparent;
        color: rgb(203 213 255 / 62%);
        cursor: not-allowed;
      }

      :host .app-sidebar-link--frozen {
        opacity: 0.74;
      }

      :host .app-sidebar-link--top {
        font-size: 0.91rem;
        font-weight: 600;
        padding-right: 1rem;
      }

      :host .app-sidebar-link--nested {
        gap: 0.56rem;
        min-height: 2.06rem;
        padding-block: 0.34rem;
        padding-left: 0.66rem;
        padding-right: 1.02rem;
        width: 100%;
      }

      :host .app-sidebar-link--deep {
        gap: 0.5rem;
        min-height: 1.96rem;
        padding-block: 0.32rem;
        padding-left: 0.58rem;
        padding-right: 0.92rem;
        width: 100%;
      }

      :host .app-sidebar-link--collapsed {
        justify-content: center;
        min-height: 2.6rem;
        padding-inline: 0.5rem;
      }

      :host .app-sidebar-link--active {
        background: linear-gradient(135deg, #1953e6 0%, #0f47cf 100%);
        box-shadow: 0 3px 8px rgb(0 85 255 / 10%);
        color: #ffffff;
      }

      :host .app-sidebar-link--branch-active {
        background: rgb(29 93 255 / 12%);
        color: #f6f9ff;
      }

      :host .app-sidebar-mark {
        align-items: center;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 0.65rem;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
        color: inherit;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 0.76rem;
        font-weight: 700;
        height: 1.72rem;
        justify-content: center;
        letter-spacing: 0.04em;
        width: 1.72rem;
      }

      :host .app-sidebar-link--active .app-sidebar-mark,
      :host .app-sidebar-link--branch-active .app-sidebar-mark {
        background: rgb(255 255 255 / 13%);
        border-color: rgb(255 255 255 / 10%);
      }

      :host .app-sidebar-link--collapsed .app-sidebar-mark {
        height: 1.8rem;
        width: 1.8rem;
      }

      :host .app-sidebar-link .app-sidebar-title {
        color: inherit;
        flex: 1;
        line-height: 1.2rem;
        min-width: 0;
      }

      :host .app-sidebar-link .app-sidebar-arrow {
        color: rgb(226 234 255 / 88%);
        font-size: 1rem;
        flex: 0 0 auto;
        margin-left: auto;
        padding-inline: 0.3rem 0.05rem;
      }

      :host .app-sidebar-link .app-sidebar-bullet {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        justify-content: center;
        width: 0.72rem;
      }

      :host .app-sidebar-link .app-sidebar-bullet > span {
        box-shadow: 0 0 0 2px rgb(255 255 255 / 5%);
      }

      :host .app-sidebar-subtree {
        border-left: 1px solid rgb(255 255 255 / 11%);
        display: flex;
        flex-direction: column;
        gap: 0.12rem;
        margin: 0.04rem 0 0.04rem 0.9rem;
        min-width: 0;
        padding-left: 0.56rem;
        position: relative;
      }

      :host .app-sidebar-link--nested .app-sidebar-bullet > span,
      :host .app-sidebar-link--deep .app-sidebar-bullet > span {
        background: rgb(174 195 255 / 90%);
      }

      :host .app-sidebar-link--nested.app-sidebar-link--active .app-sidebar-bullet > span,
      :host .app-sidebar-link--deep.app-sidebar-link--active .app-sidebar-bullet > span,
      :host .app-sidebar-link--nested.app-sidebar-link--branch-active .app-sidebar-bullet > span {
        background: #ffffff;
      }

      :host .app-sidebar-link--nested .app-sidebar-title,
      :host .app-sidebar-link--deep .app-sidebar-title {
        font-size: 0.85rem;
      }

      :host .app-sidebar-content::-webkit-scrollbar {
        width: 0.42rem;
        height: 0;
      }

      :host .app-sidebar-content::-webkit-scrollbar-track {
        background: transparent;
      }

      :host .app-sidebar-content::-webkit-scrollbar-thumb {
        background: rgb(173 190 255 / 28%);
        border: 2px solid transparent;
        border-radius: 999px;
        background-clip: padding-box;
      }

      :host .app-sidebar-content::-webkit-scrollbar-thumb:hover {
        background: rgb(196 208 255 / 38%);
        background-clip: padding-box;
      }

      :host .app-sidebar-empty {
        color: rgb(219 228 255 / 86%);
      }

      :host .app-sidebar-shell.w-20 .app-sidebar-header {
        padding-inline: 0.75rem;
      }

      :host .sidebar-focus:focus {
        outline: none;
      }

      :host .sidebar-focus:focus-visible {
        outline: 2px solid var(--ring);
        outline-offset: 2px;
      }
    `
  ]
})
export class AppSidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  @Output() readonly sidebarCollapsedChange = new EventEmitter<boolean>();

  protected readonly userPermissionState = signal<{
    readonly modules: ReadonlySet<PermissionModuleId>;
  }>({ modules: new Set<PermissionModuleId>() });
  protected readonly searchTerm = signal('');
  protected readonly sidebarCollapsed = signal(false);
  protected readonly expandedNodeIds = signal<ReadonlySet<string>>(new Set(['people', 'hr-operations', 'governance', 'governance-security']));
  protected readonly visibleNavigationTree = computed(() => {
    const query = this.normalize(this.searchTerm());
    if (!query) {
      return SIDEBAR_NAVIGATION;
    }

    return SIDEBAR_NAVIGATION
      .map((node) => this.filterNode(node, query))
      .filter((node): node is SidebarNavNode => node !== null);
  });
  protected readonly displayedNavigationTree = computed(() =>
    this.sidebarCollapsed() ? SIDEBAR_NAVIGATION : this.visibleNavigationTree()
  );

  constructor() {
    this.authService.loadAuthenticatedUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.userPermissionState.set({
            modules: new Set(
              (['master-data', 'tenants', 'roles', 'permissions', 'users'] as const)
                .filter((moduleId) => this.permissionSummaryService.hasAnyPermission(user, moduleId))
            )
          });
        },
        error: () => {
          this.userPermissionState.set({ modules: new Set<PermissionModuleId>() });
        }
      });
  }

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected toggleSidebarCollapsed(): void {
    const nextCollapsed = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(nextCollapsed);
    this.sidebarCollapsedChange.emit(nextCollapsed);
  }

  protected hasChildren(node: SidebarNavNode): boolean {
    return Boolean(node.children?.length);
  }

  protected isNodeHighlighted(node: SidebarNavNode): boolean {
    return this.isActiveRoute(node) || this.hasActiveDescendant(node);
  }

  protected isExpanded(node: SidebarNavNode): boolean {
    if (this.sidebarCollapsed()) {
      return false;
    }

    return this.searchTerm().trim().length > 0 || this.expandedNodeIds().has(node.id);
  }

  protected toggleNode(node: SidebarNavNode): void {
    if (!this.hasChildren(node)) {
      return;
    }

    this.expandedNodeIds.update((expandedNodeIds) => {
      const nextExpandedNodeIds = new Set(expandedNodeIds);
      if (nextExpandedNodeIds.has(node.id)) {
        nextExpandedNodeIds.delete(node.id);
      } else {
        nextExpandedNodeIds.add(node.id);
      }
      return nextExpandedNodeIds;
    });
  }

  protected isActiveRoute(node: SidebarNavNode): boolean {
    return node.route ? this.router.isActive(node.route, ACTIVE_ROUTE_OPTIONS) : false;
  }

  protected hasActiveDescendant(node: SidebarNavNode): boolean {
    return Boolean(node.children?.some((childNode) => this.isActiveRoute(childNode) || this.hasActiveDescendant(childNode)));
  }

  protected canNavigate(node: SidebarNavNode): boolean {
    if (!node.route || !node.permissionModule) {
      return Boolean(node.route);
    }

    return this.userPermissionState().modules.has(node.permissionModule);
  }

  protected isFrozen(node: SidebarNavNode): boolean {
    return Boolean(node.route && node.permissionModule) && !this.canNavigate(node);
  }

  protected frozenTitle(node: SidebarNavNode): string {
    return `${this.nodeTitle(node)} - ${this.i18n.t('authorization.sidebar.frozenTitle')}`;
  }

  protected navigationInitial(node: SidebarNavNode): string {
    return node.initial ?? this.nodeTitle(node).slice(0, 1).toLocaleUpperCase();
  }

  protected nodeTitle(node: SidebarNavNode): string {
    return this.i18n.t(node.titleKey);
  }

  private filterNode(node: SidebarNavNode, query: string): SidebarNavNode | null {
    const titleMatches = this.normalize(this.nodeTitle(node)).includes(query);
    const matchingChildren = node.children
      ?.map((childNode) => this.filterNode(childNode, query))
      .filter((childNode): childNode is SidebarNavNode => childNode !== null);

    if (titleMatches) {
      return node;
    }

    if (matchingChildren?.length) {
      return {
        ...node,
        children: matchingChildren
      };
    }

    return null;
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
