// post.component.ts
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
    if (this.authService.isLoggedIn()) {
      this.fetchPosts();
    } else {
      console.error('User not logged in.');
    }
  }

  fetchPosts() {
    const userId = this.authService.getUserId(); // Get user ID from AuthService
    if (userId) {
      const token = this.authService.getToken(); // Get the Bearer token
      const headers = { Authorization: `Bearer ${token}` };

      this.httpClient
        .post<any[]>(
          `http://localhost:3000/api/post/timeline/all`,
          { userId },
          { headers }
        )
        .subscribe(
          (response) => {
            this.posts = response; // Store the posts
            console.log(this.posts); // For debugging
          },
          (error) => {
            console.error('Error fetching posts:', error);
          }
        );
    } else {
      console.error('User ID not found. User may not be logged in.');
    }
  }
}
