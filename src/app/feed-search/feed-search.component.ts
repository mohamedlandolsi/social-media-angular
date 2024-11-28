import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostComponent } from '../post/post.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-feed-search',
  templateUrl: './feed-search.component.html',
  styleUrls: ['./feed-search.component.css'],
})
export class FeedSearchComponent extends PostComponent {
  searchQuery: string = ''; // Bind to input field

  constructor(httpClient: HttpClient, authService: AuthService) {
    super(httpClient, authService); // Pass dependencies to the parent constructor
  }

  onSearch(): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (this.searchQuery.trim() === '') {
      this.posts = [];
      return;
    }

    this.loading = true;

    this.httpClient
      .get<any[]>(
        `http://localhost:3000/api/post/search?query=${this.searchQuery}`,
        { headers }
      )
      .subscribe(
        async (response) => {
          this.posts = await Promise.all(
            response.map(async (post) => {
              const user = await this.fetchUser(post.userId);
              const liked = post.likes.includes(this.userId);
              return {
                ...post,
                ...user,
                image: post.image,
                liked,
                dropdownOpen: false,
                isEditing: false,
              };
            })
          );
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching posts:', error);
          this.loading = false;
        }
      );
  }
}
