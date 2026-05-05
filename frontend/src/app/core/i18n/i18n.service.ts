import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

import { DEFAULT_LANGUAGE, LanguageCode, SUPPORTED_LANGUAGES } from './i18n.models';
import { I18N_MESSAGES, I18nKey } from './i18n.messages';

const STORAGE_KEY = 'hrflow.language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly currentLanguage = signal<LanguageCode>(this.resolveInitialLanguage());

  readonly language = this.currentLanguage.asReadonly();

  constructor() {
    this.syncDocumentLanguage(this.currentLanguage());

    effect(() => {
      this.syncDocumentLanguage(this.currentLanguage());
    });
  }

  setLanguage(language: LanguageCode): void {
    const nextLanguage = this.resolveLanguage(language) ?? DEFAULT_LANGUAGE;
    this.currentLanguage.set(nextLanguage);
    this.syncDocumentLanguage(nextLanguage);
    this.writeStoredLanguage(nextLanguage);
  }

  t(key: I18nKey): string {
    return I18N_MESSAGES[this.currentLanguage()][key] ?? I18N_MESSAGES[DEFAULT_LANGUAGE][key] ?? key;
  }

  private resolveInitialLanguage(): LanguageCode {
    return this.readStoredLanguage() ?? this.readBrowserLanguage() ?? DEFAULT_LANGUAGE;
  }

  private readStoredLanguage(): LanguageCode | null {
    try {
      const storedLanguage = this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
      return this.resolveLanguage(storedLanguage);
    } catch {
      return null;
    }
  }

  private readBrowserLanguage(): LanguageCode | null {
    const navigator = this.document.defaultView?.navigator;
    const browserLanguages =
      navigator?.languages && navigator.languages.length > 0 ? navigator.languages : [navigator?.language];

    for (const browserLanguage of browserLanguages) {
      const language = this.resolveLanguage(browserLanguage);

      if (language) {
        return language;
      }
    }

    return null;
  }

  private writeStoredLanguage(language: LanguageCode): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Keep i18n usable when browser storage is unavailable.
    }
  }

  private syncDocumentLanguage(language: LanguageCode): void {
    this.document.documentElement.lang = language;
  }

  private resolveLanguage(language: string | null | undefined): LanguageCode | null {
    if (!language) {
      return null;
    }

    const normalizedLanguage = language.trim().toLowerCase().split(/[-_]/)[0];

    return SUPPORTED_LANGUAGES.includes(normalizedLanguage as LanguageCode)
      ? (normalizedLanguage as LanguageCode)
      : null;
  }
}
