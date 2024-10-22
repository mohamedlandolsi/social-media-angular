import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

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

  login(user: { username: string; password: string }) {
    // Example API call (replace with your actual API)
    this.httpClient
      .post<{ token: string; username: string }>('api/login', user)
      .subscribe(
        (response) => {
          this.setToken(response.token);
          this.usernameSubject.next(response.username); // Set the actual username
        },
        (error) => {
          console.error('Login failed', error);
          // Handle login error appropriately
        }
      );
  }
}
