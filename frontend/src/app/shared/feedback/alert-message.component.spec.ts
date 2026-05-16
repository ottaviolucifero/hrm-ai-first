import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageComponent } from './alert-message.component';

describe('AlertMessageComponent', () => {
  let fixture: ComponentFixture<AlertMessageComponent>;
  let component: AlertMessageComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [AlertMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertMessageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders a success toast with title, message and icon', () => {
    component.type = 'success';
    component.message = 'Elemento creato con successo.';

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operazione completata');
    expect(fixture.nativeElement.textContent).toContain('Elemento creato con successo.');
    expect(fixture.nativeElement.querySelector('.app-toast-feedback-icon .ki-check-circle')).not.toBeNull();
  });

  it('renders semantic icons for danger, warning and info messages', () => {
    const cases = [
      { type: 'danger', icon: 'ki-cross-circle', title: 'Errore' },
      { type: 'warning', icon: 'ki-notification-status', title: 'Attenzione' },
      { type: 'info', icon: 'ki-information-2', title: 'Informazione' }
    ] as const;

    for (const currentCase of cases) {
      const caseFixture = TestBed.createComponent(AlertMessageComponent);
      const caseComponent = caseFixture.componentInstance;

      caseComponent.type = currentCase.type;
      caseComponent.message = 'Messaggio';
      caseFixture.detectChanges();

      expect(caseFixture.nativeElement.textContent).toContain(currentCase.title);
      expect(caseFixture.nativeElement.querySelector(`.app-toast-feedback-icon .${currentCase.icon}`)).not.toBeNull();

      caseFixture.destroy();
    }
  });

  it('dismisses the toast when dismissible close is clicked', () => {
    component.type = 'info';
    component.message = 'Messaggio informativo';
    component.dismissible = true;

    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.app-toast-feedback-close') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.app-toast-feedback')).toBeNull();
  });

  it('auto hides after configured duration', () => {
    component.type = 'success';
    component.message = 'Messaggio temporaneo';
    component.autoHideMs = 80;
    const dismissedSpy = vi.fn();
    const subscription = component.dismissedEvent.subscribe(dismissedSpy);
    let timeoutCallback: (() => void) | undefined;
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((callback: () => void) => {
        timeoutCallback = callback;
        return 0;
      }) as typeof window.setTimeout);

    fixture.detectChanges();
    (component as unknown as { startAutoHide: () => void }).startAutoHide();
    if (typeof timeoutCallback === 'function') {
      timeoutCallback();
    }

    setTimeoutSpy.mockRestore();
    expect(dismissedSpy).toHaveBeenCalledTimes(1);
    expect(component.visible).toBe(false);

    subscription.unsubscribe();
  });
});
