import { Component, inject } from '@angular/core';

import { AlertMessageComponent } from './alert-message.component';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-host',
  imports: [AlertMessageComponent],
  templateUrl: './notification-host.component.html',
  styleUrl: './notification-host.component.scss'
})
export class NotificationHostComponent {
  private readonly notificationService = inject(NotificationService);

  protected readonly notifications = this.notificationService.notifications;

  protected dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}

