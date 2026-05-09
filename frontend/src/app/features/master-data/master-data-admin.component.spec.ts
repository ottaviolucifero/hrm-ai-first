import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { MasterDataAdminComponent } from './master-data-admin.component';
import { MasterDataPage, MasterDataRow } from './master-data.models';
import { MasterDataService } from './master-data.service';
import { NotificationService } from '../../shared/feedback/notification.service';

describe('MasterDataAdminComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('loads the default global resource and renders read-only rows', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi.fn(() =>
        of(
          createPage([
            {
              id: 'country-1',
              isoCode: 'IT',
              name: 'Italia',
              active: true,
              updatedAt: '2026-05-06T09:00:00Z'
            }
          ])
        )
      )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' }),
      { page: 0, size: 20 }
    );
    expect(fixture.nativeElement.textContent).toContain('Dati di base');
    expect(fixture.nativeElement.textContent).toContain('Italia');
    expect(fixture.nativeElement.textContent).toContain('Si');
    expect((fixture.nativeElement.querySelector('.data-table-page-size-select') as HTMLSelectElement).value).toBe('20');
  });

  it('reloads the first resource of the selected category', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true,
                updatedAt: '2026-05-06T09:00:00Z'
              }
            ])
          )
        )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 20 }
    );
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
  });

  it('applies the generic filter with debounce', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi.fn(() => of(createPage([])))
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    searchInput.value = 'ital';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' }),
      { page: 0, size: 20, search: 'ital' }
    );
    expect(fixture.nativeElement.textContent).toContain('Nessun risultato per i filtri correnti.');
  });

  it('changes page with the pagination controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(
          of(
            createPage(
              [
                {
                  id: 'country-1',
                  isoCode: 'IT',
                  name: 'Italia',
                  active: true,
                  updatedAt: '2026-05-06T09:00:00Z'
                }
              ],
              { last: false, totalPages: 2, totalElements: 2 }
            )
          )
        )
        .mockReturnValueOnce(
          of(
            createPage(
              [
                {
                  id: 'country-2',
                  isoCode: 'FR',
                  name: 'Francia',
                  active: true,
                  updatedAt: '2026-05-06T09:00:00Z'
                }
              ],
              { page: 1, first: false, totalPages: 2, totalElements: 2 }
            )
          )
        )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelectorAll('.data-table-pagination-nav')[1] as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' }),
      { page: 1, size: 20 }
    );
    expect(fixture.nativeElement.textContent).toContain('Francia');
  });

  it('reloads from the first page when page size changes', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage(
              [
                {
                  id: 'department-1',
                  tenantId: 'tenant-1',
                  code: 'HR',
                  name: 'Human Resources',
                  active: true,
                  updatedAt: '2026-05-06T09:00:00Z'
                }
              ],
              { totalElements: 42, totalPages: 3, last: false }
            )
          )
        )
        .mockReturnValueOnce(
          of(
            createPage(
              [
                {
                  id: 'department-1',
                  tenantId: 'tenant-1',
                  code: 'HR',
                  name: 'Human Resources',
                  active: true,
                  updatedAt: '2026-05-06T09:00:00Z'
                }
              ],
              { size: 50, totalElements: 42, totalPages: 1 }
            )
          )
        )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const pageSizeSelect = fixture.nativeElement.querySelector('.data-table-page-size-select') as HTMLSelectElement;
    pageSizeSelect.value = '50';
    pageSizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 50 }
    );
  });

  it('shows the generic error state when the resource load fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi.fn(() => throwError(() => new Error('request failed')))
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i dati.');
  });

  it('keeps read-only resources without row actions', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi.fn(() => of(createPage([{ id: 'country-1', isoCode: 'IT', name: 'Italia', active: true }])))
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    const newButton = fixture.nativeElement.querySelector('.master-data-toolbar-actions .kt-btn-primary') as HTMLButtonElement | null;
    const toolbarButtons = fixture.nativeElement.querySelectorAll('.master-data-toolbar-actions button') as NodeListOf<HTMLButtonElement>;

    expect(actionButtons).toHaveLength(0);
    expect(newButton).toBeNull();
    expect(toolbarButtons).toHaveLength(0);
  });

  it('receives row action events for CRUD candidate resources', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true,
                updatedAt: '2026-05-06T09:00:00Z'
              }
            ])
          )
        )
    });

    const fixture = await createFixture(masterDataService);
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      lastTriggeredRowAction: () => unknown;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;

    expect(actionButtons).toHaveLength(4);

    actionButtons[0].click();
    fixture.detectChanges();

    expect(component.lastTriggeredRowAction()).toEqual(
      expect.objectContaining({
        action: expect.objectContaining({ id: 'view' }),
        row: expect.objectContaining({ id: 'department-1' })
      })
    );
    expect(fixture.nativeElement.textContent).toContain('Visualizza');
  });

  it('opens create form from toolbar on CRUD-enabled resource', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(of(createPage([])))
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const newButton = fixture.nativeElement.querySelector('.master-data-toolbar-actions .kt-btn-primary') as HTMLButtonElement;
    const toolbarButtons = fixture.nativeElement.querySelectorAll('.master-data-toolbar-actions button') as NodeListOf<HTMLButtonElement>;
    expect(toolbarButtons).toHaveLength(1);
    newButton.click();
    fixture.detectChanges();

    const formPanel = fixture.nativeElement.querySelector('app-master-data-form');
    const modalOverlay = fixture.nativeElement.querySelector('.master-data-modal-overlay');
    const modalDialog = fixture.nativeElement.querySelector('.master-data-modal');
    expect(formPanel).not.toBeNull();
    expect(modalOverlay).not.toBeNull();
    expect(modalDialog).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Nuovo');
    expect(fixture.nativeElement.textContent).toContain('Salva');
    expect(fixture.nativeElement.textContent).toContain('Annulla');
  });

  it('creates a row with authenticated tenant and reloads the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        ),
      createRow: vi.fn(() => of({ id: 'department-1' }))
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleFormSave: (event: { mode: 'create'; value: Record<string, unknown> }) => void;
      pageIndex: { set: (page: number) => void };
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.pageIndex.set(2);

    component.handleFormSave({
      mode: 'create',
      value: { code: 'HR', name: 'Human Resources', active: true }
    });
    fixture.detectChanges();

    expect(masterDataService.createRow).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      {
        tenantId: 'tenant-1',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    );
    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 20 }
    );
    expect(successSpy).toHaveBeenCalledWith(
      expect.stringContaining('Elemento creato con successo.'),
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('keeps the form open and shows a readable error when save fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(of(createPage([]))),
      createRow: vi.fn(() =>
        throwError(() => ({
          status: 409,
          error: {
            message: 'Department code already exists for tenant: HR'
          }
        }))
      )
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      openCreateForm: () => void;
      handleFormSave: (event: { mode: 'create'; value: Record<string, unknown> }) => void;
      isFormOpen: () => boolean;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.openCreateForm();
    fixture.detectChanges();

    component.handleFormSave({
      mode: 'create',
      value: { code: 'HR', name: 'Human Resources', active: true }
    });
    fixture.detectChanges();

    expect(component.isFormOpen()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith(
      'Department code already exists for tenant: HR',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('updates an existing row and preserves the row tenant id', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-row',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        )
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-row',
                code: 'HR',
                name: 'People Operations',
                active: true
              }
            ])
          )
        ),
      updateRow: vi.fn(() => of({ id: 'department-1' }))
    });

    const fixture = await createFixture(masterDataService);
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
      handleFormSave: (event: { mode: 'edit'; value: Record<string, unknown> }) => void;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.handleRowAction({
      action: { id: 'edit' },
      row: {
        id: 'department-1',
        tenantId: 'tenant-row',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    });
    fixture.detectChanges();

    component.handleFormSave({
      mode: 'edit',
      value: { code: 'HR', name: 'People Operations', active: true }
    });
    fixture.detectChanges();

    expect(masterDataService.updateRow).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      'department-1',
      {
        tenantId: 'tenant-row',
        code: 'HR',
        name: 'People Operations',
        active: true
      }
    );
  });

  it('opens a confirmation modal before deactivation and allows cancel', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    actionButtons[2].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Conferma disattivazione');
    expect(fixture.nativeElement.textContent).toContain('Human Resources');

    const footerButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.master-data-confirm-panel .kt-modal-footer-actions button')
    ) as HTMLButtonElement[];

    expect(footerButtons[0].textContent).toContain('Annulla');

    const cancelButton = footerButtons[0];

    cancelButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Conferma disattivazione');
  });

  it('opens a physical delete confirmation and deletes row from /physical endpoint', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        )
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        ),
      deletePhysicalRow: vi.fn(() => of(void 0))
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
      confirmDelete: () => void;
      isDeleteConfirmOpen: () => boolean;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    actionButtons[3].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Conferma eliminazione');
    expect(fixture.nativeElement.textContent).toContain('Human Resources');

    component.confirmDelete();
    fixture.detectChanges();

    expect(masterDataService.deletePhysicalRow).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      'department-1'
    );
    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 20 }
    );
    expect(component.isDeleteConfirmOpen()).toBe(false);
    expect(successSpy).toHaveBeenCalledWith(
      expect.stringContaining('Record eliminato correttamente.'),
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
  });

  it('moves to previous page when deleting the last row on a later page', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              },
              {
                id: 'department-2',
                tenantId: 'tenant-1',
                code: 'FIN',
                name: 'Finance',
                active: true
              }
            ], {
              page: 0,
              first: true,
              last: false,
              totalPages: 2,
              totalElements: 2
            })
          )
        )
        .mockReturnValueOnce(
          of(
            createPage(
              [
                {
                  id: 'department-3',
                  tenantId: 'tenant-1',
                  code: 'IT',
                  name: 'IT',
                  active: true
                }
              ],
              {
                page: 1,
                first: false,
                last: true,
                totalPages: 2,
                totalElements: 1
              }
            )
          )
        )
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        ),
      deletePhysicalRow: vi.fn(() => of(void 0))
    });

    const fixture = await createFixture(masterDataService);
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      refresh: () => void;
      pageIndex: { set: (page: number) => void };
      isDeleteConfirmOpen: () => boolean;
      confirmDelete: () => void;
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.pageIndex.set(1);
    component.refresh();
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 1, size: 20 }
    );

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    actionButtons[3].click();
    fixture.detectChanges();

    component.confirmDelete();
    fixture.detectChanges();

    expect(((component as unknown as { pageIndex: () => number }).pageIndex)()).toBe(0);
    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 20 }
    );
  });

  it('keeps the confirmation open and shows a readable error when physical delete fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        ),
      deletePhysicalRow: vi.fn(() => throwError(() => ({ status: 409 })))
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
      confirmDelete: () => void;
      isDeleteConfirmOpen: () => boolean;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const actionButtons = fixture.nativeElement.querySelectorAll('.data-table-action') as NodeListOf<HTMLButtonElement>;
    actionButtons[3].click();
    fixture.detectChanges();

    component.confirmDelete();
    fixture.detectChanges();

    expect(component.isDeleteConfirmOpen()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith(
      'Il record non puo essere eliminato perche e collegato ad altri dati.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('deactivates a candidate row, keeps page state and reloads the list', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        )
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: false
              }
            ])
          )
        ),
      deleteRow: vi.fn(() => of(void 0))
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const successSpy = vi.spyOn(notificationService, 'success');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
      confirmDelete: () => void;
      isDeleteConfirmOpen: () => boolean;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.handleRowAction({
      action: { id: 'deactivate' },
      row: {
        id: 'department-1',
        tenantId: 'tenant-1',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    });
    fixture.detectChanges();

    component.confirmDelete();
    fixture.detectChanges();

    expect(masterDataService.deleteRow).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      'department-1'
    );
    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 20 }
    );
    expect(component.isDeleteConfirmOpen()).toBe(false);
    expect(successSpy).toHaveBeenCalledWith(
      expect.stringContaining('Record disattivato correttamente.'),
      expect.objectContaining({ titleKey: 'alert.title.success' })
    );
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
  });

  it('keeps the confirmation open and shows a readable error when delete fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = createMasterDataService({
      fetchRows: vi
        .fn()
        .mockReturnValueOnce(of(createPage([])))
        .mockReturnValueOnce(
          of(
            createPage([
              {
                id: 'department-1',
                tenantId: 'tenant-1',
                code: 'HR',
                name: 'Human Resources',
                active: true
              }
            ])
          )
        ),
      deleteRow: vi.fn(() => throwError(() => ({ status: 403 })))
    });

    const fixture = await createFixture(masterDataService);
    const notificationService = TestBed.inject(NotificationService);
    const errorSpy = vi.spyOn(notificationService, 'error');
    const component = fixture.componentInstance as MasterDataAdminComponent & {
      handleRowAction: (event: { action: { id: string }; row: Record<string, unknown> }) => void;
      confirmDelete: () => void;
      isDeleteConfirmOpen: () => boolean;
    };
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    component.handleRowAction({
      action: { id: 'deactivate' },
      row: {
        id: 'department-1',
        tenantId: 'tenant-1',
        code: 'HR',
        name: 'Human Resources',
        active: true
      }
    });
    fixture.detectChanges();

    component.confirmDelete();
    fixture.detectChanges();

    expect(component.isDeleteConfirmOpen()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith(
      'Non sei autorizzato a disattivare questo record.',
      expect.objectContaining({ titleKey: 'alert.title.danger' })
    );
  });

  it('releases the active subscription on destroy', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    let unsubscribed = false;
    const masterDataService = createMasterDataService({
      fetchRows: vi.fn(
        () =>
          new Observable<MasterDataPage<MasterDataRow>>(() => () => {
            unsubscribed = true;
          })
      )
    });

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    fixture.destroy();

    expect(unsubscribed).toBe(true);
  });
});

async function createFixture(
  masterDataService: Pick<MasterDataService, 'fetchRows' | 'createRow' | 'updateRow' | 'deleteRow' | 'deletePhysicalRow'>
) {
  await TestBed.configureTestingModule({
    imports: [MasterDataAdminComponent],
    providers: [
      { provide: MasterDataService, useValue: masterDataService },
      {
        provide: AuthService,
        useValue: {
          loadAuthenticatedUser: () => of({ id: 'user-1', tenantId: 'tenant-1', email: 'qa@example.com', userType: 'TENANT_ADMIN' })
        }
      }
    ]
  }).compileComponents();

  return TestBed.createComponent(MasterDataAdminComponent);
}

function createMasterDataService(
  overrides: Partial<
    Pick<MasterDataService, 'fetchRows' | 'createRow' | 'updateRow' | 'deleteRow' | 'deletePhysicalRow'>
  >
): Pick<MasterDataService, 'fetchRows' | 'createRow' | 'updateRow' | 'deleteRow' | 'deletePhysicalRow'> {
  return {
    fetchRows: vi.fn(() => of(createPage([]))),
    createRow: vi.fn(),
    updateRow: vi.fn(),
    deleteRow: vi.fn(),
    deletePhysicalRow: vi.fn(),
    ...overrides
  };
}

function createPage(
  content: readonly MasterDataRow[],
  overrides: Partial<MasterDataPage<MasterDataRow>> = {}
): MasterDataPage<MasterDataRow> {
  return {
    content,
    page: 0,
    size: 20,
    totalElements: content.length,
    totalPages: content.length > 0 ? 1 : 0,
    first: true,
    last: true,
    ...overrides
  };
}

