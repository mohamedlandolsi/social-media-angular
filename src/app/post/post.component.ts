import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  posts: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.fetchPosts(userId); // Fetch posts only if userId is available
      } else {
        console.error('User ID not found.');
      }
    });
  }

  fetchPosts(userId: string) {
    const token = this.authService.getToken(); // Get the Bearer token
    const headers = { Authorization: `Bearer ${token}` };

    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/timeline/all`, { headers })
      .subscribe(
        (response) => {
          this.posts = response;
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
  }
}
