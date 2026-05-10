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
          { path: 'master-data', component: DummyRouteComponent },
          {
            path: 'admin',
            children: [
              { path: 'roles', component: DummyRouteComponent },
              { path: 'permissions', component: DummyRouteComponent }
            ]
          }
        ])
      ]
    }).compileComponents();
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
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
    expect(compiled.querySelector<HTMLAnchorElement>('a[href="/admin/roles"]')).toBeTruthy();
    expect(compiled.querySelector<HTMLAnchorElement>('a[href="/admin/permissions"]')).toBeTruthy();
  }, 15000);

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

  it('keeps roles and permissions as sibling links when roles is active', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/roles');
    const fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rolesLink = compiled.querySelector<HTMLAnchorElement>('a[href="/admin/roles"]');
    const permissionsLink = compiled.querySelector<HTMLAnchorElement>('a[href="/admin/permissions"]');
    const securityButton = Array.from(compiled.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Sicurezza')) as HTMLButtonElement | undefined;

    expect(rolesLink).toBeTruthy();
    expect(permissionsLink).toBeTruthy();
    expect(securityButton?.classList.contains('app-sidebar-link--branch-active')).toBe(true);
    expect(rolesLink?.classList.contains('app-sidebar-link--deep')).toBe(true);
    expect(permissionsLink?.classList.contains('app-sidebar-link--deep')).toBe(true);
    expect(rolesLink?.getAttribute('data-sidebar-level')).toBe('2');
    expect(permissionsLink?.getAttribute('data-sidebar-level')).toBe('2');
    expect(rolesLink?.closest('.app-sidebar-subtree--level-2')).toBe(permissionsLink?.closest('.app-sidebar-subtree--level-2'));
    expect(rolesLink?.parentElement?.parentElement).toBe(permissionsLink?.parentElement?.parentElement);
    expect(rolesLink?.classList.contains('app-sidebar-link--active')).toBe(true);
    expect(permissionsLink?.classList.contains('app-sidebar-link--active')).toBe(false);
  });

  it('keeps roles and permissions as sibling links when permissions is active', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/permissions');
    const fixture = TestBed.createComponent(AppSidebarComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rolesLink = compiled.querySelector<HTMLAnchorElement>('a[href="/admin/roles"]');
    const permissionsLink = compiled.querySelector<HTMLAnchorElement>('a[href="/admin/permissions"]');
    const securityButton = Array.from(compiled.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Sicurezza')) as HTMLButtonElement | undefined;

    expect(rolesLink).toBeTruthy();
    expect(permissionsLink).toBeTruthy();
    expect(securityButton?.classList.contains('app-sidebar-link--branch-active')).toBe(true);
    expect(rolesLink?.classList.contains('app-sidebar-link--deep')).toBe(true);
    expect(permissionsLink?.classList.contains('app-sidebar-link--deep')).toBe(true);
    expect(rolesLink?.getAttribute('data-sidebar-level')).toBe('2');
    expect(permissionsLink?.getAttribute('data-sidebar-level')).toBe('2');
    expect(rolesLink?.closest('.app-sidebar-subtree--level-2')).toBe(permissionsLink?.closest('.app-sidebar-subtree--level-2'));
    expect(rolesLink?.parentElement?.parentElement).toBe(permissionsLink?.parentElement?.parentElement);
    expect(rolesLink?.classList.contains('app-sidebar-link--active')).toBe(false);
    expect(permissionsLink?.classList.contains('app-sidebar-link--active')).toBe(true);
  });
});
