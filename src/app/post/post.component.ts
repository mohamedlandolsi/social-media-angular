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
        this.fetchPosts(userId);
      } else {
        console.error('User ID not found.');
      }
    });
  }

  fetchPosts(userId: string) {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/timeline/all`, { headers })
      .subscribe(
        async (posts) => {
          this.posts = await Promise.all(
            posts.map(async (post) => {
              const username = await this.fetchUsername(post.userId);
              return { ...post, username }; // Attach username to each post object
            })
          );
          console.log('Posts with usernames:', this.posts); // Debugging log
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
  }

  fetchUsername(userId: string): Promise<string> {
    return this.httpClient
      .get<{ username?: string }>(`http://localhost:3000/api/users/${userId}`)
      .toPromise()
      .then((response) => {
        console.log('Fetched username for userId:', userId, response?.username); // Debugging log
        return response?.username || 'Unknown User';
      })
      .catch((error) => {
        console.error('Error fetching username:', error);
        return 'Unknown User';
      });
  }
}
