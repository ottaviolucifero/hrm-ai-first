import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { I18nService } from '../../../core/i18n/i18n.service';
import {
  DataTableColumn,
  DataTableColumnAlign,
  DataTableColumnType,
  DataTablePage,
  DataTableRow
} from './data-table.models';

@Component({
  selector: 'app-data-table',
  imports: [NgStyle],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  protected readonly i18n = inject(I18nService);

  @Input() columns: readonly DataTableColumn[] = [];
  @Input() rows: readonly DataTableRow[] = [];
  @Input() pageData: DataTablePage | null = null;
  @Input() loading = false;
  @Input() hasError = false;

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  protected visibleColumns(): readonly DataTableColumn[] {
    return this.columns.filter((column) => column.visible !== false);
  }

  protected trackColumn(_index: number, column: DataTableColumn): string {
    return column.key;
  }

  protected trackRow(index: number, row: DataTableRow): unknown {
    return row['id'] ?? index;
  }

  protected displayValue(row: DataTableRow, column: DataTableColumn): string {
    const value = this.resolveValue(row, column.key);

    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined || value === '') {
      return '';
    }

    const type = this.columnType(column);

    if (type === 'boolean') {
      return value === true ? this.i18n.t('masterData.boolean.yes') : this.i18n.t('masterData.boolean.no');
    }

    if ((type === 'date' || type === 'datetime') && typeof value === 'string') {
      return this.formatDateValue(value);
    }

    if (type === 'number' || type === 'decimal' || type === 'currency') {
      return this.formatNumericValue(value, type);
    }

    if (typeof value === 'object') {
      const reference = value as Record<string, unknown>;
      return String(reference['name'] ?? reference['code'] ?? '');
    }

    return String(value);
  }

  protected columnAlignment(column: DataTableColumn): DataTableColumnAlign {
    if (column.align) {
      return column.align;
    }

    const type = this.columnType(column);

    if (type === 'number' || type === 'decimal' || type === 'currency') {
      return 'right';
    }

    if (type === 'date' || type === 'datetime' || type === 'boolean' || type === 'badge' || type === 'status') {
      return 'center';
    }

    return 'left';
  }

  protected columnStyle(column: DataTableColumn): Record<string, string> {
    return {
      ...(column.width ? { width: column.width } : {}),
      ...(column.minWidth ? { 'min-width': column.minWidth } : {})
    };
  }

  protected paginationSummary(pageData: DataTablePage): string {
    return `${this.i18n.t('masterData.pagination.page')} ${pageData.page + 1} ${this.i18n.t('masterData.pagination.of')} ${Math.max(pageData.totalPages, 1)} (${pageData.totalElements} ${this.i18n.t('masterData.pagination.results')})`;
  }

  private columnType(column: DataTableColumn): DataTableColumnType {
    return column.type ?? 'text';
  }

  private formatDateValue(value: string): string {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(parsedDate);
  }

  private formatNumericValue(value: unknown, type: DataTableColumnType): string {
    const parsedNumber = typeof value === 'number' ? value : Number(value);

    if (Number.isNaN(parsedNumber)) {
      return String(value);
    }

    return new Intl.NumberFormat(this.i18n.language(), {
      maximumFractionDigits: type === 'number' ? 0 : 2
    }).format(parsedNumber);
  }

  private resolveValue(row: DataTableRow, key: string): unknown {
    return key.split('.').reduce<unknown>((currentValue, segment) => {
      if (!currentValue || typeof currentValue !== 'object') {
        return undefined;
      }

      return (currentValue as Record<string, unknown>)[segment];
    }, row);
  }
}
