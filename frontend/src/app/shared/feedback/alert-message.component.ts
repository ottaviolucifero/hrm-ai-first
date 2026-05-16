import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject
} from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { I18nKey } from '../../core/i18n/i18n.messages';

export type AlertMessageType = 'danger' | 'warning' | 'success' | 'info';

@Component({
  selector: 'app-alert-message',
  imports: [NgClass],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) message = '';
  @Input() type: AlertMessageType = 'info';
  @Input() dismissible = false;
  @Input() titleKey: I18nKey | null = null;
  @Input() autoHideMs?: number;
  @Output() dismissedEvent = new EventEmitter<void>();

  protected dismissed = false;
  private autoHideTimer: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.dismissed = false;
      this.clearAutoHide();
      this.startAutoHide();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoHide();
  }

  get visible(): boolean {
    return this.message.trim().length > 0 && !this.dismissed;
  }

  dismiss(): void {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;
    this.clearAutoHide();
    this.dismissedEvent.emit();
  }

  protected title(): string {
    return this.i18n.t(this.titleKey ?? this.defaultTitleKey());
  }

  protected iconClass(): string {
    const icons: Record<AlertMessageType, string> = {
      danger: 'ki-filled ki-cross-circle',
      warning: 'ki-filled ki-notification-status',
      success: 'ki-filled ki-check-circle',
      info: 'ki-filled ki-information-2'
    };

    return icons[this.type];
  }

  private defaultTitleKey(): I18nKey {
    const titleKeys: Record<AlertMessageType, I18nKey> = {
      danger: 'alert.title.danger',
      warning: 'alert.title.warning',
      success: 'alert.title.success',
      info: 'alert.title.info'
    };

    return titleKeys[this.type];
  }

  private clearAutoHide(): void {
    if (this.autoHideTimer !== null) {
      window.clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  private startAutoHide(): void {
    if (!this.visible || !this.autoHideMs || this.autoHideMs <= 0) {
      return;
    }

    this.autoHideTimer = window.setTimeout(() => {
      this.dismiss();
    }, this.autoHideMs);
  }
}
