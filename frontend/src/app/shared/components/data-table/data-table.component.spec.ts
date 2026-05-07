import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';
import { DataTableAction, DataTableColumn, DataTableRow } from './data-table.models';

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  let component: DataTableComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders configured columns in visual order and resolves nested values', () => {
    component.columns = [
      { key: 'hidden', labelKey: 'masterData.columns.code', visible: false },
      { key: 'country.code', labelKey: 'masterData.columns.country' },
      { key: 'postalCode', labelKey: 'masterData.columns.postalCode', minWidth: '7rem' },
      { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean' }
    ];
    component.rows = [
      {
        id: 'zip-1',
        country: { code: 'IT' },
        postalCode: '10121',
        active: true
      }
    ];

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Paese');
    expect(textContent).toContain('CAP');
    expect(textContent).toContain('IT');
    expect(textContent).toContain('10121');
    expect(textContent).toContain('Si');
    expect(textContent).not.toContain('hidden');
  });

  it('keeps configured columns visible when page values are null or undefined', () => {
    component.columns = [
      { key: 'name', labelKey: 'masterData.columns.name' },
      { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime' }
    ];
    component.rows = [{ id: 'country-1', name: 'Italy', updatedAt: null }];

    fixture.detectChanges();

    const headerElements = fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>;
    const headers = Array.from(headerElements).map((header) =>
      header.textContent?.trim()
    );
    const cells = fixture.nativeElement.querySelectorAll('tbody td') as NodeListOf<HTMLTableCellElement>;

    expect(headers).toEqual(['Nome', 'Aggiornato']);
    expect(cells).toHaveLength(2);
    expect(cells[0].textContent?.trim()).toBe('Italy');
    expect(cells[1].textContent?.trim()).toBe('');
  });

  it('renders the empty state', () => {
    component.columns = [];
    component.rows = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun dato disponibile.');
  });

  it('renders the loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento dati in corso...');
  });

  it('renders the error state', () => {
    component.hasError = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i dati.');
  });

  it('keeps loading state before error state', () => {
    component.loading = true;
    component.hasError = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento dati in corso...');
    expect(fixture.nativeElement.textContent).not.toContain('Impossibile caricare i dati.');
  });

  it('emits pagination events', () => {
    const previousSpy = vi.fn();
    const nextSpy = vi.fn();
    component.previousPage.subscribe(previousSpy);
    component.nextPage.subscribe(nextSpy);
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [{ id: 'country-1', name: 'Italy' }];
    component.pageData = {
      page: 1,
      size: 25,
      totalElements: 50,
      totalPages: 2,
      first: false,
      last: false
    };

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.master-data-pagination-actions button') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[1].click();

    expect(previousSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it('renders configured row actions and emits the selected action', () => {
    const rowActionSpy = vi.fn();
    component.rowAction.subscribe(rowActionSpy);
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [{ id: 'department-1', name: 'Human Resources' }];
    component.rowActions = [
      { id: 'edit', labelKey: 'masterData.actions.edit' },
      { id: 'delete', labelKey: 'masterData.actions.delete', tone: 'danger' }
    ] satisfies readonly DataTableAction<DataTableRow>[];

    fixture.detectChanges();

    const headerElements = fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>;
    const headers = Array.from(headerElements).map((header) => header.textContent?.trim());
    const buttons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    expect(headers).toContain('Azioni');
    expect(buttons).toHaveLength(2);

    buttons[0].click();

    expect(rowActionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.objectContaining({ id: 'edit' }),
        row: expect.objectContaining({ id: 'department-1' })
      })
    );
  });
});
