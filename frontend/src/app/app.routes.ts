import { Routes } from '@angular/router';

import { authGuard, loginRedirectGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/authorization/permission.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { MasterDataAdminComponent } from './features/master-data/master-data-admin.component';
import { RoleAdministrationComponent } from './features/role-administration/role-administration.component';
import { RolePermissionMatrixComponent } from './features/role-permissions/role-permission-matrix.component';
import { TenantAdministrationComponent } from './features/tenant-administration/tenant-administration.component';
import { UserAdministrationComponent } from './features/user-administration/user-administration.component';
import { UserAdministrationDetailComponent } from './features/user-administration/user-administration-detail.component';
import { UserAdministrationFormComponent } from './features/user-administration/user-administration-form.component';
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
        component: MasterDataAdminComponent,
        canActivate: [permissionGuard],
        data: {
          permissionModule: 'master-data',
          requiredAction: 'view'
        }
      },
      {
        path: 'admin',
        children: [
          {
            path: 'tenants',
            component: TenantAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'tenants',
              requiredAction: 'view'
            }
          },
          {
            path: 'roles',
            component: RoleAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'roles',
              requiredAction: 'view'
            }
          },
          {
            path: 'users',
            component: UserAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'users',
              requiredAction: 'view'
            }
          },
          {
            path: 'users/new',
            component: UserAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'users',
              requiredAction: 'create'
            }
          },
          {
            path: 'users/:id/edit',
            component: UserAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'users',
              requiredAction: 'update'
            }
          },
          {
            path: 'users/:id',
            component: UserAdministrationDetailComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'users',
              requiredAction: 'view'
            }
          },
          {
            path: 'permissions',
            component: RolePermissionMatrixComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'permissions',
              requiredAction: 'view'
            }
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
