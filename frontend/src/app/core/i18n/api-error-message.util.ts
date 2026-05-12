import { HttpErrorResponse } from '@angular/common/http';

import { I18nKey } from './i18n.messages';
import { I18nService } from './i18n.service';

export interface ApiErrorMessageOptions {
  readonly fallbackKey: I18nKey;
  readonly statusKeys?: Partial<Record<number, I18nKey>>;
}

export function resolveApiErrorMessage(
  i18n: I18nService,
  error: unknown,
  options: ApiErrorMessageOptions
): string {
  const status = readApiErrorStatus(error);
  const statusKey = status ? options.statusKeys?.[status] : undefined;
  return i18n.t(statusKey ?? options.fallbackKey);
}

function readApiErrorStatus(error: unknown): number | null {
  if (error instanceof HttpErrorResponse) {
    return error.status;
  }

  const status = Number((error as { status?: unknown })?.status ?? 0);
  return Number.isFinite(status) && status > 0 ? status : null;
}
