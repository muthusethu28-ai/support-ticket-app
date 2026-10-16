import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        m => m.RegisterComponent
      ),
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/tickets/ticket-list/ticket-list.component').then(
            m => m.TicketListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/tickets/ticket-create/ticket-create.component').then(
            m => m.TicketCreateComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/tickets/ticket-detail/ticket-detail.component').then(
            m => m.TicketDetailComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
