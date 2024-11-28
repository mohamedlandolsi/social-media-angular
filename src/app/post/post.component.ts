import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  posts: any[] = [];
  loading: boolean = true; // Loading flag
  userId: string | undefined;

  constructor(
    protected httpClient: HttpClient,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
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
          this.loading = false; // Stop loading
        },
        (error) => {
          console.error('Error fetching posts:', error);
          this.loading = false; // Stop loading even on error
        }
      );
  }

  fetchUser(userId: string): Promise<{ username: string; userId: string }> {
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

  toggleDropdown(post: any) {
    post.dropdownOpen = !post.dropdownOpen;
  }

  closeDropdown(post: any) {
    post.dropdownOpen = false;
  }

  likePost(post: any) {
    if (!this.userId) {
      console.error('User ID not found.');
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const likeData = { userId: this.userId };

    this.httpClient
      .put(`http://localhost:3000/api/post/${post._id}/like`, likeData, {
        headers,
      })
      .subscribe(
        (response) => {
          post.liked = !post.liked; // Toggle the liked state
          post.likes = post.liked
            ? [...post.likes, this.userId]
            : post.likes.filter((id: string) => id !== this.userId);
        },
        (error) => {
          console.error('Error liking post:', error);
        }
      );
  }

  editPost(post: any) {
    post.isEditing = true;
    post.newTitle = post.title;
    post.newDescription = post.description;
  }

  savePost(post: any): void {
    const formData = new FormData();
    formData.append('title', post.newTitle);
    formData.append('description', post.newDescription);
    if (post.newImage) {
      formData.append('image', post.newImage); // Add the selected file
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.httpClient
      .put(`http://localhost:3000/api/post/${post._id}`, formData, { headers })
      .subscribe(
        (response: any) => {
          post.title = post.newTitle;
          post.description = post.newDescription;
          if (response.image) {
            post.image = response.image; // Update the post's image URL
          }
          post.isEditing = false;
          alert('Post updated successfully!');
        },
        (error) => {
          console.error('Error updating post:', error);
          alert('Failed to update post. Please try again.');
        }
      );
  }

  cancelEditing(post: any) {
    post.isEditing = false;
  }

  deletePost(post: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.httpClient
      .delete(`http://localhost:3000/api/post/${post._id}`, { headers })
      .subscribe(
        (response) => {
          this.posts = this.posts.filter((p) => p._id !== post._id);
          alert('Post deleted successfully!');
        },
        (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
        }
      );
  }
}
