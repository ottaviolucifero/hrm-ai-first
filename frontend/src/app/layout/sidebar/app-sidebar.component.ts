import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLink } from '@angular/router';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';

interface SidebarNavNode {
  readonly id: string;
  readonly titleKey: I18nKey;
  readonly initial?: string;
  readonly route?: `/${string}`;
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
        route: '/master-data'
      },
      {
        id: 'governance-security',
        titleKey: 'nav.governanceSecurity',
        children: [
          {
            id: 'governance-security-users',
            titleKey: 'nav.users'
          },
          {
            id: 'governance-security-roles',
            titleKey: 'nav.roles'
          },
          {
            id: 'governance-security-permissions',
            titleKey: 'nav.permissions'
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
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  @Output() readonly sidebarCollapsedChange = new EventEmitter<boolean>();

  protected readonly searchTerm = signal('');
  protected readonly sidebarCollapsed = signal(false);
  protected readonly expandedNodeIds = signal<ReadonlySet<string>>(new Set(['people', 'hr-operations', 'governance']));
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
