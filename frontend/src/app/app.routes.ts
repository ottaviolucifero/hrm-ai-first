import { Routes } from '@angular/router';

import { authGuard, loginRedirectGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { AppShellComponent } from './layout/shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginRedirectGuard]
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
