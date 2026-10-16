import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketsService } from '../tickets.service';
import { CreateTicketRequest } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './ticket-create.component.html',
})
export class TicketCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(TicketsService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  submitting = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    priority: ['medium' as CreateTicketRequest['priority'], Validators.required],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    const payload = this.form.getRawValue() as CreateTicketRequest;

    this.ticketsService.createTicket(payload).subscribe({
      next: (response: any) => {
        this.snackBar.open('Ticket created successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/tickets', response.data._id]);
      },
      error: () => {
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      },
    });
  }
}
