export type LanguageCode = 'it' | 'fr' | 'en';

export const DEFAULT_LANGUAGE: LanguageCode = 'it';
export const SUPPORTED_LANGUAGES = ['it', 'fr', 'en'] as const;

export type I18nDictionary<TKey extends string> = {
  readonly it: Record<TKey, string>;
} & Readonly<Record<Exclude<LanguageCode, 'it'>, Partial<Record<TKey, string>>>>;
