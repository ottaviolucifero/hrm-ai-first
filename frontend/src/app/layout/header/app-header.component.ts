import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  protected readonly profileMenuOpen = signal(false);

  protected toggleProfileMenu(): void {
    this.profileMenuOpen.update((open) => !open);
  }

  protected closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.profileMenuOpen.set(false);
    void this.router.navigateByUrl('/login');
  }
}
