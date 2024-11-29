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

  updateUser(userId: string, updatedData: any, token: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(url, updatedData, { headers });
  }

  updateProfilePicture(
    userId: string,
    file: File,
    token: string
  ): Observable<any> {
    const url = `${this.apiUrl}/${userId}/profilePicture`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.put(url, formData, { headers });
  }

  updateCoverPicture(
    userId: string,
    file: File,
    token: string
  ): Observable<any> {
    const url = `${this.apiUrl}/${userId}/coverPicture`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('coverPicture', file);

    return this.http.put(url, formData, { headers });
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

  // Method to get user's posts
  getUserPosts(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/post/user/${userId}`, { headers });
  }

  // Fetch all users (admin only)
  getAllUsers(token: string): Observable<User[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<User[]>(`${this.apiUrl}/admin/all`, { headers });
  }

  // Delete user by admin
  deleteUserByAdmin(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Ensure proper method and body structure
    return this.http.delete(`${this.apiUrl}/admin`, {
      headers: headers,
      body: { userId }, // Correctly structure the request body
    });
  }

  // Update user as admin
  updateUserByAdmin(
    userId: string,
    updatedData: any,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.apiUrl}/admin/${userId}`, updatedData, {
      headers,
    });
  }
}
