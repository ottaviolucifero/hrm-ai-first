import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLink } from '@angular/router';

interface SidebarNavNode {
  readonly id: string;
  readonly title: string;
  readonly initial?: string;
  readonly route?: `/${string}`;
  readonly children?: readonly SidebarNavNode[];
}

const SIDEBAR_NAVIGATION: readonly SidebarNavNode[] = [
  {
    id: 'home',
    title: 'Home',
    initial: 'H',
    route: '/'
  },
  {
    id: 'people',
    title: 'Persone',
    initial: 'P',
    children: [
      {
        id: 'people-employees',
        title: 'Dipendenti'
      }
    ]
  },
  {
    id: 'hr-operations',
    title: 'Operazioni HR',
    initial: 'O',
    children: [
      {
        id: 'hr-documents',
        title: 'Documenti paga'
      },
      {
        id: 'hr-leave',
        title: 'Richieste permessi'
      },
      {
        id: 'hr-holidays',
        title: 'Calendario festivita'
      }
    ]
  },
  {
    id: 'assets',
    title: 'Asset aziendali',
    initial: 'A',
    children: [
      {
        id: 'assets-devices',
        title: 'Dispositivi'
      }
    ]
  },
  {
    id: 'governance',
    title: 'Governance',
    initial: 'G',
    children: [
      {
        id: 'governance-security',
        title: 'Sicurezza',
        children: [
          {
            id: 'governance-security-users',
            title: 'Utenti'
          },
          {
            id: 'governance-security-roles',
            title: 'Ruoli'
          },
          {
            id: 'governance-security-permissions',
            title: 'Permessi'
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

  @Output() readonly sidebarCollapsedChange = new EventEmitter<boolean>();

  protected readonly searchTerm = signal('');
  protected readonly sidebarCollapsed = signal(false);
  protected readonly expandedNodeIds = signal<ReadonlySet<string>>(new Set(['people', 'hr-operations']));
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
    return node.initial ?? node.title.slice(0, 1).toLocaleUpperCase();
  }

  private filterNode(node: SidebarNavNode, query: string): SidebarNavNode | null {
    const titleMatches = this.normalize(node.title).includes(query);
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
