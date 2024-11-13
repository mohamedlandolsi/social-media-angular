import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private token: string | null = null;
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();
  private userId: string | null = null;
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();
  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    if (this.isBrowser()) {
      this.loadLocalStorageData();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private loadLocalStorageData(): void {
    const savedToken = localStorage.getItem('authToken');
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken) {
      this.token = savedToken;
    }
    if (savedUsername) {
      this.usernameSubject.next(savedUsername);
    }
    if (savedEmail) {
      this.emailSubject.next(savedEmail);
    }
    if (savedUserId) {
      this.userId = savedUserId;
      this.userIdSubject.next(savedUserId);
    }
  }

  registerUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/register`, userData);
  }

  loginUser(userData: any): Observable<any> {
    return this.httpClient.post<{ user: User; token: string }>(
      `${this.baseUrl}/auth/login`,
      userData
    );
  }

  setToken(token: string): void {
    this.token = token;
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    return (
      this.token ||
      (this.isBrowser() ? localStorage.getItem('authToken') : null)
    );
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.token = null;
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
    }
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
    if (this.isBrowser()) {
      localStorage.setItem('username', username);
    }
  }

  setEmail(email: string): void {
    this.emailSubject.next(email);
    if (this.isBrowser()) {
      localStorage.setItem('email', email);
    }
  }

  getUserId(): string | null {
    return (
      this.userId || (this.isBrowser() ? localStorage.getItem('userId') : null)
    );
  }

  getEmail(): string | null {
    return (
      this.emailSubject.value ||
      (this.isBrowser() ? localStorage.getItem('email') : null)
    );
  }

  getCurrentUserId(): string | null {
    return this.getUserId();
  }

  setLoginDetails(user: User, token: string): void {
    this.setToken(token);
    this.userId = user._id;
    this.userIdSubject.next(this.userId);
    this.setUsername(user.username);
    this.setEmail(user.email);
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      localStorage.setItem('userId', user._id);
    }
    console.log('User ID set to:', this.userId);
  }
}
