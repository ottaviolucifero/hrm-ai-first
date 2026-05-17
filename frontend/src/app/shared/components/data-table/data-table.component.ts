import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { I18nKey } from '../../../core/i18n/i18n.messages';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppButtonComponent } from '../button/app-button.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from '../confirm-dialog/confirm-dialog.models';
import {
  DataTableAction,
  DataTableActionConfirmation,
  DataTableBadgeTone,
  DataTableColumn,
  DataTableColumnAlign,
  DataTableColumnSticky,
  DataTableColumnType,
  DataTablePage,
  DataTablePageLink,
  DataTableRowActionEvent,
  DataTableRow
} from './data-table.models';

interface PendingDataTableConfirmation {
  readonly action: DataTableAction;
  readonly row: DataTableRow;
  readonly config: ConfirmDialogConfig;
}

@Component({
  selector: 'app-data-table',
  imports: [NgStyle, AppButtonComponent, ConfirmDialogComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly skeletonRows = Array.from({ length: 6 });
  private readonly rowActionIconMap: Record<string, readonly string[]> = {
    activate: ['ki-filled', 'ki-check-circle'],
    view: ['ki-filled', 'ki-eye'],
    details: ['ki-filled', 'ki-eye'],
    read: ['ki-filled', 'ki-eye'],
    edit: ['ki-filled', 'ki-pencil'],
    update: ['ki-filled', 'ki-pencil'],
    deactivate: ['ki-filled', 'ki-minus-circle'],
    delete: ['ki-filled', 'ki-trash'],
    deletephysical: ['ki-filled', 'ki-trash'],
    cancelrequest: ['ki-filled', 'ki-trash']
  };

  @Input() columns: readonly DataTableColumn[] = [];
  @Input() rows: readonly DataTableRow[] = [];
  @Input() rowActions: readonly DataTableAction[] = [];
  @Input() pageData: DataTablePage | null = null;
  @Input() pageSizeOptions: readonly number[] = [10, 20, 50];
  @Input() actionsColumnSticky: DataTableColumnSticky | null = null;
  @Input() loading = false;
  @Input() hasError = false;
  @Input() loadingMessageKey: I18nKey = 'dataTable.loading';
  @Input() errorMessageKey: I18nKey = 'dataTable.error';
  @Input() emptyMessageKey: I18nKey = 'dataTable.empty';

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() rowAction = new EventEmitter<DataTableRowActionEvent>();

  protected pendingConfirmation: PendingDataTableConfirmation | null = null;

  protected visibleColumns(): readonly DataTableColumn[] {
    return this.columns.filter((column) => column.visible !== false);
  }

  protected visibleRowActions(row?: DataTableRow): readonly DataTableAction[] {
    return this.rowActions.filter((action) => this.isRowActionVisible(action, row));
  }

  protected trackColumn(_index: number, column: DataTableColumn): string {
    return column.key;
  }

  protected trackRow(index: number, row: DataTableRow): unknown {
    return row['id'] ?? index;
  }

  protected trackRowAction(_index: number, action: DataTableAction): string {
    return action.id;
  }

  protected displayValue(row: DataTableRow, column: DataTableColumn): string {
    const value = this.resolveValue(row, column.key);

    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    const type = this.columnType(column);

    if (type === 'boolean') {
      return value === true ? this.i18n.t('dataTable.boolean.yes') : this.i18n.t('dataTable.boolean.no');
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
    return `${this.i18n.t('dataTable.pagination.page')} ${pageData.page + 1} ${this.i18n.t('dataTable.pagination.of')} ${Math.max(pageData.totalPages, 1)} (${pageData.totalElements} ${this.i18n.t('dataTable.pagination.results')})`;
  }

  protected paginationLinks(pageData: DataTablePage): readonly DataTablePageLink[] {
    if (pageData.totalPages <= 0) {
      return [];
    }

    const currentPage = pageData.page + 1;
    const totalPages = pageData.totalPages;
    const pages = new Set<number>();

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.add(page);
      }
    } else {
      [1, 2, currentPage - 1, currentPage, currentPage + 1, totalPages - 1, totalPages]
        .filter((page) => page >= 1 && page <= totalPages)
        .forEach((page) => pages.add(page));
    }

    const orderedPages = Array.from(pages).sort((left, right) => left - right);
    const links: DataTablePageLink[] = [];

    orderedPages.forEach((page, index) => {
      if (index > 0 && page - orderedPages[index - 1] > 1) {
        links.push({
          type: 'ellipsis',
          value: `ellipsis-${orderedPages[index - 1]}-${page}`,
          active: false
        });
      }

      links.push({
        type: 'page',
        value: page,
        active: page === currentPage
      });
    });

    return links;
  }

  protected emitPageChange(page: number, currentPage: number): void {
    if (this.loading || page === currentPage) {
      return;
    }

    this.pageChange.emit(page - 1);
  }

  protected emitPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const nextSize = Number(target?.value);

    if (!Number.isFinite(nextSize) || nextSize <= 0) {
      return;
    }

    this.pageSizeChange.emit(nextSize);
  }

  protected isPageSizeSelected(option: number, pageData: DataTablePage): boolean {
    return option === pageData.size;
  }

  protected stateMessageKey(): I18nKey {
    if (this.loading) {
      return this.loadingMessageKey;
    }

    if (this.hasError) {
      return this.errorMessageKey;
    }

    return this.emptyMessageKey;
  }

  protected stateRole(): 'status' | 'alert' {
    return this.hasError && !this.loading ? 'alert' : 'status';
  }

  protected isBooleanColumn(column: DataTableColumn): boolean {
    return this.columnType(column) === 'boolean';
  }

  protected isStatusColumn(column: DataTableColumn): boolean {
    const type = this.columnType(column);
    return type === 'status' || type === 'badge';
  }

  protected isBooleanActive(row: DataTableRow, column: DataTableColumn): boolean {
    return this.resolveValue(row, column.key) === true;
  }

  protected statusBadgeClass(row: DataTableRow, column: DataTableColumn): string {
    return [
      'data-table-status-badge',
      `data-table-status-badge-${this.statusBadgeTone(row, column)}`
    ].join(' ');
  }

  protected statusBadgeTone(row: DataTableRow, column: DataTableColumn): DataTableBadgeTone {
    const tone = column.badgeTone;
    const value = this.resolveValue(row, column.key);

    if (typeof tone === 'function') {
      return tone(value, row);
    }

    return tone ?? 'neutral';
  }

  protected isRowActionDisabled(action: DataTableAction, row: DataTableRow): boolean {
    return typeof action.disabled === 'function' ? action.disabled(row) : action.disabled === true;
  }

  protected isColumnSticky(column: DataTableColumn, direction: DataTableColumnSticky): boolean {
    return column.sticky === direction;
  }

  protected isActionsColumnSticky(direction: DataTableColumnSticky): boolean {
    return this.actionsColumnSticky === direction;
  }

  protected isRowActionVisible(action: DataTableAction, row?: DataTableRow): boolean {
    if (typeof action.visible === 'function') {
      return row ? action.visible(row) : true;
    }

    return action.visible !== false;
  }

  protected emitRowAction(action: DataTableAction, row: DataTableRow): void {
    if (this.isRowActionDisabled(action, row)) {
      return;
    }

    if (action.confirmation) {
      this.pendingConfirmation = {
        action,
        row,
        config: this.resolveConfirmationConfig(action.confirmation, row)
      };
      return;
    }

    this.rowAction.emit({ action, row });
  }

  protected cancelPendingConfirmation(): void {
    this.pendingConfirmation = null;
  }

  protected confirmPendingConfirmation(): void {
    const pending = this.pendingConfirmation;
    if (!pending) {
      return;
    }

    this.pendingConfirmation = null;
    this.rowAction.emit({
      action: pending.action,
      row: pending.row
    });
  }

  protected rowActionIconClass(action: DataTableAction): readonly string[] {
    const normalizedActionId = action.id.trim().toLowerCase();
    return this.rowActionIconMap[normalizedActionId] ?? ['ki-filled', 'ki-magnifier'];
  }

  protected rowActionButtonClass(action: DataTableAction): string {
    return [
      'kt-btn-list-action',
      'data-table-action',
      action.tone === 'danger' ? 'data-table-action-danger' : ''
    ]
      .filter((className) => className.length > 0)
      .join(' ');
  }

  protected rowActionIcon(action: DataTableAction): string {
    return ['data-table-action-icon', ...this.rowActionIconClass(action)].join(' ');
  }

  protected paginationPageButtonClass(active: boolean): string {
    return active
      ? 'data-table-pagination-page data-table-pagination-page-active'
      : 'data-table-pagination-page';
  }

  protected paginationLinkLabel(value: string | number): string {
    return String(value);
  }

  private columnType(column: DataTableColumn): DataTableColumnType {
    return column.type ?? 'text';
  }

  private resolveConfirmationConfig(
    confirmation: DataTableActionConfirmation<DataTableRow>,
    row: DataTableRow
  ): ConfirmDialogConfig {
    return {
      titleKey: confirmation.titleKey,
      messageKey: confirmation.messageKey,
      confirmLabelKey: confirmation.confirmLabelKey,
      cancelLabelKey: confirmation.cancelLabelKey,
      severity: confirmation.severity,
      mode: confirmation.mode,
      targetLabelKey: confirmation.targetLabelKey,
      targetValue: this.resolveConfirmationTargetValue(confirmation.targetValue, row)
    };
  }

  private resolveConfirmationTargetValue(
    targetValue: DataTableActionConfirmation<DataTableRow>['targetValue'],
    row: DataTableRow
  ): string | number | null {
    if (typeof targetValue === 'function') {
      return targetValue(row);
    }

    return targetValue ?? null;
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
