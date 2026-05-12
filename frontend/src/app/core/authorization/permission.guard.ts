import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { I18nService } from '../i18n/i18n.service';
import { NotificationService } from '../../shared/feedback/notification.service';
import { AuthService } from '../auth/auth.service';
import { isPermissionAction, isPermissionModuleId, PermissionAction, PermissionModuleId } from './permission-summary.models';
import { PermissionSummaryService } from './permission-summary.service';

function routeModule(route: ActivatedRouteSnapshot): PermissionModuleId | null {
  const candidate = route.data['permissionModule'];
  return isPermissionModuleId(candidate) ? candidate : null;
}

function routeAction(route: ActivatedRouteSnapshot): PermissionAction {
  const candidate = route.data['requiredAction'];
  return isPermissionAction(candidate) ? candidate : 'view';
}

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const i18n = inject(I18nService);
  const notificationService = inject(NotificationService);
  const permissionSummaryService = inject(PermissionSummaryService);
  const router = inject(Router);

  const moduleId = routeModule(route);
  if (!moduleId) {
    return true;
  }

  const action = routeAction(route);
  return authService.loadAuthenticatedUser().pipe(
    map((user) => {
      if (permissionSummaryService.canAccess(user, moduleId, action)) {
        return true;
      }

      notificationService.warning(i18n.t('authorization.feedback.routeDenied'), {
        titleKey: 'alert.title.warning'
      });
      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      notificationService.warning(i18n.t('authorization.feedback.routeDenied'), {
        titleKey: 'alert.title.warning'
      });
      return of(router.createUrlTree(['/']));
    })
  );
};
