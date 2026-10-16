import { Component, OnInit, ViewChild, inject, DestroyRef, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TicketsService } from '../tickets.service';
import { Ticket, TicketQuery, TicketStatus, TicketPriority } from '../../../core/models/ticket.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    LoaderComponent,
    ErrorMessageComponent,
    StatusChipComponent,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})
export class TicketListComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly ticketsService = inject(TicketsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading = signal(true);
  error = signal('');
  tickets = signal<Ticket[]>([]);
  pagination = signal({ page: 1, limit: 10, total: 0, totalPages: 0 });

  statusControl = new FormControl<TicketStatus | ''>('');
  priorityControl = new FormControl<TicketPriority | ''>('');
  searchControl = new FormControl('');

  get isAgent(): boolean {
    return this.auth.isAgent;
  }

  get displayedColumns(): string[] {
    const columns = ['title', 'status', 'priority'];
    if (this.isAgent) columns.push('createdBy');
    columns.push('createdAt');
    return columns;
  }

  readonly isEmpty = computed(() => !this.loading() && !this.error() && this.tickets().length === 0);

  ngOnInit(): void {
    this.statusControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadTickets(1));
    this.priorityControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadTickets(1));

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(() => {
          this.loadTickets(1);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.loadTickets(1);
  }

  loadTickets(page = this.pagination().page): void {
    this.loading.set(true);
    this.error.set('');

    const query: TicketQuery = {
      page,
      limit: this.pagination().limit,
      status: this.statusControl.value || undefined,
      priority: this.priorityControl.value || undefined,
      search: this.searchControl.value || undefined,
    };

    this.ticketsService.getTickets(query).subscribe({
      next: (response: any) => {
        this.tickets.set(response.data);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load tickets.');
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.update(current => ({ ...current, limit: event.pageSize }));
    this.loadTickets(event.pageIndex + 1);
  }

  openTicket(ticket: Ticket): void {
    this.router.navigate(['/tickets', ticket._id]);
  }

  creatorName(ticket: Ticket): string {
    return typeof ticket.createdBy === 'string' ? ticket.createdBy : ticket.createdBy.name;
  }
}
