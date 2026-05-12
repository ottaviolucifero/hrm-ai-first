import { I18nKey } from '../../../core/i18n/i18n.messages';
import { ConfirmDialogMode, ConfirmDialogSeverity } from '../confirm-dialog/confirm-dialog.models';

export type DataTableColumnType =
  | 'text'
  | 'number'
  | 'decimal'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'badge'
  | 'status';

export type DataTableColumnAlign = 'left' | 'center' | 'right';
export type DataTableColumnSticky = 'left' | 'right';

export type DataTableRow = Record<string, unknown>;

export interface DataTableActionConfirmation<T extends DataTableRow = DataTableRow> {
  readonly titleKey: I18nKey;
  readonly messageKey: I18nKey;
  readonly confirmLabelKey?: I18nKey;
  readonly cancelLabelKey?: I18nKey;
  readonly severity?: ConfirmDialogSeverity;
  readonly mode?: ConfirmDialogMode;
  readonly targetLabelKey?: I18nKey;
  readonly targetValue?: string | number | ((row: T) => string | number | null);
}

export interface DataTableAction<T extends DataTableRow = DataTableRow> {
  readonly id: string;
  readonly labelKey: I18nKey;
  readonly visible?: boolean | ((row: T) => boolean);
  readonly tone?: 'default' | 'danger';
  readonly disabled?: boolean | ((row: T) => boolean);
  readonly confirmation?: DataTableActionConfirmation<T>;
}

export interface DataTableRowActionEvent<T extends DataTableRow = DataTableRow> {
  readonly action: DataTableAction<T>;
  readonly row: T;
}

export interface DataTableColumn<T extends DataTableRow = DataTableRow> {
  readonly key: string;
  readonly labelKey: I18nKey;
  readonly type?: DataTableColumnType;
  readonly visible?: boolean;
  readonly width?: string;
  readonly minWidth?: string;
  readonly align?: DataTableColumnAlign;
  readonly sticky?: DataTableColumnSticky;
  readonly formatter?: (value: unknown, row: T) => string;
}

export interface DataTablePage {
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export interface DataTablePageLink {
  readonly type: 'page' | 'ellipsis';
  readonly value: number | string;
  readonly active: boolean;
}
