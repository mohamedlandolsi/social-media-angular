import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  followUser(
    targetUserId: string,
    currentUserId: string,
    token: string
  ): Observable<any> {
    const url = `${this.baseUrl}/users/${targetUserId}/follow`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const body = { userId: currentUserId }; // Confirming JSON structure with the API expectation
    return this.http.put(url, body, { headers });
  }

  unfollowUser(
    targetUserId: string,
    currentUserId: string,
    token: string
  ): Observable<any> {
    const url = `${this.baseUrl}/users/${targetUserId}/unfollow`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const body = { userId: currentUserId }; // Confirming JSON structure with the API expectation
    return this.http.put(url, body, { headers });
  }

  // New method to get user details, including followed users
  getUserDetails(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`; // Adjust this based on your API endpoint for getting user details
    return this.http.get<User>(url);
  }
}
