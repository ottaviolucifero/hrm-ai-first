import { Routes } from '@angular/router';

import { authGuard, loginRedirectGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/authorization/permission.guard';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { CompanyProfileAdministrationComponent } from './features/company-profile-administration/company-profile-administration.component';
import { CompanyProfileAdministrationDetailComponent } from './features/company-profile-administration/company-profile-administration-detail.component';
import { CompanyProfileAdministrationFormComponent } from './features/company-profile-administration/company-profile-administration-form.component';
import { DeviceAdministrationComponent } from './features/device-administration/device-administration.component';
import { DeviceAdministrationDetailComponent } from './features/device-administration/device-administration-detail.component';
import { DeviceAdministrationFormComponent } from './features/device-administration/device-administration-form.component';
import { HolidayCalendarAdministrationComponent } from './features/holiday-calendar-administration/holiday-calendar-administration.component';
import { HolidayCalendarAdministrationDetailComponent } from './features/holiday-calendar-administration/holiday-calendar-administration-detail.component';
import { HolidayCalendarAdministrationFormComponent } from './features/holiday-calendar-administration/holiday-calendar-administration-form.component';
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
            path: 'company-profiles',
            component: CompanyProfileAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'company-profiles',
              requiredAction: 'view'
            }
          },
          {
            path: 'company-profiles/new',
            component: CompanyProfileAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'company-profiles',
              requiredAction: 'create'
            }
          },
          {
            path: 'company-profiles/:id/edit',
            component: CompanyProfileAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'company-profiles',
              requiredAction: 'update'
            }
          },
          {
            path: 'company-profiles/:id',
            component: CompanyProfileAdministrationDetailComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'company-profiles',
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
            path: 'devices',
            component: DeviceAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'devices',
              requiredAction: 'view'
            }
          },
          {
            path: 'devices/new',
            component: DeviceAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'devices',
              requiredAction: 'create'
            }
          },
          {
            path: 'devices/:id/edit',
            component: DeviceAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'devices',
              requiredAction: 'update'
            }
          },
          {
            path: 'devices/:id',
            component: DeviceAdministrationDetailComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'devices',
              requiredAction: 'view'
            }
          },
          {
            path: 'holiday-calendars',
            component: HolidayCalendarAdministrationComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'holiday-calendars',
              requiredAction: 'view'
            }
          },
          {
            path: 'holiday-calendars/new',
            component: HolidayCalendarAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'holiday-calendars',
              requiredAction: 'create'
            }
          },
          {
            path: 'holiday-calendars/:id/edit',
            component: HolidayCalendarAdministrationFormComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'holiday-calendars',
              requiredAction: 'update'
            }
          },
          {
            path: 'holiday-calendars/:id',
            component: HolidayCalendarAdministrationDetailComponent,
            canActivate: [permissionGuard],
            data: {
              permissionModule: 'holiday-calendars',
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
