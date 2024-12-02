import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  userId: string | null | undefined;

  constructor(private http: HttpClient, protected authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.fetchPosts();
  }

  fetchPosts() {
    const token = this.authService.getToken();

    this.http.get<any[]>(`http://localhost:3000/api/post/all`).subscribe(
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
            };
          })
        );
        this.loading = false; // Stop loading
        console.log(this.posts);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.loading = false; // Stop loading even on error
      }
    );
  }

  fetchUser(userId: string): Promise<{ username: string; userId: string }> {
    return this.http
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

  deletePost(post: any) {
    if (!this.userId) {
      console.error('User ID not found.');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found.');
      return;
    }
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = { userId: this.userId }; // Include the userId

    this.http
      .delete(`http://localhost:3000/api/post/${post._id}`, { headers, body })
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

  confirmDelete(post: any) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deletePost(post);
    }
  }
}
