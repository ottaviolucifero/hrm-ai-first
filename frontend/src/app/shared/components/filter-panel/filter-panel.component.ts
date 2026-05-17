import { Component, Input, computed, inject, signal } from '@angular/core';

import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent {
  private static nextId = 0;

  protected readonly i18n = inject(I18nService);
  protected readonly expanded = signal(false);
  private readonly activeFilterCountValue = signal(0);

  @Input() disabled = false;
  @Input() id = '';
  @Input() set activeFilterCount(value: number) {
    const parsedCount = Number(value);
    this.activeFilterCountValue.set(Number.isFinite(parsedCount) ? parsedCount : 0);
  }

  private readonly generatedId = `app-filter-panel-${++FilterPanelComponent.nextId}`;

  protected readonly normalizedActiveFilterCount = computed(() => {
    const parsedCount = this.activeFilterCountValue();
    return parsedCount > 0 ? Math.floor(parsedCount) : 0;
  });

  protected get panelId(): string {
    return this.id.trim() || this.generatedId;
  }

  protected get hasActiveFilters(): boolean {
    return this.normalizedActiveFilterCount() > 0;
  }

  protected get activeFiltersAriaLabel(): string {
    return `${this.i18n.t('filterPanel.activeFiltersAriaLabel')}: ${this.normalizedActiveFilterCount()}`;
  }

  protected toggleExpanded(): void {
    if (this.disabled) {
      return;
    }

    this.expanded.update((expanded) => !expanded);
  }
}
