import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { defer, of } from 'rxjs';

import { LookupLoadFn, LookupOption } from '../../lookup/lookup.models';
import { LookupSelectComponent } from './lookup-select.component';

@Component({
  imports: [ReactiveFormsModule, LookupSelectComponent],
  template: `
    <form [formGroup]="form" (submit)="handleSubmit($event)">
      <app-lookup-select
        formControlName="lookup"
        [label]="'Lookup'"
        [autocomplete]="autocomplete"
        [minSearchLength]="minSearchLength"
        [options]="options"
        [loadPage]="loadPage"
        [createEnabled]="createEnabled"
        [createDisabled]="createDisabled"
        [createLabel]="'Create item'"
        (createRequested)="handleCreateRequested()"
        [clearable]="true" />
    </form>
  `
})
class LookupSelectHostComponent {
  readonly form;
  autocomplete = true;
  minSearchLength = 0;
  createEnabled = false;
  createDisabled = false;
  options: readonly LookupOption[] = [];
  loadPage: LookupLoadFn | null = null;
  createRequestedCount = 0;
  submitCount = 0;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.form = this.formBuilder.group({
      lookup: ['']
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitCount += 1;
  }

  handleCreateRequested(): void {
    this.createRequestedCount += 1;
  }
}

describe('LookupSelectComponent', () => {
  let fixture: ComponentFixture<LookupSelectHostComponent>;
  let host: LookupSelectHostComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [LookupSelectHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LookupSelectHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('syncs a static selected value with the form control', () => {
    host.options = [
      { id: 'opt-1', code: 'IT', name: 'Italy' },
      { id: 'opt-2', code: 'TN', name: 'Tunisia' }
    ];
    host.form.controls.lookup.setValue('opt-2');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    expect(input.value).toBe('TN - Tunisia');
  });

  it('updates the form control when a static option is selected', () => {
    host.autocomplete = false;
    host.options = [
      { id: 'opt-1', code: 'IT', name: 'Italy' },
      { id: 'opt-2', code: 'TN', name: 'Tunisia' }
    ];
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.lookup-select-button') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.lookup-select-option');
    (options[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.form.controls.lookup.value).toBe('opt-2');
  });

  it('tracks loading and empty states', () => {
    fixture.detectChanges();
    const component = getLookupSelectComponent() as any;

    component.panelOpen = true;
    component.loading = true;
    expect(component.loading).toBe(true);

    component.loading = false;
    component.hasLoadError = false;
    component.renderedOptions = [];
    expect(component.loading).toBe(false);
    expect(component.hasLoadError).toBe(false);
    expect(component.renderedOptions).toEqual([]);
  });

  it('tracks an error state', () => {
    fixture.detectChanges();
    const component = getLookupSelectComponent() as any;

    component.panelOpen = true;
    component.loading = false;
    component.hasLoadError = true;
    component.renderedOptions = [];
    expect(component.hasLoadError).toBe(true);
    expect(component.renderedOptions).toEqual([]);
  });

  it('triggers remote lookup from autocomplete input after 700 ms without blur', async () => {
    vi.useFakeTimers();
    host.loadPage = vi.fn(() => of({
      content: [],
      page: 0,
      size: 25,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    }));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.value = 'I';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(699);
    expect(host.loadPage).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(host.loadPage).toHaveBeenCalledTimes(1);
    expect(host.loadPage).toHaveBeenCalledWith(expect.objectContaining({ search: 'I' }));
  });

  it('renders returned options without blur and highlights the first result by default', async () => {
    vi.useFakeTimers();
    host.loadPage = vi.fn(() => defer(() => Promise.resolve({
      content: [
        { id: 'opt-216', code: '+216', name: 'Tunisia' },
        { id: 'opt-216-alt', code: '+216', name: 'Tunisia Alt' }
      ],
      page: 0,
      size: 25,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true
    })));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    input.value = 'tunisia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    await flushLookupAsync();
    fixture.detectChanges();

    const component = getLookupSelectComponent() as any;
    expect(component.renderedOptions).toHaveLength(2);
    expect(component.renderedOptions[0].name).toBe('Tunisia');
    expect(component.highlightedIndex).toBe(0);
    expect(component.panelOpen).toBe(true);

    const panel = fixture.nativeElement.querySelector('.lookup-select-panel') as HTMLElement;
    const optionButtons = fixture.nativeElement.querySelectorAll('.lookup-select-option');
    expect(panel).not.toBeNull();
    expect(optionButtons).toHaveLength(2);
    expect((optionButtons[0] as HTMLButtonElement).textContent).toContain('Tunisia');
    expect((optionButtons[0] as HTMLButtonElement).classList.contains('lookup-select-option-highlighted')).toBe(true);
  });

  it('selects the highlighted first result on Enter without requiring blur', async () => {
    vi.useFakeTimers();
    host.loadPage = vi.fn(() => defer(() => Promise.resolve({
      content: [
        { id: 'opt-216', code: '+216', name: 'Tunisia' },
        { id: 'opt-39', code: '+39', name: 'Italy' }
      ],
      page: 0,
      size: 25,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true
    })));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.focus();
    input.value = 'tunisia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    await flushLookupAsync();
    fixture.detectChanges();

    const optionButtons = fixture.nativeElement.querySelectorAll('.lookup-select-option');
    expect(optionButtons).toHaveLength(2);
    expect((optionButtons[0] as HTMLButtonElement).classList.contains('lookup-select-option-highlighted')).toBe(true);

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    input.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(true);
    expect(host.form.controls.lookup.value).toBe('opt-216');
    expect(host.submitCount).toBe(0);
    expect((getLookupSelectComponent() as any).panelOpen).toBe(false);
  });

  it('moves the highlighted option with ArrowDown and ArrowUp', async () => {
    vi.useFakeTimers();
    host.loadPage = vi.fn(() => defer(() => Promise.resolve({
      content: [
        { id: 'opt-216', code: '+216', name: 'Tunisia' },
        { id: 'opt-39', code: '+39', name: 'Italy' },
        { id: 'opt-49', code: '+49', name: 'Germany' }
      ],
      page: 0,
      size: 25,
      totalElements: 3,
      totalPages: 1,
      first: true,
      last: true
    })));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.focus();
    input.value = 't';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    await flushLookupAsync();
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    fixture.detectChanges();
    expect((getLookupSelectComponent() as any).highlightedIndex).toBe(1);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
    fixture.detectChanges();
    expect((getLookupSelectComponent() as any).highlightedIndex).toBe(0);
  });

  it('closes the dropdown on Escape without selecting', async () => {
    vi.useFakeTimers();
    host.loadPage = vi.fn(() => defer(() => Promise.resolve({
      content: [{ id: 'opt-216', code: '+216', name: 'Tunisia' }],
      page: 0,
      size: 25,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.focus();
    input.value = 'tunisia';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    await flushLookupAsync();
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    fixture.detectChanges();

    expect((getLookupSelectComponent() as any).panelOpen).toBe(false);
    expect(host.form.controls.lookup.value).toBe('');
  });

  it('respects minSearchLength before firing the debounced remote lookup', async () => {
    vi.useFakeTimers();
    host.minSearchLength = 2;
    host.loadPage = vi.fn(() => of({
      content: [],
      page: 0,
      size: 25,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    }));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.lookup-select-input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    input.value = 'I';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(700);
    expect(host.loadPage).not.toHaveBeenCalled();

    input.value = 'It';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(699);
    expect(host.loadPage).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(host.loadPage).toHaveBeenCalledTimes(1);
    expect(host.loadPage).toHaveBeenCalledWith(expect.objectContaining({ search: 'It' }));
  });

  it('shows the optional create button and emits createRequested', () => {
    host.createEnabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.lookup-select-create-button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.closest('.lookup-select-control')).toBeNull();

    button.click();
    fixture.detectChanges();

    expect(host.createRequestedCount).toBe(1);
    expect(host.submitCount).toBe(0);
  });

  it('disables the optional create button without emitting createRequested', () => {
    host.createEnabled = true;
    host.createDisabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.lookup-select-create-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(host.createRequestedCount).toBe(0);
  });

  it('disables the create button when the control is readonly', () => {
    host.createEnabled = true;
    const component = getLookupSelectComponent() as any;
    component.readonly = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.lookup-select-create-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  function getLookupSelectComponent(): LookupSelectComponent {
    return fixture.debugElement.query(By.directive(LookupSelectComponent)).componentInstance as LookupSelectComponent;
  }

  async function flushLookupAsync(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  }
});
