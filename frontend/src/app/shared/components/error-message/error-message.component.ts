import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `<div class="alert alert-danger mt-3" role="alert">{{ message }}</div>`,
})
export class ErrorMessageComponent {
  @Input() message = 'Something went wrong. Please try again.';
}
