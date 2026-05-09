import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AppSidebarComponent } from './app-sidebar.component';

@Component({
  template: ''
})
class DummyRouteComponent {}

describe('AppSidebarComponent', () => {
  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [AppSidebarComponent],
      providers: [
        provideRouter([
          { path: '', component: DummyRouteComponent },
          { path: 'master-data', component: DummyRouteComponent }
        ])
      ]
    }).compileComponents();
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
  });

  it('renders the navigation tree and search input', () => {
    const fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="search"]')).toBeTruthy();
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Persone');
    expect(compiled.textContent).toContain('Dati di base');
    expect(compiled.querySelector<HTMLAnchorElement>('a[href="/master-data"]')).toBeTruthy();
  });

  it('filters the navigation tree', () => {
    const fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'permessi';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Richieste permessi');
    expect(textContent).not.toContain('Documenti paga');
  });

  it('collapses the sidebar while keeping the home route available', () => {
    const fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const collapseButton = compiled.querySelector<HTMLButtonElement>('button[aria-label="Comprimi menu"]');

    expect(collapseButton).toBeTruthy();
    collapseButton?.click();
    fixture.detectChanges();

    const textContent = compiled.textContent ?? '';
    expect(compiled.querySelector('button[aria-label="Espandi menu"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLInputElement>('input[type="search"]')).toBeNull();
    expect(textContent).not.toContain('Apri');
    expect(textContent).not.toContain('Comprimi');
    expect(textContent).not.toContain('Persone');

    const homeLink = compiled.querySelector<HTMLAnchorElement>('a[title="Home"]');
    const peopleButton = compiled.querySelector<HTMLButtonElement>('button[title="Persone"]');

    expect(homeLink).toBeTruthy();
    expect(homeLink?.getAttribute('href')).toBe('/');
    expect(homeLink?.textContent?.trim()).toBe('H');
    expect(peopleButton?.disabled).toBe(true);
    expect(peopleButton?.textContent?.trim()).toBe('P');
  });

  it('keeps the active route visually highlighted', async () => {
    const fixture = TestBed.createComponent(AppSidebarComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/master-data');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const masterDataLink = compiled.querySelector<HTMLAnchorElement>('a[href="/master-data"]');

    expect(masterDataLink).toBeTruthy();
    expect(masterDataLink?.classList.contains('app-sidebar-link--active')).toBe(true);
  });
});
