import { Component, Input, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';

export type AlertMessageType = 'danger' | 'warning' | 'success' | 'info';

@Component({
  selector: 'app-alert-message',
  imports: [],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  protected readonly i18n = inject(I18nService);

  @Input({ required: true }) message = '';
  @Input() type: AlertMessageType = 'info';
  @Input() dismissible = false;

  protected dismissed = false;

  get visible(): boolean {
    return this.message.trim().length > 0 && !this.dismissed;
  }

  dismiss(): void {
    this.dismissed = true;
  }
}
