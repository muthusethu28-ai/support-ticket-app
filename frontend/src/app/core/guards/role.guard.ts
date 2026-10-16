import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Reads required roles from route.data.roles and blocks non-matching users.
 * Kept generic even though only agent-only actions exist today.
 */
export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as string[] | undefined) ?? [];

  if (auth.currentUser && roles.includes(auth.currentUser.role)) {
    return true;
  }

  router.navigate(['/tickets']);
  return false;
};
