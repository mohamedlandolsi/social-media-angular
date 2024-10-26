import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private token: string | null = null;
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Check for stored token and username on initialization
    if (this.isBrowser()) {
      const savedToken = localStorage.getItem('authToken');
      const savedUsername = localStorage.getItem('username');

      if (savedToken) {
        this.token = savedToken;
      }
      if (savedUsername) {
        this.usernameSubject.next(savedUsername);
      }
    }
  }

  // Method to check if localStorage is available
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // User Registration
  registerUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/register`, userData);
  }

  // User Login
  loginUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/login`, userData);
  }

  // Set token and save to localStorage
  setToken(token: string) {
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

  logout() {
    this.token = null;
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(null);
  }

  // Set username and save to localStorage
  setUsername(username: string) {
    this.usernameSubject.next(username);
    if (this.isBrowser()) {
      localStorage.setItem('username', username);
    }
  }

  login(user: { username: string; password: string }) {
    this.httpClient
      .post<{ user: { username: string; email: string }; token: string }>(
        `${this.baseUrl}/auth/login`,
        user
      )
      .subscribe(
        (response) => {
          const { user, token } = response;

          // Set token and username
          this.setToken(token);
          this.setUsername(user.username);

          // Log the user details
          console.log('User Information:');
          console.log(`Username: ${user.username}`);
          console.log(`Email: ${user.email}`);
          console.log(`Token: ${token}`);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
  }
}
