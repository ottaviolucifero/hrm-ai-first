import { I18nKey } from '../../../core/i18n/i18n.messages';

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

export type DataTableRow = Record<string, unknown>;

export interface DataTableAction<T extends DataTableRow = DataTableRow> {
  readonly id: string;
  readonly labelKey: I18nKey;
  readonly visible?: boolean | ((row: T) => boolean);
  readonly tone?: 'default' | 'danger';
  readonly disabled?: boolean | ((row: T) => boolean);
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
