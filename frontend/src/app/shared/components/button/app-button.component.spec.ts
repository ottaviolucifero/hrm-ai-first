import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppButtonComponent } from './app-button.component';

describe('AppButtonComponent', () => {
  let fixture: ComponentFixture<AppButtonComponent>;
  let component: AppButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppButtonComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the requested variant, size and icon classes', () => {
    component.variant = 'secondary';
    component.size = 'sm';
    component.label = 'Nuovo';
    component.icon = 'ki-filled ki-plus';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const icon = fixture.nativeElement.querySelector('i') as HTMLElement;

    expect(button.className).toContain('kt-btn');
    expect(button.className).toContain('kt-btn-secondary');
    expect(button.className).toContain('kt-btn-sm');
    expect(button.textContent).toContain('Nuovo');
    expect(icon.className).toContain('ki-plus');
  });

  it('renders the outline variant', () => {
    component.variant = 'outline';
    component.label = 'Reset';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.className).toContain('kt-btn-outline');
  });

  it('renders the destructive variant', () => {
    component.variant = 'destructive';
    component.label = 'Delete';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.className).toContain('kt-btn-destructive');
  });

  it('respects submit button type', () => {
    component.label = 'Submit';
    component.type = 'submit';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('type')).toBe('submit');
  });

  it('respects reset button type', () => {
    component.label = 'Reset';
    component.type = 'reset';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('type')).toBe('reset');
  });

  it('emits click when enabled', () => {
    const clickSpy = vi.fn();
    component.label = 'Salva';
    component.pressed.subscribe(clickSpy);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('stays disabled when the disabled input is true', () => {
    const clickSpy = vi.fn();
    component.label = 'Salva';
    component.disabled = true;
    component.pressed.subscribe(clickSpy);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBe(true);
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('disables itself and shows the loading spinner when loading', () => {
    const clickSpy = vi.fn();
    component.label = 'Salva';
    component.loading = true;
    component.pressed.subscribe(clickSpy);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const spinner = fixture.nativeElement.querySelector('.app-button-spinner') as HTMLElement | null;
    button.click();

    expect(button.disabled).toBe(true);
    expect(spinner).not.toBeNull();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('uses aria-label for icon only buttons', () => {
    component.variant = 'ghost';
    component.size = 'sm';
    component.iconOnly = true;
    component.icon = 'ki-filled ki-trash';
    component.ariaLabel = 'Elimina';

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.className).toContain('kt-btn-icon');
    expect(button.getAttribute('aria-label')).toBe('Elimina');
    expect(button.textContent?.trim()).toBe('');
  });

  it('throws when icon only button has no explicit aria-label', () => {
    component.iconOnly = true;
    component.icon = 'ki-filled ki-trash';
    component.label = 'Elimina';

    expect(() => fixture.detectChanges()).toThrowError(
      'app-button iconOnly requires a non-empty ariaLabel.'
    );
  });
});
