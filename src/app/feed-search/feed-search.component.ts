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
  filterOption: string = ''; // Tracks the selected filter option

  constructor(httpClient: HttpClient, authService: AuthService) {
    super(httpClient, authService);
  }

  onFilterSelected(filter: string): void {
    this.filterOption = filter;
    this.onSearch(); // Trigger the search whenever the filter changes
  }

  onSearch(): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (this.searchQuery.trim() === '') {
      // If search query is empty, show all posts
      this.loadAllPosts();
    } else {
      // Otherwise, perform the search with filters
      this.performSearch(headers);
    }
  }

  loadAllPosts(): void {
    this.loading = true;

    // Construct query params for fetching all posts
    let queryParams = '';
    if (this.filterOption) {
      queryParams += `filter=${this.filterOption}`;
    }

    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/search?${queryParams}`, {
        headers: { Authorization: `Bearer ${this.authService.getToken()}` },
      })
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

  performSearch(headers: any): void {
    this.loading = true;

    // Construct query params for the search
    let queryParams = `query=${this.searchQuery}`;
    if (this.filterOption) {
      queryParams += `&filter=${this.filterOption}`;
    }

    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/search?${queryParams}`, { headers })
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

  onSortChange(sortOption: string): void {
    console.log(`Selected sort option: ${sortOption}`);
  
    this.loading = true;
  
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
  
    let queryParams = `query=${this.searchQuery}`;
    if (this.filterOption) {
      queryParams += `&filter=${this.filterOption}`;
    }
    queryParams += `&sort=${sortOption}`; // Append sort parameter
  
    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/search?${queryParams}`, { headers })
      .subscribe(
        (response) => {
          this.posts = response;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching sorted posts:', error);
          this.loading = false;
        }
      );
  }
}
