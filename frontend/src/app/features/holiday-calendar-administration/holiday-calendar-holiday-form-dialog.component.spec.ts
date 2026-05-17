import { TestBed } from '@angular/core/testing';

import { HolidayCalendarHolidayFormDialogComponent } from './holiday-calendar-holiday-form-dialog.component';

describe('HolidayCalendarHolidayFormDialogComponent', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('defaults start and end dates to the parent calendar year in create mode', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      mode: 'create',
      calendarName: 'Italy 2026',
      calendarYear: 2026
    });
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    expect(component.form.controls.startDate.getRawValue()).toBe('2026-01-01');
    expect(component.form.controls.endDate.getRawValue()).toBe('2026-01-01');
    expect(component.showAdvancedOptions()).toBe(false);
  });

  it('keeps existing dates and shows advanced options in edit mode', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      mode: 'edit',
      calendarName: 'Italy 2026',
      calendarYear: 2026,
      holiday: {
        id: 'holiday-1',
        name: 'Republic Day',
        startDate: '2026-06-02',
        endDate: '2026-06-02',
        type: 'FIXED',
        generationRule: 'FIXED_DATE',
        description: null,
        createdAt: '2026-05-10T09:00:00Z',
        updatedAt: '2026-05-15T10:00:00Z'
      }
    });
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    expect(component.form.controls.startDate.getRawValue()).toBe('2026-06-02');
    expect(component.form.controls.endDate.getRawValue()).toBe('2026-06-02');
    expect(component.form.controls.generationRule.getRawValue()).toBe('FIXED_DATE');
    expect(component.showAdvancedOptions()).toBe(true);
  });

  it('submits valid payload even when advanced options stay collapsed', async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    const fixture = await createFixture({
      mode: 'create',
      calendarName: 'Tunisia 2026',
      calendarYear: 2026
    });
    await stabilizeFixture(fixture);

    const component = fixture.componentInstance as any;
    const emitSpy = vi.spyOn(component.submitRequested, 'emit');

    component.form.patchValue({
      name: 'Aid',
      type: 'MOBILE',
      description: 'Multi-day holiday'
    });
    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Aid',
      startDate: '2026-01-01',
      endDate: '2026-01-01',
      type: 'MOBILE',
      generationRule: 'MANUAL',
      description: 'Multi-day holiday'
    });
  });
});

async function createFixture(config: Record<string, unknown>) {
  await TestBed.configureTestingModule({
    imports: [HolidayCalendarHolidayFormDialogComponent]
  }).compileComponents();

  const fixture = TestBed.createComponent(HolidayCalendarHolidayFormDialogComponent);
  fixture.componentRef.setInput('config', config);
  fixture.componentRef.setInput('submitting', false);
  return fixture;
}

async function stabilizeFixture(fixture: any) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}
