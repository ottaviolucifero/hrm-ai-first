import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPanelComponent } from './filter-panel.component';

@Component({
  imports: [FilterPanelComponent],
  template: `
    <app-filter-panel [activeFilterCount]="activeFilterCount" [disabled]="disabled">
      <div class="projected-content">Projected filters</div>
    </app-filter-panel>
  `
})
class FilterPanelHostComponent {
  activeFilterCount = 0;
  disabled = false;
}

describe('FilterPanelComponent', () => {
  let fixture: ComponentFixture<FilterPanelHostComponent>;
  let host: FilterPanelHostComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [FilterPanelHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders the panel collapsed by default without destroying projected content', () => {
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.filter-panel-toggle') as HTMLButtonElement;
    const content = fixture.nativeElement.querySelector('.filter-panel-content') as HTMLDivElement;
    const projected = fixture.nativeElement.querySelector('.projected-content') as HTMLDivElement;

    expect(toggle.textContent).toContain('Filtri');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(content.hidden).toBe(true);
    expect(projected).not.toBeNull();
  });

  it('toggles the content region and exposes aria metadata', () => {
    host.activeFilterCount = 2;
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.filter-panel-toggle') as HTMLButtonElement;
    const content = fixture.nativeElement.querySelector('.filter-panel-content') as HTMLDivElement;
    const badge = fixture.nativeElement.querySelector('.filter-panel-active-count') as HTMLSpanElement;

    expect(badge.textContent?.trim()).toBe('2');
    expect(badge.getAttribute('aria-label')).toBe('Filtri attivi: 2');
    expect(content.getAttribute('role')).toBe('region');
    expect(content.getAttribute('aria-label')).toBe('Pannello filtri avanzati');

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(content.hidden).toBe(false);
  });

  it('does not render the active filter badge when the count is zero', () => {
    host.activeFilterCount = 0;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.filter-panel-active-count')).toBeNull();
  });

  it('keeps the panel disabled when requested', () => {
    host.disabled = true;
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.filter-panel-toggle') as HTMLButtonElement;
    const content = fixture.nativeElement.querySelector('.filter-panel-content') as HTMLDivElement;

    toggle.click();
    fixture.detectChanges();

    expect(toggle.disabled).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(content.hidden).toBe(true);
  });
});
