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
    expect(cells[1].textContent?.trim()).toBe('—');
  });

  it('renders the empty state', () => {
    component.columns = [];
    component.rows = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun dato disponibile.');
  });

  it('renders the configured no results state', () => {
    component.columns = [];
    component.rows = [];
    component.emptyMessageKey = 'dataTable.noResults';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun risultato per i filtri correnti.');
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
    const pageChangeSpy = vi.fn();
    const pageSizeChangeSpy = vi.fn();
    component.previousPage.subscribe(previousSpy);
    component.nextPage.subscribe(nextSpy);
    component.pageChange.subscribe(pageChangeSpy);
    component.pageSizeChange.subscribe(pageSizeChangeSpy);
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [{ id: 'country-1', name: 'Italy' }];
    component.pageData = {
      page: 1,
      size: 20,
      totalElements: 50,
      totalPages: 4,
      first: false,
      last: false
    };

    fixture.detectChanges();

    const navButtons = fixture.nativeElement.querySelectorAll('.data-table-pagination-nav') as NodeListOf<HTMLButtonElement>;
    const pageButtons = fixture.nativeElement.querySelectorAll('.data-table-pagination-page') as NodeListOf<HTMLButtonElement>;
    const pageSizeSelect = fixture.nativeElement.querySelector('.data-table-page-size-select') as HTMLSelectElement;
    expect(pageSizeSelect.value).toBe('20');
    navButtons[0].click();
    pageButtons[0].click();
    pageSizeSelect.value = '50';
    pageSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    navButtons[1].click();

    expect(previousSpy).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(pageChangeSpy).toHaveBeenCalledWith(0);
    expect(pageSizeChangeSpy).toHaveBeenCalledWith(50);
  });

  it('renders numeric pagination with ellipsis for long result sets', () => {
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [{ id: 'country-1', name: 'Italy' }];
    component.pageData = {
      page: 3,
      size: 20,
      totalElements: 240,
      totalPages: 12,
      first: false,
      last: false
    };

    fixture.detectChanges();

    const pageButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.data-table-pagination-page') as NodeListOf<HTMLButtonElement>
    ).map((button) => button.textContent?.trim());
    const ellipsis = fixture.nativeElement.querySelectorAll('.data-table-pagination-ellipsis');
    const pageSizeLabel = fixture.nativeElement.querySelector('.data-table-page-size-label');

    expect(pageButtons).toEqual(['1', '2', '3', '4', '5', '11', '12']);
    expect(ellipsis).toHaveLength(1);
    expect(pageSizeLabel?.textContent).toContain('Elementi per pagina');
  });

  it('renders an icon for every configured row action and emits the selected action', () => {
    const rowActionSpy = vi.fn();
    component.rowAction.subscribe(rowActionSpy);
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [{ id: 'department-1', name: 'Human Resources' }];
    component.rowActions = [
      { id: 'view', labelKey: 'masterData.actions.view' },
      { id: 'edit', labelKey: 'masterData.actions.edit' },
      { id: 'deactivate', labelKey: 'masterData.actions.delete', tone: 'danger' },
      { id: 'deletePhysical', labelKey: 'masterData.actions.deletePhysical', tone: 'danger' }
    ] satisfies readonly DataTableAction<DataTableRow>[];

    fixture.detectChanges();

    const headerElements = fixture.nativeElement.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>;
    const headers = Array.from(headerElements).map((header) => header.textContent?.trim());
    const buttons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    const icons = fixture.nativeElement.querySelectorAll('.data-table-action .data-table-action-icon') as NodeListOf<HTMLElement>;

    expect(headers).toContain('Azioni');
    expect(buttons).toHaveLength(4);
    expect(icons).toHaveLength(4);
    expect(buttons[0].textContent?.trim()).toBe('');
    expect(icons[0].className).toContain('ki-eye');
    expect(icons[1].className).toContain('ki-pencil');
    expect(icons[2].className).toContain('ki-minus-circle');
    expect(icons[3].className).toContain('ki-trash');
    expect(buttons[0].getAttribute('aria-label')).toBe('Visualizza');
    expect(buttons[1].getAttribute('aria-label')).toBe('Modifica');
    expect(buttons[2].getAttribute('aria-label')).toBe('Disattiva');
    expect(buttons[3].getAttribute('aria-label')).toBe('Elimina');

    buttons[1].click();

    expect(rowActionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.objectContaining({ id: 'edit' }),
        row: expect.objectContaining({ id: 'department-1' })
      })
    );
  });

  it('supports row-specific action visibility', () => {
    component.columns = [{ key: 'name', labelKey: 'masterData.columns.name' }];
    component.rows = [
      { id: 'role-system', name: 'System role', systemRole: true },
      { id: 'role-custom', name: 'Custom role', systemRole: false }
    ];
    component.rowActions = [
      { id: 'view', labelKey: 'masterData.actions.view' },
      {
        id: 'edit',
        labelKey: 'masterData.actions.edit',
        visible: (row) => row['systemRole'] !== true
      }
    ] satisfies readonly DataTableAction<DataTableRow>[];

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    const firstRowButtons = rows[0].querySelectorAll('.data-table-action');
    const secondRowButtons = rows[1].querySelectorAll('.data-table-action');

    expect(firstRowButtons).toHaveLength(1);
    expect(secondRowButtons).toHaveLength(2);
  });
});
