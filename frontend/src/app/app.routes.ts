import { Routes } from '@angular/router';

import { authGuard, loginRedirectGuard } from './core/auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { MasterDataAdminComponent } from './features/master-data/master-data-admin.component';
import { RoleAdministrationComponent } from './features/role-administration/role-administration.component';
import { RolePermissionMatrixComponent } from './features/role-permissions/role-permission-matrix.component';
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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'master-data',
        component: MasterDataAdminComponent
      },
      {
        path: 'admin',
        children: [
          {
            path: 'roles',
            component: RoleAdministrationComponent
          },
          {
            path: 'permissions',
            component: RolePermissionMatrixComponent
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
