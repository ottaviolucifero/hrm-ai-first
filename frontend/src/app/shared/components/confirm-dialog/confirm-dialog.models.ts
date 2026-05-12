import { I18nKey } from '../../../core/i18n/i18n.messages';

export type ConfirmDialogSeverity = 'info' | 'success' | 'warning' | 'danger' | 'error';
export type ConfirmDialogMode = 'confirm' | 'message';

export interface ConfirmDialogConfig {
  readonly titleKey: I18nKey;
  readonly messageKey: I18nKey;
  readonly confirmLabelKey?: I18nKey;
  readonly cancelLabelKey?: I18nKey;
  readonly severity?: ConfirmDialogSeverity;
  readonly mode?: ConfirmDialogMode;
  readonly targetLabelKey?: I18nKey;
  readonly targetValue?: string | number | null;
  readonly loading?: boolean;
}
