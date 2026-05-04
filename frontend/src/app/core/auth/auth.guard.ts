import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasToken()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  return authService.loadAuthenticatedUser().pipe(
    map(() => true),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']));
    })
  );
};

export const loginRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.hasToken() ? router.createUrlTree(['/']) : true;
};
