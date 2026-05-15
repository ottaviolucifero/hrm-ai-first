import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileGeographyCreateDialogComponent } from './company-profile-geography-create-dialog.component';

describe('CompanyProfileGeographyCreateDialogComponent', () => {
  let fixture: ComponentFixture<CompanyProfileGeographyCreateDialogComponent>;
  let component: CompanyProfileGeographyCreateDialogComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [CompanyProfileGeographyCreateDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyProfileGeographyCreateDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders region mode without a code field and submits only the name', () => {
    const submitSpy = vi.spyOn(component.submitRequested, 'emit');
    component.config = {
      mode: 'region',
      countryName: 'France (FR)',
      areaLabel: 'Area'
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Code');
    expect(fixture.nativeElement.querySelectorAll('app-input').length).toBe(1);

    (component as any).form.controls.name.setValue('Nouvelle-Aquitaine');
    (component as any).submit();

    expect(submitSpy).toHaveBeenCalledWith({
      mode: 'region',
      name: 'Nouvelle-Aquitaine'
    });
  });

  it('renders area mode without a code field and submits only the name', () => {
    const submitSpy = vi.spyOn(component.submitRequested, 'emit');
    component.config = {
      mode: 'area',
      countryName: 'France (FR)',
      regionName: 'Ile-de-France (RE001)',
      areaLabel: 'Area'
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Code');
    expect(fixture.nativeElement.querySelectorAll('app-input').length).toBe(1);

    (component as any).form.controls.name.setValue('Paris');
    (component as any).submit();

    expect(submitSpy).toHaveBeenCalledWith({
      mode: 'area',
      name: 'Paris'
    });
  });

  it('renders zip mode with postalCode and city fields', () => {
    const submitSpy = vi.spyOn(component.submitRequested, 'emit');
    component.config = {
      mode: 'zip',
      countryName: 'France (FR)',
      regionName: 'Ile-de-France (RE001)',
      areaName: 'Paris (AR001)',
      areaLabel: 'Area'
    };
    fixture.detectChanges();

    expect((component as any).form.controls.name.disabled).toBe(true);
    expect((component as any).form.controls.postalCode.enabled).toBe(true);
    expect((component as any).form.controls.city.enabled).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('app-input').length).toBe(2);

    (component as any).form.controls.postalCode.setValue('75002');
    (component as any).form.controls.city.setValue('Paris');
    (component as any).submit();

    expect(submitSpy).toHaveBeenCalledWith({
      mode: 'zip',
      postalCode: '75002',
      city: 'Paris'
    });
  });
});
