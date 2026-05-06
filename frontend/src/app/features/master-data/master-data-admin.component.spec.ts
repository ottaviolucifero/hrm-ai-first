import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { MasterDataAdminComponent } from './master-data-admin.component';
import { MasterDataPage, MasterDataQuery, MasterDataRow } from './master-data.models';
import { MasterDataService } from './master-data.service';

describe('MasterDataAdminComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('loads the default global resource and renders read-only rows', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
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
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' }),
      { page: 0, size: 25 }
    );
    expect(fixture.nativeElement.textContent).toContain('Dati di base');
    expect(fixture.nativeElement.textContent).toContain('Italia');
    expect(fixture.nativeElement.textContent).toContain('Si');
  });

  it('reloads the first resource of the selected category', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
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
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' }),
      { page: 0, size: 25 }
    );
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
  });

  it('applies the generic filter with debounce', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
      fetchRows: vi.fn(() => of(createPage([])))
    };

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
      { page: 0, size: 25, search: 'ital' }
    );
  });

  it('changes page with the pagination controls', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
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
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelectorAll('.master-data-pagination-actions button')[1] as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' }),
      { page: 1, size: 25 }
    );
    expect(fixture.nativeElement.textContent).toContain('Francia');
  });

  it('shows the generic error state when the resource load fails', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
      fetchRows: vi.fn(() => throwError(() => new Error('request failed')))
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile caricare i dati.');
  });

  it('releases the active subscription on destroy', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    let unsubscribed = false;
    const masterDataService = {
      fetchRows: vi.fn(
        () =>
          new Observable<MasterDataPage<MasterDataRow>>(() => () => {
            unsubscribed = true;
          })
      )
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    fixture.destroy();

    expect(unsubscribed).toBe(true);
  });
});

async function createFixture(masterDataService: Pick<MasterDataService, 'fetchRows'>) {
  await TestBed.configureTestingModule({
    imports: [MasterDataAdminComponent],
    providers: [{ provide: MasterDataService, useValue: masterDataService }]
  }).compileComponents();

  return TestBed.createComponent(MasterDataAdminComponent);
}

function createPage(
  content: readonly MasterDataRow[],
  overrides: Partial<MasterDataPage<MasterDataRow>> = {}
): MasterDataPage<MasterDataRow> {
  return {
    content,
    page: 0,
    size: 25,
    totalElements: content.length,
    totalPages: content.length > 0 ? 1 : 0,
    first: true,
    last: true,
    ...overrides
  };
}
