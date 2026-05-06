import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { MasterDataAdminComponent } from './master-data-admin.component';
import { MasterDataRow } from './master-data.models';
import { MasterDataService } from './master-data.service';

describe('MasterDataAdminComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('loads the default global resource and renders read-only rows', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const masterDataService = {
      fetchRows: vi.fn(() =>
        of([
          {
            id: 'country-1',
            isoCode: 'IT',
            name: 'Italia',
            active: true,
            updatedAt: '2026-05-06T09:00:00Z'
          }
        ])
      )
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/global/countries' })
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
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(
          of([
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
    };

    const fixture = await createFixture(masterDataService);
    fixture.detectChanges();

    const categorySelect = fixture.nativeElement.querySelectorAll('select')[0] as HTMLSelectElement;
    categorySelect.value = 'hrBusiness';
    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(masterDataService.fetchRows).toHaveBeenLastCalledWith(
      expect.objectContaining({ endpoint: '/api/master-data/hr-business/departments' })
    );
    expect(fixture.nativeElement.textContent).toContain('Human Resources');
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
          new Observable<readonly MasterDataRow[]>(() => () => {
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
