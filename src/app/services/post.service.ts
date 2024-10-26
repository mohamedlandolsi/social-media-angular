import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/post/timeline/all';

  constructor(private http: HttpClient) {}

  getTimelinePosts(userId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any[]>(this.apiUrl, { userId }, { headers });
  }
}
