import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';
import {
  DEFAULT_MASTER_DATA_PAGE_SIZE,
  EMPTY_MASTER_DATA_PAGE,
  MASTER_DATA_CATEGORIES,
  MasterDataCategory,
  MasterDataCategoryId,
  MasterDataColumn,
  MasterDataPage,
  MasterDataQuery,
  MasterDataResource,
  MasterDataRow
} from './master-data.models';
import { MasterDataService } from './master-data.service';

@Component({
  selector: 'app-master-data-admin',
  templateUrl: './master-data-admin.component.html',
  styleUrl: './master-data-admin.component.scss'
})
export class MasterDataAdminComponent {
  private readonly masterDataService = inject(MasterDataService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadSelectedResource();
    });

  protected readonly categories = MASTER_DATA_CATEGORIES;
  protected readonly selectedCategoryId = signal<MasterDataCategoryId>(MASTER_DATA_CATEGORIES[0].id);
  protected readonly selectedResourceId = signal(MASTER_DATA_CATEGORIES[0].resources[0].id);
  protected readonly pageData = signal<MasterDataPage<MasterDataRow>>(EMPTY_MASTER_DATA_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly paginationSummary = computed(() => {
    const pageData = this.pageData();
    return `${this.i18n.t('masterData.pagination.page')} ${pageData.page + 1} ${this.i18n.t('masterData.pagination.of')} ${Math.max(pageData.totalPages, 1)} (${pageData.totalElements} ${this.i18n.t('masterData.pagination.results')})`;
  });
  protected readonly selectedCategory = computed(
    () => this.categories.find((category) => category.id === this.selectedCategoryId()) ?? this.categories[0]
  );
  protected readonly selectedResource = computed(
    () =>
      this.selectedCategory().resources.find((resource) => resource.id === this.selectedResourceId()) ??
      this.selectedCategory().resources[0]
  );

  constructor() {
    this.loadSelectedResource();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateCategory(event: Event): void {
    const nextCategoryId = (event.target as HTMLSelectElement).value as MasterDataCategoryId;
    const nextCategory = this.categories.find((category) => category.id === nextCategoryId);
    if (!nextCategory) {
      return;
    }

    this.selectedCategoryId.set(nextCategory.id);
    this.selectedResourceId.set(nextCategory.resources[0].id);
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateResource(event: Event): void {
    this.selectedResourceId.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected refresh(): void {
    this.loadSelectedResource();
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadSelectedResource();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadSelectedResource();
  }

  protected trackRow(_index: number, row: MasterDataRow): unknown {
    return row['id'] ?? _index;
  }

  protected displayValue(row: MasterDataRow, column: MasterDataColumn): string {
    const value = this.resolveValue(row, column.key);

    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (column.kind === 'boolean') {
      return value === true ? this.i18n.t('masterData.boolean.yes') : this.i18n.t('masterData.boolean.no');
    }

    if (column.kind === 'date' && typeof value === 'string') {
      const parsedDate = new Date(value);
      if (!Number.isNaN(parsedDate.getTime())) {
        return new Intl.DateTimeFormat(this.i18n.language(), {
          dateStyle: 'short',
          timeStyle: 'short'
        }).format(parsedDate);
      }
    }

    if (typeof value === 'object') {
      const reference = value as Record<string, unknown>;
      return String(reference['name'] ?? reference['code'] ?? '');
    }

    return String(value);
  }

  private loadSelectedResource(): void {
    const resource = this.selectedResource();
    const query = this.buildQuery();

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.masterDataService.fetchRows(resource, query)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private buildQuery(): MasterDataQuery {
    return {
      page: this.pageIndex(),
      size: DEFAULT_MASTER_DATA_PAGE_SIZE,
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): MasterDataPage<MasterDataRow> {
    return {
      ...EMPTY_MASTER_DATA_PAGE,
      page: this.pageIndex(),
      size: DEFAULT_MASTER_DATA_PAGE_SIZE
    };
  }

  private resolveValue(row: MasterDataRow, key: string): unknown {
    return key.split('.').reduce<unknown>((currentValue, segment) => {
      if (!currentValue || typeof currentValue !== 'object') {
        return undefined;
      }

      return (currentValue as Record<string, unknown>)[segment];
    }, row);
  }
}
