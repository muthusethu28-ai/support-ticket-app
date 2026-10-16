import { User } from './user.model';

export interface CommentAuthor {
  _id: string;
  name: string;
  role: 'user' | 'agent';
}

export interface Comment {
  _id: string;
  ticket: string;
  author: CommentAuthor | string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCommentRequest {
  message: string;
}
