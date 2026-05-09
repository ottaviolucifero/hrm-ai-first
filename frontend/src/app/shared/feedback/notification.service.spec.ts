import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    window.localStorage.setItem('hrflow.language', 'it');
    TestBed.configureTestingModule({});

    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.dismissAll();
    vi.useRealTimers();
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('creates a success notification', () => {
    const id = service.success('Record salvato.', { titleKey: 'alert.title.success' });

    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(service.notifications()).toHaveLength(1);
    expect(service.notifications()[0]).toMatchObject({
      id,
      type: 'success',
      message: 'Record salvato.',
      titleKey: 'alert.title.success',
      dismissible: true,
      autoHideMs: 4500
    });
  });

  it('creates an error notification', () => {
    const id = service.error('Errore irreversibile', { titleKey: 'alert.title.danger' });

    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(service.notifications()).toHaveLength(1);
    expect(service.notifications()[0]).toMatchObject({
      id,
      type: 'danger',
      message: 'Errore irreversibile',
      titleKey: 'alert.title.danger',
      dismissible: true
    });
  });

  it('creates a warning notification', () => {
    const id = service.warning('Attenzione richiesta', { titleKey: 'alert.title.warning' });

    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(service.notifications()[0]).toMatchObject({
      id,
      type: 'warning',
      message: 'Attenzione richiesta',
      titleKey: 'alert.title.warning',
      dismissible: true,
      autoHideMs: 6000
    });
  });

  it('creates an info notification', () => {
    const id = service.info('Informazione utile', { titleKey: 'alert.title.info' });

    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(service.notifications()[0]).toMatchObject({
      id,
      type: 'info',
      message: 'Informazione utile',
      titleKey: 'alert.title.info',
      dismissible: true,
      autoHideMs: 5000
    });
  });

  it('dismisses a single notification', () => {
    const firstId = service.success('Prima');
    const secondId = service.error('Seconda');

    expect(service.notifications()).toHaveLength(2);

    service.dismiss(firstId);

    expect(service.notifications()).toHaveLength(1);
    expect(service.notifications()[0].id).toBe(secondId);
  });

  it('dismisses all notifications', () => {
    service.success('Prima');
    service.warning('Seconda');
    service.info('Terza');

    expect(service.notifications()).toHaveLength(3);

    service.dismissAll();

    expect(service.notifications()).toHaveLength(0);
  });

  it('hides notifications automatically when auto-hide is configured', () => {
    vi.useFakeTimers();

    service.success('Temp', { autoHideMs: 500 });

    expect(service.notifications()).toHaveLength(1);

    vi.advanceTimersByTime(499);
    expect(service.notifications()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(service.notifications()).toHaveLength(0);
  });
});
