import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from '../header/app-header.component';
import { AppSidebarComponent } from '../sidebar/app-sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [AppSidebarComponent, AppHeaderComponent, RouterOutlet],
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent {}
