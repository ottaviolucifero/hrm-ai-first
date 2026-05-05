import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';

const STORAGE_KEY = 'hrflow.language';

describe('I18nService', () => {
  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setBrowserLanguages(['en-US', 'en'], 'en-US');
    document.documentElement.lang = 'it';
    TestBed.resetTestingModule();
  });

  it('uses a valid localStorage language before browser languages', () => {
    window.localStorage.setItem(STORAGE_KEY, 'en');
    setBrowserLanguages(['fr-FR', 'fr'], 'fr-FR');

    const service = createService();

    expect(service.language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('uses fr from browser fr-FR when localStorage is empty', () => {
    setBrowserLanguages(['fr-FR', 'fr', 'en-US', 'en'], 'fr-FR');

    const service = createService();

    expect(service.language()).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('uses en from browser en-US when localStorage is empty', () => {
    setBrowserLanguages(['en-US', 'en'], 'en-US');

    const service = createService();

    expect(service.language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('falls back to it when the browser language is not supported', () => {
    setBrowserLanguages(['de-DE', 'de'], 'de-DE');

    const service = createService();

    expect(service.language()).toBe('it');
    expect(document.documentElement.lang).toBe('it');
  });

  it('ignores an invalid localStorage language and uses the browser language', () => {
    window.localStorage.setItem(STORAGE_KEY, 'es');
    setBrowserLanguages(['fr-FR', 'fr'], 'fr-FR');

    const service = createService();

    expect(service.language()).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('stores the user selected language', () => {
    setBrowserLanguages(['fr-FR', 'fr'], 'fr-FR');

    const service = createService();
    service.setLanguage('en');

    expect(service.language()).toBe('en');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});

function createService(): I18nService {
  TestBed.configureTestingModule({});
  return TestBed.inject(I18nService);
}

function setBrowserLanguages(languages: readonly string[], language: string): void {
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    value: languages
  });
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language
  });
}
