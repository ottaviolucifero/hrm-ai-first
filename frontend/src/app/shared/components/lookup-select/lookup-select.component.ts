import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  forwardRef,
  inject
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, take } from 'rxjs';

import { I18nService } from '../../../core/i18n/i18n.service';
import { LookupLoadFn, LookupOption } from '../../lookup/lookup.models';

@Component({
  selector: 'app-lookup-select',
  templateUrl: './lookup-select.component.html',
  styleUrl: './lookup-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LookupSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LookupSelectComponent),
      multi: true
    }
  ]
})
export class LookupSelectComponent implements ControlValueAccessor, Validator, OnDestroy {
  private static nextId = 0;
  private static readonly SEARCH_DEBOUNCE_MS = 700;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly i18n = inject(I18nService);

  @Input() label = '';
  @Input() labelRequired = false;
  @Input() placeholder = '';
  @Input() searchPlaceholder = '';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() clearable = false;
  @Input() createEnabled = false;
  @Input() createDisabled = false;
  @Input() createLabel = '';
  @Input() autocomplete = true;
  @Input() compact = false;
  @Input() minSearchLength = 0;
  @Input() pageSize = 25;
  @Input() id = '';
  @Input() set options(value: readonly LookupOption[]) {
    this.staticOptions = value ?? [];
    this.syncSelectedOption();
    if (this.panelOpen && !this.loadPage) {
      this.applyStaticOptions(this.activeSearchTerm(), 0, false);
    }
    this.markForCheck();
  }
  @Input() loadPage: LookupLoadFn | null = null;
  @Input() set initialOption(value: LookupOption | null) {
    this.initialOptionValue = value;
    this.syncSelectedOption();
    this.markForCheck();
  }
  @Input() set value(value: string | null | undefined) {
    this.writeValue(value);
  }
  @Input() closedLabelBuilder: (option: LookupOption) => string = (option) => `${option.code} - ${option.name}`;
  @Input() optionLabelBuilder: (option: LookupOption) => string = (option) => {
    const baseLabel = `${option.code} - ${option.name}`;
    return option.extraLabel?.trim() ? `${baseLabel} (${option.extraLabel.trim()})` : baseLabel;
  };

  @Output() valueChange = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<LookupOption | null>();
  @Output() createRequested = new EventEmitter<void>();

  protected panelOpen = false;
  protected loading = false;
  protected hasLoadError = false;
  protected renderedOptions: readonly LookupOption[] = [];
  protected canLoadMore = false;
  protected autocompleteSearch = '';
  protected panelSearch = '';
  protected highlightedIndex = -1;

  private readonly generatedId = `app-lookup-select-${++LookupSelectComponent.nextId}`;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(LookupSelectComponent.SEARCH_DEBOUNCE_MS), distinctUntilChanged())
    .subscribe((search) => this.loadOptions(search, 0, false));
  private loadSubscription?: Subscription;
  private loadingDelayHandle: ReturnType<typeof setTimeout> | null = null;
  private staticOptions: readonly LookupOption[] = [];
  private initialOptionValue: LookupOption | null = null;
  private currentValue = '';
  private selectedOption: LookupOption | null = null;
  private currentPage = 0;
  private onChange = (_value: string): void => {
    // placeholder for form callback
  };
  private onTouched = (): void => {
    // placeholder for form callback
  };
  private onValidatorChange = (): void => {
    // placeholder for validator callback
  };
  private internalDisabled = false;

  protected get inputId(): string {
    return this.id.trim() || this.generatedId;
  }

  protected get panelId(): string {
    return `${this.inputId}-panel`;
  }

  protected get listboxId(): string {
    return `${this.inputId}-listbox`;
  }

  protected get helpId(): string {
    return `${this.inputId}-help`;
  }

  protected get errorId(): string {
    return `${this.inputId}-error`;
  }

  protected get disabledState(): boolean {
    return this.disabled || this.internalDisabled;
  }

  protected get readonlyState(): boolean {
    return this.readonly || this.disabledState;
  }

  protected get createActionVisible(): boolean {
    return this.createEnabled;
  }

  protected get createActionDisabled(): boolean {
    return this.readonlyState || this.createDisabled;
  }

  protected get hasValue(): boolean {
    return this.currentValue.trim().length > 0;
  }

  protected get currentValueLabel(): string {
    if (this.selectedOption) {
      return this.closedLabelBuilder(this.selectedOption);
    }

    return this.currentValue;
  }

  protected get hasError(): boolean {
    return this.errorText.trim().length > 0;
  }

  protected get describedByAttribute(): string | null {
    const ids = [];

    if (this.helpText.trim()) {
      ids.push(this.helpId);
    }

    if (this.errorText.trim()) {
      ids.push(this.errorId);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  }

  protected get controlText(): string {
    if (this.panelOpen && this.autocomplete) {
      return this.autocompleteSearch;
    }

    return this.currentValueLabel;
  }

  protected get activeDescendantId(): string | null {
    if (this.highlightedIndex < 0 || this.highlightedIndex >= this.renderedOptions.length) {
      return null;
    }

    return this.optionId(this.highlightedIndex);
  }

  protected openPanel(): void {
    if (this.readonlyState) {
      return;
    }

    this.panelOpen = true;
    if (this.autocomplete) {
      this.markForCheck();
      return;
    }

    this.panelSearch = '';
    this.loadOptions('', 0, false);
  }

  protected togglePanel(): void {
    if (this.panelOpen) {
      this.closePanel();
      return;
    }

    this.openPanel();
  }

  protected handleAutocompleteInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.autocompleteSearch = nextValue;
    if (!this.panelOpen) {
      this.panelOpen = true;
    }
    this.queueSearch(nextValue);
    this.markForCheck();
  }

  protected handlePanelSearchInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.panelSearch = nextValue;
    this.queueSearch(nextValue);
    this.markForCheck();
  }

  protected handleInputKeydown(event: KeyboardEvent): void {
    if (!this.panelOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      this.openPanel();
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        if (!this.renderedOptions.length) {
          return;
        }
        this.moveHighlight(1);
        event.preventDefault();
        this.markForCheck();
        break;
      case 'ArrowUp':
        if (!this.renderedOptions.length) {
          return;
        }
        this.moveHighlight(-1);
        event.preventDefault();
        this.markForCheck();
        break;
      case 'Enter':
        if (!this.panelOpen || this.loading || this.hasLoadError || !this.renderedOptions.length) {
          return;
        }
        this.selectHighlightedOption();
        event.preventDefault();
        this.markForCheck();
        break;
      case 'Escape':
        if (!this.panelOpen) {
          return;
        }
        this.closePanel();
        event.preventDefault();
        this.markForCheck();
        break;
      default:
        break;
    }
  }

  protected selectOption(option: LookupOption): void {
    this.selectedOption = option;
    this.currentValue = option.id;
    this.autocompleteSearch = '';
    this.panelSearch = '';
    this.panelOpen = false;
    this.onChange(this.currentValue);
    this.onTouched();
    this.valueChange.emit(this.currentValue);
    this.optionChange.emit(option);
    this.markForCheck();
  }

  protected clearSelection(): void {
    if (this.readonlyState) {
      return;
    }

    this.selectedOption = null;
    this.currentValue = '';
    this.autocompleteSearch = '';
    this.panelSearch = '';
    this.onChange('');
    this.onTouched();
    this.valueChange.emit('');
    this.optionChange.emit(null);
    this.onValidatorChange();
    this.markForCheck();
  }

  protected requestCreate(): void {
    if (this.createActionDisabled) {
      return;
    }

    this.createRequested.emit();
  }

  protected loadMore(): void {
    if (this.loading || !this.canLoadMore) {
      return;
    }

    this.loadOptions(this.activeSearchTerm(), this.currentPage + 1, true);
  }

  protected optionTrackBy(_index: number, option: LookupOption): string {
    return option.id;
  }

  protected isSelected(option: LookupOption): boolean {
    return option.id === this.currentValue;
  }

  protected isHighlighted(index: number): boolean {
    return index === this.highlightedIndex;
  }

  protected optionId(index: number): string {
    return `${this.inputId}-option-${index}`;
  }

  protected onBlur(): void {
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.clearLoadingDelay();
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  writeValue(value: unknown): void {
    this.currentValue = value == null ? '' : String(value);
    this.syncSelectedOption();
    this.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled = isDisabled;
    this.markForCheck();
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (!this.required) {
      return null;
    }

    return this.currentValue.trim() ? null : { required: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: Event): void {
    if (!this.panelOpen) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closePanel();
      this.markForCheck();
    }
  }

  @HostListener('keydown.escape')
  protected handleEscape(): void {
    if (this.panelOpen) {
      this.closePanel();
      this.markForCheck();
    }
  }

  private activeSearchTerm(): string {
    return this.autocomplete ? this.autocompleteSearch : this.panelSearch;
  }

  private queueSearch(search: string): void {
    this.searchChanges.next(search);
  }

  private closePanel(): void {
    this.panelOpen = false;
    this.autocompleteSearch = '';
    this.panelSearch = '';
    this.highlightedIndex = -1;
    this.markForCheck();
  }

  private loadOptions(search: string, page: number, append: boolean): void {
    const normalizedSearch = search.trim();

    if (normalizedSearch.length > 0 && normalizedSearch.length < this.minSearchLength) {
      this.clearLoadingDelay();
      this.renderedOptions = [];
      this.currentPage = 0;
      this.canLoadMore = false;
      this.hasLoadError = false;
      this.loading = false;
      this.highlightedIndex = -1;
      this.markForCheck();
      return;
    }

    if (!this.loadPage) {
      this.clearLoadingDelay();
      this.applyStaticOptions(normalizedSearch, page, append);
      return;
    }

    this.clearLoadingDelay();
    this.loading = false;
    this.hasLoadError = false;
    this.panelOpen = true;
    this.loadSubscription?.unsubscribe();
    this.loadingDelayHandle = setTimeout(() => {
      this.loading = true;
      this.loadingDelayHandle = null;
      this.markForCheck();
    }, 150);
    this.loadSubscription = this.loadPage({
      page,
      size: this.pageSize,
      ...(normalizedSearch ? { search: normalizedSearch } : {})
    })
      .pipe(
        take(1),
        finalize(() => {
          this.clearLoadingDelay();
          this.loading = false;
          this.markForCheck();
        })
      )
      .subscribe({
        next: (pageData) => {
          this.currentPage = pageData.page;
          this.canLoadMore = !pageData.last;
          this.renderedOptions = append
            ? [...this.renderedOptions, ...pageData.content]
            : pageData.content;
          this.highlightedIndex = this.renderedOptions.length > 0
            ? append && this.highlightedIndex >= 0
              ? this.highlightedIndex
              : 0
            : -1;
          this.panelOpen = true;
          this.syncSelectedOption();
          this.markForCheck();
        },
        error: () => {
          this.hasLoadError = true;
          this.renderedOptions = [];
          this.currentPage = 0;
          this.canLoadMore = false;
          this.highlightedIndex = -1;
          this.panelOpen = true;
          this.markForCheck();
        }
      });
  }

  private applyStaticOptions(search: string, page: number, append: boolean): void {
    this.clearLoadingDelay();
    this.loading = false;
    this.hasLoadError = false;
    const filteredOptions = this.staticOptions.filter((option) => this.matchesSearch(option, search));
    const start = page * this.pageSize;
    const nextOptions = filteredOptions.slice(start, start + this.pageSize);

    this.currentPage = page;
    this.canLoadMore = start + this.pageSize < filteredOptions.length;
    this.renderedOptions = append ? [...this.renderedOptions, ...nextOptions] : nextOptions;
    this.highlightedIndex = this.renderedOptions.length > 0
      ? append && this.highlightedIndex >= 0
        ? this.highlightedIndex
        : 0
      : -1;
    this.syncSelectedOption();
    this.markForCheck();
  }

  private moveHighlight(step: number): void {
    if (!this.renderedOptions.length) {
      this.highlightedIndex = -1;
      this.markForCheck();
      return;
    }

    if (this.highlightedIndex < 0) {
      this.highlightedIndex = 0;
      this.markForCheck();
      return;
    }

    const nextIndex = this.highlightedIndex + step;
    this.highlightedIndex = Math.min(Math.max(nextIndex, 0), this.renderedOptions.length - 1);
    this.markForCheck();
  }

  private selectHighlightedOption(): void {
    if (this.highlightedIndex < 0 || this.highlightedIndex >= this.renderedOptions.length) {
      return;
    }

    this.selectOption(this.renderedOptions[this.highlightedIndex]);
  }

  private matchesSearch(option: LookupOption, search: string): boolean {
    if (!search) {
      return true;
    }

    const normalizedSearch = search.toLowerCase();
    const searchableValues = [
      option.code,
      option.name,
      option.extraLabel ?? '',
      ...Object.values(option.metadata ?? {})
    ];

    return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch));
  }

  private syncSelectedOption(): void {
    if (!this.currentValue.trim()) {
      this.selectedOption = null;
      this.onValidatorChange();
      return;
    }

    const knownOptions = [
      ...(this.initialOptionValue ? [this.initialOptionValue] : []),
      ...this.staticOptions,
      ...this.renderedOptions
    ];
    this.selectedOption = knownOptions.find((option) => option.id === this.currentValue) ?? null;
    this.onValidatorChange();
  }

  private clearLoadingDelay(): void {
    if (this.loadingDelayHandle !== null) {
      clearTimeout(this.loadingDelayHandle);
      this.loadingDelayHandle = null;
    }
  }

  private markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }
}
