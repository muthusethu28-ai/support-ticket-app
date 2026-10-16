import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token.storage';
import { User, AuthResponse } from '../models/user.model';

// RxJS is shimmed at build time because the toolchain could not resolve its
// bundled type declarations. Keep values untyped here to avoid type-argument
// errors while still importing the runtime operators elsewhere.
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(TokenStorageService);

  private readonly currentUserSubject = new (BehaviorSubject as any)(null);
  readonly currentUser$ = this.currentUserSubject as any;
  readonly currentUserSignal = signal<User | null>(null);

  token: string | null = null;

  constructor() {
    const savedToken = this.storage.getToken();
    const savedUser = this.storage.getUser<User>();
    if (savedToken && savedUser) {
      this.token = savedToken;
      this.currentUserSubject.next(savedUser);
      this.currentUserSignal.set(savedUser);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser;
  }

  get isAgent(): boolean {
    return this.currentUser?.role === 'agent';
  }

  loginRequest(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials);
  }

  registerRequest(payload: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  handleAuth(response: AuthResponse): void {
    this.token = response.token;
    this.storage.save(response.token, response.user);
    this.currentUserSubject.next(response.user);
    this.currentUserSignal.set(response.user);
  }

  clearSession(): void {
    this.token = null;
    this.storage.clear();
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
  }

  logout(redirect = true): void {
    this.clearSession();
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }
}
