import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationHostComponent } from './notification-host.component';
import { NotificationService } from './notification.service';

describe('NotificationHostComponent', () => {
  let fixture: ComponentFixture<NotificationHostComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [NotificationHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationHostComponent);
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.dismissAll();
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('renders a single notification', () => {
    service.success('Record creato con successo.');
    fixture.detectChanges();

    const host = fixture.nativeElement;
    const toast = host.querySelector('.app-toast-feedback') as HTMLElement;
    const title = host.querySelector('.app-toast-feedback-title') as HTMLElement;
    const message = host.querySelector('.app-toast-feedback-description') as HTMLElement;

    expect(toast).not.toBeNull();
    expect(title.textContent).toContain('Operazione completata');
    expect(message.textContent).toContain('Record creato con successo.');
    expect(host.querySelector('.app-toast-feedback-icon .ki-check-circle')).not.toBeNull();
  });

  it('renders multiple notifications', () => {
    service.success('Uno');
    service.warning('Due');
    service.error('Tre');
    fixture.detectChanges();

    const host = fixture.nativeElement;

    expect(host.querySelectorAll('.app-toast-feedback')).toHaveLength(3);
    expect(host.querySelectorAll('.app-toast-feedback-icon .ki-check-circle')).toHaveLength(1);
    expect(host.querySelectorAll('.app-toast-feedback-icon .ki-notification-status')).toHaveLength(1);
    expect(host.querySelectorAll('.app-toast-feedback-icon .ki-cross-circle')).toHaveLength(1);
  });

  it('dismisses a notification when close is clicked', () => {
    service.warning('Da chiudere', { titleKey: 'alert.title.warning' });
    fixture.detectChanges();

    const host = fixture.nativeElement;
    const closeButton = host.querySelector('.app-toast-feedback-close') as HTMLButtonElement;

    closeButton.click();
    fixture.detectChanges();

    expect(host.querySelector('.app-toast-feedback')).toBeNull();
  });

  it('forwards variant, message and title to alert component', () => {
    service.warning('Messaggio custom', { titleKey: 'alert.title.info' });
    fixture.detectChanges();

    const host = fixture.nativeElement;
    const toast = host.querySelector('.app-toast-feedback') as HTMLElement;

    expect(toast.classList).toContain('kt-alert-warning');
    expect(host.querySelector('.app-toast-feedback-title')?.textContent).toContain('Informazione');
    expect(host.querySelector('.app-toast-feedback-description')?.textContent).toContain('Messaggio custom');
    expect(host.querySelector('.app-toast-feedback-icon .ki-notification-status')).not.toBeNull();
  });
});
