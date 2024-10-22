import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Replace with your Express API base URL

  constructor(private http: HttpClient) {}

  // User Registration
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // User Login
  loginUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, userData);
  }

  // Other methods can be added here (e.g., logout, fetch user profile)
}
