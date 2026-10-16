import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TicketsService } from '../tickets.service';
import { Ticket, TicketStatus } from '../../../core/models/ticket.model';
import { Comment } from '../../../core/models/comment.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  open: 'in-progress',
  'in-progress': 'resolved',
  resolved: 'closed',
  closed: null,
};

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    LoaderComponent,
    ErrorMessageComponent,
    StatusChipComponent,
  ],
  templateUrl: './ticket-detail.component.html',
})
export class TicketDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(TicketsService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  ticketId = '';

  loading = signal(true);
  error = signal('');
  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  updatingStatus = signal(false);
  postingComment = signal(false);

  commentForm = this.fb.group({
    message: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  get isAgent(): boolean {
    return this.auth.isAgent;
  }

  get isClosed(): boolean {
    return this.ticket()?.status === 'closed';
  }

  get nextStatus(): TicketStatus | null {
    const current = this.ticket();
    if (!current || !this.isAgent) return null;
    return NEXT_STATUS[current.status as TicketStatus];
  }

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.ticketId) {
      this.router.navigate(['/tickets']);
      return;
    }
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.ticketsService.getTicket(this.ticketId).subscribe({
      next: (response: any) => {
        this.ticket.set(response.data.ticket);
        this.comments.set(response.data.comments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load ticket.');
        this.loading.set(false);
      },
    });
  }

  changeStatus(status: TicketStatus): void {
    if (!status || this.updatingStatus()) return;
    this.updatingStatus.set(true);

    this.ticketsService.updateStatus(this.ticketId, { status }).subscribe({
      next: () => {
        this.snackBar.open('Status updated.', 'Close', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.updatingStatus.set(false);
      },
      complete: () => {
        this.updatingStatus.set(false);
      },
    });
  }

  addComment(): void {
    if (this.commentForm.invalid || this.postingComment() || this.isClosed) return;
    this.postingComment.set(true);

    const message = this.commentForm.value.message as string;
    this.ticketsService.addComment(this.ticketId, { message }).subscribe({
      next: () => {
        this.commentForm.reset();
        this.snackBar.open('Comment added.', 'Close', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.postingComment.set(false);
      },
      complete: () => {
        this.postingComment.set(false);
      },
    });
  }

  authorName(comment: Comment): string {
    return typeof comment.author === 'string' ? comment.author : comment.author.name;
  }

  authorRole(comment: Comment): string {
    return typeof comment.author === 'string' ? '' : comment.author.role;
  }

  creatorName(): string {
    const creator = this.ticket()?.createdBy;
    return typeof creator === 'string' ? creator : (creator?.name ?? '');
  }
}
