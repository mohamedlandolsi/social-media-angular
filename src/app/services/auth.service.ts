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

  constructor(private httpClient: HttpClient) {}

  // User Registration
  registerUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/register`, userData);
  }

  // User Login
  loginUser(userData: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/login`, userData);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    this.usernameSubject.next(null);
  }

  setUsername(username: string) {
    this.usernameSubject.next(username);
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
          this.usernameSubject.next(user.username);

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
