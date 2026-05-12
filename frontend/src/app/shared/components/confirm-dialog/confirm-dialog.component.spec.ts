import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogConfig } from './confirm-dialog.models';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders the insertion confirmation variant', () => {
    component.config = createConfig({
      titleKey: 'confirmDialog.insert.title',
      messageKey: 'confirmDialog.insert.message',
      confirmLabelKey: 'confirmDialog.insert.confirm',
      severity: 'info',
      targetLabelKey: 'confirmDialog.target.selectedEntity',
      targetValue: 'Contratto_Nazionale_2023_Q4.pdf'
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Conferma inserimento');
    expect(host.textContent).toContain('Sei sicuro di voler inserire questo nuovo record nel sistema?');
    expect(host.textContent).toContain('Entita selezionata');
    expect(host.textContent).toContain('Contratto_Nazionale_2023_Q4.pdf');
    expect(host.querySelector('.confirm-dialog-icon-shell-info .ki-information-2')).not.toBeNull();
  });

  it('renders the system error variant in message mode with a single button', () => {
    component.config = createConfig({
      titleKey: 'confirmDialog.systemError.title',
      messageKey: 'confirmDialog.systemError.message',
      confirmLabelKey: 'confirmDialog.actions.close',
      severity: 'error',
      mode: 'message',
      targetLabelKey: 'confirmDialog.target.errorCode',
      targetValue: '500'
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const buttons = host.querySelectorAll('button');

    expect(host.textContent).toContain('Errore di sistema');
    expect(host.textContent).toContain('500');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toContain('Chiudi');
    expect(host.querySelector('.confirm-dialog-icon-shell-error .ki-cross-circle')).not.toBeNull();
  });

  it('renders the deletion confirmation variant', () => {
    component.config = createConfig({
      titleKey: 'confirmDialog.delete.title',
      messageKey: 'confirmDialog.delete.message',
      confirmLabelKey: 'confirmDialog.delete.confirm',
      severity: 'danger',
      targetValue: 'Contratto_Nazionale_2023_Q4.pdf'
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Conferma eliminazione');
    expect(host.textContent).toContain('Sei sicuro di voler eliminare questo record? L azione e irreversibile.');
    expect(host.querySelector('.confirm-dialog-icon-shell-danger .ki-trash')).not.toBeNull();
  });

  it('emits confirm and cancel events', () => {
    const confirmedSpy = vi.fn();
    const cancelledSpy = vi.fn();
    component.config = createConfig({
      titleKey: 'confirmDialog.delete.title',
      messageKey: 'confirmDialog.delete.message'
    });
    component.confirmed.subscribe(confirmedSpy);
    component.cancelled.subscribe(cancelledSpy);

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[1].click();

    expect(cancelledSpy).toHaveBeenCalledTimes(1);
    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });
});

function createConfig(overrides: Partial<ConfirmDialogConfig>): ConfirmDialogConfig {
  return {
    titleKey: 'confirmDialog.delete.title',
    messageKey: 'confirmDialog.delete.message',
    confirmLabelKey: 'confirmDialog.actions.confirm',
    cancelLabelKey: 'confirmDialog.actions.cancel',
    severity: 'info',
    mode: 'confirm',
    ...overrides
  };
}
