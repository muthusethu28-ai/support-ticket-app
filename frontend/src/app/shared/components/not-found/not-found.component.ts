import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-4">404</h1>
      <p class="text-muted">Page not found.</p>
      <a class="btn btn-primary" routerLink="/tickets">Go to tickets</a>
    </div>
  `,
})
export class NotFoundComponent {}
