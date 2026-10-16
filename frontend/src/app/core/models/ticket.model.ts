import { User } from './user.model';

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface TicketCreator {
  _id: string;
  name: string;
  email?: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: TicketCreator | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: TicketPriority;
}

export interface TicketsResponse {
  data: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TicketQuery {
  page?: number;
  limit?: number;
  status?: TicketStatus | '';
  priority?: TicketPriority | '';
  search?: string;
}

export interface UpdateStatusRequest {
  status: TicketStatus;
}

export function creatorName(ticket: Ticket): string {
  return typeof ticket.createdBy === 'string' ? ticket.createdBy : ticket.createdBy.name;
}

export function isAgentCreator(ticket: Ticket, user: User | null): boolean {
  if (!user) return false;
  const creatorId = typeof ticket.createdBy === 'string' ? ticket.createdBy : ticket.createdBy._id;
  return creatorId !== user._id && creatorId !== user.id;
}
