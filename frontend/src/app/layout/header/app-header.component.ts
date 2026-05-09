import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { I18nKey } from '../../core/i18n/i18n.messages';

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
  protected readonly defaultHomeTitle: I18nKey = 'nav.home';

  protected currentPageTitle(): string {
    return this.i18n.t(this.resolveCurrentPageTitleKey(this.router.url));
  }

  private resolveCurrentPageTitleKey(url: string): I18nKey {
    const normalizedPath = this.normalizePath(url);

    if (normalizedPath.startsWith('/master-data')) {
      return 'nav.masterData';
    }

    if (!normalizedPath || normalizedPath === '/' || normalizedPath === '/home') {
      return this.defaultHomeTitle;
    }

    return this.defaultHomeTitle;
  }

  private normalizePath(url: string): string {
    return (url.split(/[?#]/)[0] || '/').split(';')[0];
  }

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
