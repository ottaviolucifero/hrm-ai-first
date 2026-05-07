import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { MasterDataFormComponent, MasterDataFormSubmitEvent } from './master-data-form.component';
import {
  DEFAULT_MASTER_DATA_PAGE_SIZE,
  EMPTY_MASTER_DATA_PAGE,
  MASTER_DATA_CATEGORIES,
  MasterDataCategory,
  MasterDataCategoryId,
  MasterDataFormConfig,
  MasterDataFormMode,
  MasterDataPage,
  MasterDataQuery,
  MasterDataRowActionEvent,
  MasterDataResource,
  MasterDataRow
} from './master-data.models';
import { MasterDataService } from './master-data.service';

@Component({
  selector: 'app-master-data-admin',
  imports: [DataTableComponent, MasterDataFormComponent],
  templateUrl: './master-data-admin.component.html',
  styleUrl: './master-data-admin.component.scss'
})
export class MasterDataAdminComponent implements OnDestroy {
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
  protected readonly lastTriggeredRowAction = signal<MasterDataRowActionEvent | null>(null);
  protected readonly lastFormSubmission = signal<MasterDataFormSubmitEvent | null>(null);
  protected readonly formMode = signal<MasterDataFormMode | null>(null);
  protected readonly formValue = signal<MasterDataRow | null>(null);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly formConfig = computed<MasterDataFormConfig | null>(() => this.selectedResource().form ?? null);
  protected readonly formFields = computed(() => this.formConfig()?.fields ?? []);
  protected readonly openFormMode = computed<MasterDataFormMode>(() => this.formMode() ?? 'view');
  protected readonly canCreate = computed(
    () => this.formConfig()?.modes.includes('create') === true
  );
  protected readonly isFormOpen = computed(() => this.formMode() !== null && this.formConfig() !== null);
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
    this.closeForm();
    this.pageIndex.set(0);
    this.loadSelectedResource();
  }

  protected updateResource(event: Event): void {
    this.selectedResourceId.set((event.target as HTMLSelectElement).value);
    this.closeForm();
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

  protected openCreateForm(): void {
    this.openForm('create', null);
  }

  protected handleRowAction(event: MasterDataRowActionEvent): void {
    this.lastTriggeredRowAction.set(event);

    if (event.action.id === 'edit') {
      this.openForm('edit', event.row);
    }

    if (event.action.id === 'view') {
      this.openForm('view', event.row);
    }
  }

  protected handleFormSave(event: MasterDataFormSubmitEvent): void {
    this.lastFormSubmission.set(event);
    this.closeForm();
  }

  protected handleFormCancel(): void {
    this.closeForm();
  }

  protected closeForm(): void {
    this.formMode.set(null);
    this.formValue.set(null);
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

  private openForm(mode: MasterDataFormMode, row: MasterDataRow | null): void {
    const config = this.formConfig();
    if (!config || !config.modes.includes(mode)) {
      return;
    }

    this.formMode.set(mode);
    this.formValue.set(row);
  }
}
