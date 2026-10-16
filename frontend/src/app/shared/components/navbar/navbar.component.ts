import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-dark bg-primary">
      <div class="container d-flex flex-wrap align-items-center gap-2">
        <a class="navbar-brand fw-bold me-3" routerLink="/tickets">Support Tickets</a>
        @if (auth.currentUserSignal(); as user) {
          <a class="nav-link text-white" routerLink="/tickets" routerLinkActive="active">Tickets</a>
          <a class="nav-link text-white" routerLink="/tickets/new" routerLinkActive="active">New Ticket</a>
          <div class="ms-auto d-flex align-items-center gap-2 text-white">
            <span>{{ user.name }}</span>
            <span class="badge bg-light text-dark text-capitalize">{{ user.role }}</span>
            <button class="btn btn-sm btn-outline-light" (click)="auth.logout()">Logout</button>
          </div>
        } @else {
          <div class="ms-auto d-flex gap-2">
            <a class="btn btn-sm btn-outline-light" routerLink="/login">Login</a>
            <a class="btn btn-sm btn-light" routerLink="/register">Register</a>
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
}
