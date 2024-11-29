import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PostComponent } from '../post/post.component';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-feed-search',
  templateUrl: './feed-search.component.html',
  styleUrls: ['./feed-search.component.css'],
})
export class FeedSearchComponent extends PostComponent {
  searchQuery: string = '';
  filterOption: string = '';
  sortOption: string = ''; // Added sort option
  searchSubject = new Subject<string>();
  errorMessage: string = '';

  constructor(httpClient: HttpClient, authService: AuthService) {
    super(httpClient, authService);

    // Debounce search input
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.searchQuery = query.trim();
      this.onSearch();
    });
  }
  override fetchUser(userId: string): Promise<{ username: string; userId: string }> {
    return this.httpClient
      .get<{ _id: string; username?: string; profilePicture?: string }>(
        `http://localhost:3000/api/users/${userId}`
      )
      .toPromise()
      .then((response) => {
        if (response && response._id) {
          return {
            userId: response._id,
            username: response.username || 'Unknown User',
            profilePicture: response.profilePicture,
          };
        } else {
          console.warn('User not found or invalid response:', response);
          return {
            userId,
            username: 'Unknown User',
            profilePicture:
              'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png',
          };
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        return {
          userId,
          username: 'Unknown User',
          profilePicture:
            'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png',
        };
      });
  }
  
  
  
  // Override fetchPosts to customize functionality
  override fetchPosts(): void {
    this.loading = true;
    this.errorMessage = '';

    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    let params = new HttpParams()
      .set('query', this.searchQuery || '')
      .set('filter', this.filterOption || '');

    if (this.sortOption) {
      params = params.set('sort', this.sortOption); // Include sort parameter if provided
    }

    this.httpClient
      .get<any[]>(`http://localhost:3000/api/post/search`, { headers, params })
      .subscribe(
        async (posts) => {
          this.posts = await Promise.all(
            posts.map(async (post) => {
              console.log(post._id)
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
          this.errorMessage = 'An error occurred while fetching posts.';
          console.error('Error fetching posts:', error);
          this.loading = false;
        }
      );
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  onSearch(): void {
    if (!this.searchQuery.trim() && !this.filterOption && !this.sortOption) {
      // Use the parent's fetchPosts directly
      super.fetchPosts(this.userId || '');
    } else {
      // Customize your own fetchPosts method if needed
      this.fetchPosts(); // Use the child component's overridden fetchPosts
    }
  }
  

  onFilterSelected(filter: string): void {
    this.filterOption = filter;
    this.onSearch();
  }

  onSortChange(sortOption: string): void {
    this.sortOption = sortOption;
    this.onSearch();
  }
}
