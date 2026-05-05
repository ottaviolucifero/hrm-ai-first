import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from '../header/app-header.component';
import { AppSidebarComponent } from '../sidebar/app-sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [AppSidebarComponent, AppHeaderComponent, RouterOutlet],
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent {
  protected readonly sidebarCollapsed = signal(false);

  protected updateSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }
}
