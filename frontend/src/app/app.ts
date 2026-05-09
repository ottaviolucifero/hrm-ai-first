import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { I18nService } from './core/i18n/i18n.service';
import { NotificationHostComponent } from './shared/feedback/notification-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly i18nService = inject(I18nService);
}
