import { Component, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  protected readonly i18n = inject(I18nService);
}
