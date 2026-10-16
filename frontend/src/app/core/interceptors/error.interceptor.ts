import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

/**
 * Central place for backend error handling. 401 clears the session and sends
 * the user back to login; other errors surface the backend "message" field.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        auth.clearSession();
        router.navigate(['/login']);
        snackBar.open('Your session expired. Please log in again.', 'Close', {
          duration: 4000,
        });
      } else {
        const message =
          error.error?.message || error.message || 'Something went wrong';
        snackBar.open(message, 'Close', { duration: 4000 });
      }
      return throwError(() => error);
    })
  );
};
