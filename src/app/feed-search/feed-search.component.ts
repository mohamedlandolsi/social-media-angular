import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostComponent } from '../post/post.component'; // Import PostComponent to extend it
import { AuthService } from '../services/auth.service'; // Import AuthService for dependency injection

@Component({
  selector: 'app-feed-search',
  templateUrl: './feed-search.component.html',
  styleUrls: ['./feed-search.component.css']
})
export class FeedSearchComponent extends PostComponent {
  searchQuery: string = ''; // Bind to input field

  // Pass the necessary dependencies in the constructor
  constructor(httpClient: HttpClient, authService: AuthService) {
    super(httpClient, authService); // Pass dependencies to the parent constructor
  }

  onSearch(): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (this.searchQuery.trim() === '') {
      this.posts = []; // Clear results if query is empty
      return;
    }

    this.loading = true; // Start loading

    // Perform the search API call
    this.httpClient.get<any[]>(`http://localhost:3000/api/post/search?query=${this.searchQuery}`,  { headers })
      .subscribe(
        async (response) => {
          this.posts = await Promise.all(
            response.map(async (post) => {
              const user = await this.fetchUser(post.userId);
              const liked = post.likes.includes(this.userId);
              return { ...post, ...user, liked };
            })
          );; // Update posts with API response
          this.loading = false; // Stop loading
        },
        (error) => {
          console.error('Error fetching posts:', error);
          this.loading = false; // Stop loading even on error
        }
      );
  }
}
