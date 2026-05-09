import { Injectable, computed, signal } from '@angular/core';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { AlertMessageType } from './alert-message.component';

export interface Notification {
  readonly id: string;
  readonly type: AlertMessageType;
  readonly message: string;
  readonly titleKey?: I18nKey;
  readonly dismissible: boolean;
  readonly autoHideMs?: number;
}

export interface NotificationOptions {
  readonly titleKey?: I18nKey;
  readonly dismissible?: boolean;
  readonly autoHideMs?: number;
}

const DEFAULT_DISMISSIBLE = false;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<readonly Notification[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly notifications = computed(() => this.notificationsSignal());

  success(message: string, options: NotificationOptions = {}): string {
    return this.show('success', message, {
      ...options,
      dismissible: options.dismissible ?? true,
      autoHideMs: options.autoHideMs ?? 4500
    });
  }

  error(message: string, options: NotificationOptions = {}): string {
    return this.show('danger', message, {
      ...options,
      dismissible: options.dismissible ?? true
    });
  }

  warning(message: string, options: NotificationOptions = {}): string {
    return this.show('warning', message, {
      ...options,
      dismissible: options.dismissible ?? true,
      autoHideMs: options.autoHideMs ?? 6000
    });
  }

  info(message: string, options: NotificationOptions = {}): string {
    return this.show('info', message, {
      ...options,
      dismissible: options.dismissible ?? true,
      autoHideMs: options.autoHideMs ?? 5000
    });
  }

  dismiss(id: string): void {
    const nextNotifications = this.notificationsSignal().filter((item) => item.id !== id);

    if (nextNotifications.length !== this.notificationsSignal().length) {
      this.notificationsSignal.set(nextNotifications);
    }

    this.clearTimer(id);
  }

  dismissAll(): void {
    this.notificationsSignal.set([]);
    this.timers.forEach((_timer, id) => this.clearTimer(id));
    this.timers.clear();
  }

  private show(type: AlertMessageType, message: string, options: NotificationOptions = {}): string {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return '';
    }

    const id = this.createId();
    const notification: Notification = {
      id,
      type,
      message: trimmedMessage,
      titleKey: options.titleKey,
      dismissible: options.dismissible ?? DEFAULT_DISMISSIBLE,
      ...(options.autoHideMs ? { autoHideMs: options.autoHideMs } : {})
    };

    this.notificationsSignal.set([...this.notificationsSignal(), notification]);

    const duration = options.autoHideMs;
    if (duration && duration > 0) {
      this.timers.set(
        id,
        setTimeout(() => {
          this.dismiss(id);
        }, duration)
      );
    }

    return id;
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);
  }

  private createId(): string {
    return Math.random().toString(36).slice(2);
  }
}

