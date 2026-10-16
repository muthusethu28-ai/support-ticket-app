import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Ticket,
  CreateTicketRequest,
  TicketsResponse,
  TicketQuery,
  UpdateStatusRequest,
} from '../../core/models/ticket.model';
import { Comment, AddCommentRequest } from '../../core/models/comment.model';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tickets`;

  getTickets(query: TicketQuery = {}) {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.status) params = params.set('status', query.status);
    if (query.priority) params = params.set('priority', query.priority);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<TicketsResponse>(this.base, { params });
  }

  getTicket(id: string) {
    return this.http.get<{ success: boolean; data: { ticket: Ticket; comments: Comment[] } }>(
      `${this.base}/${id}`
    );
  }

  createTicket(payload: CreateTicketRequest) {
    return this.http.post<{ success: boolean; data: Ticket }>(this.base, payload);
  }

  updateStatus(id: string, payload: UpdateStatusRequest) {
    return this.http.patch<{ success: boolean; data: Ticket }>(
      `${this.base}/${id}/status`,
      payload
    );
  }

  addComment(id: string, payload: AddCommentRequest) {
    return this.http.post<{ success: boolean; data: Comment }>(
      `${this.base}/${id}/comments`,
      payload
    );
  }
}
