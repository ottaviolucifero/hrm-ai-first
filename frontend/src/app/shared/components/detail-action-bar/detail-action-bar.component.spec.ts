import { TestBed } from '@angular/core/testing';

import { DetailActionBarComponent } from './detail-action-bar.component';

describe('DetailActionBarComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders back, secondary, primary, and destructive actions', async () => {
    const fixture = await createFixture();
    fixture.componentRef.setInput('backLabel', 'Back to list');
    fixture.componentRef.setInput('secondaryActions', [
      { id: 'toggle', label: 'Deactivate' }
    ]);
    fixture.componentRef.setInput('primaryAction', { id: 'edit', label: 'Edit' });
    fixture.componentRef.setInput('destructiveActions', [
      { id: 'delete', label: 'Delete permanently' }
    ]);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;
    expect(textContent).toContain('Back to list');
    expect(textContent).toContain('Deactivate');
    expect(textContent).toContain('Edit');
    expect(textContent).toContain('Delete permanently');
    expect(fixture.nativeElement.querySelector('.detail-action-bar__separator')).not.toBeNull();
  });

  it('emits backPressed when the back action is clicked', async () => {
    const fixture = await createFixture();
    fixture.componentRef.setInput('backLabel', 'Back to list');
    const emitSpy = vi.fn();
    fixture.componentInstance.backPressed.subscribe(emitSpy);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Back to list');

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits actionPressed with the action id when a visible action is clicked', async () => {
    const fixture = await createFixture();
    fixture.componentRef.setInput('backLabel', 'Back to list');
    fixture.componentRef.setInput('secondaryActions', [
      { id: 'toggle', label: 'Deactivate' }
    ]);
    fixture.componentRef.setInput('primaryAction', { id: 'edit', label: 'Edit' });
    fixture.componentRef.setInput('destructiveActions', [
      { id: 'delete', label: 'Delete permanently' }
    ]);
    const emitSpy = vi.fn();
    fixture.componentInstance.actionPressed.subscribe(emitSpy);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Deactivate');
    clickButtonByText(fixture.nativeElement, 'Edit');
    clickButtonByText(fixture.nativeElement, 'Delete permanently');

    expect(emitSpy).toHaveBeenNthCalledWith(1, 'toggle');
    expect(emitSpy).toHaveBeenNthCalledWith(2, 'edit');
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'delete');
  });

  it('does not emit click events for disabled or loading actions', async () => {
    const fixture = await createFixture();
    fixture.componentRef.setInput('backLabel', 'Back to list');
    fixture.componentRef.setInput('secondaryActions', [
      { id: 'toggle', label: 'Deactivate', disabled: true },
      { id: 'archive', label: 'Archive', loading: true, loadingLabel: 'Archiving...' }
    ]);
    const emitSpy = vi.fn();
    fixture.componentInstance.actionPressed.subscribe(emitSpy);
    fixture.detectChanges();

    clickButtonByText(fixture.nativeElement, 'Deactivate');
    clickButtonByText(fixture.nativeElement, 'Archiving...');

    expect(emitSpy).not.toHaveBeenCalled();
  });
});

async function createFixture() {
  await TestBed.configureTestingModule({
    imports: [DetailActionBarComponent]
  }).compileComponents();

  return TestBed.createComponent(DetailActionBarComponent);
}

function clickButtonByText(root: HTMLElement, text: string): void {
  const button = Array.from(root.querySelectorAll('button')).find((candidate) =>
    (candidate.textContent ?? '').includes(text)
  );
  expect(button).toBeDefined();
  button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
