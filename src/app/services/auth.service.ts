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

  constructor(private httpClient: HttpClient) {
    if (this.isBrowser()) {
      const savedToken = localStorage.getItem('authToken');
      const savedUsername = localStorage.getItem('username');
      const savedUserId = localStorage.getItem('userId'); // Retrieve saved user ID

      if (savedToken) {
        this.token = savedToken;
      }
      if (savedUsername) {
        this.usernameSubject.next(savedUsername);
      }
      if (savedUserId) {
        this.userId = savedUserId; // Initialize user ID from localStorage
        this.userIdSubject.next(savedUserId); // Emit the initial value
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
    return this.httpClient.post<{ user: User; token: string }>(
      `${this.baseUrl}/auth/login`,
      userData
    );
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

  getUserId(): string | null {
    return (
      this.userId || (this.isBrowser() ? localStorage.getItem('userId') : null)
    );
  }

  login(user: { username: string; password: string }) {
    return this.httpClient
      .post<{ user: User; token: string }>(`${this.baseUrl}/auth/login`, user)
      .subscribe(
        (response) => {
          const { user, token } = response;

          console.log('Login Response:', response);

          if (user && token) {
            this.setToken(token);
            this.setUsername(user.username);
            this.userId = user._id; // Store the user ID
            this.userIdSubject.next(this.userId); // Emit the user ID
          } else {
            console.error('Invalid login response:', response);
          }
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
  }

  // Set token and username, save userId
  setLoginDetails(user: User, token: string) {
    this.token = token;
    this.userId = user._id; // Save user ID
    this.usernameSubject.next(user.username);
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user._id);
    }
    console.log('User ID set to:', this.userId); // Debugging log
  }
}
