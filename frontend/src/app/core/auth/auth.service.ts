import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

import { AuthenticatedUser, LoginResponse } from './auth.models';

const ACCESS_TOKEN_KEY = 'hrm.accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  me(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>('/api/auth/me').pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }

  loadAuthenticatedUser(): Observable<AuthenticatedUser> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      return of(currentUser);
    }
    return this.me();
  }

  logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  hasToken(): boolean {
    return this.getAccessToken() !== null;
  }

  private setAccessToken(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}
