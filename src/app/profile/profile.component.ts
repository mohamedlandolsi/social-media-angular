import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId!: string; // ID of the user being viewed
  currentUserId: string | null; // ID of the currently logged-in user
  userData: any;
  userPosts: any[] = []; // Array to hold user's posts

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    protected httpClient: HttpClient
  ) {
    this.currentUserId = this.authService.getCurrentUserId(); // Get the current user ID
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.loadUserData();
    this.loadUserPosts();
  }

  loadUserData() {
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.userData = data;
      // Check if the current user is following the user being viewed
      this.userData.isFollowing = this.userData.followers.includes(
        this.currentUserId
      );
      console.log('User Data:', this.userData);
    });
  }

  followUser() {
    if (this.currentUserId) {
      const token = this.authService.getToken();
      if (token) {
        this.userService
          .followUser(this.userId, this.currentUserId, token)
          .subscribe(
            (response) => {
              console.log('Followed user:', response);
              this.userData.isFollowing = true; // Update local state
            },
            (error) => {
              console.error('Error following user:', error);
            }
          );
      } else {
        console.error('Token is null or undefined');
      }
    } else {
      console.error('Current user ID is null or undefined');
    }
  }

  unfollowUser() {
    if (this.currentUserId) {
      const token = this.authService.getToken();
      if (token) {
        this.userService
          .unfollowUser(this.userId, this.currentUserId, token)
          .subscribe(
            (response) => {
              console.log('Unfollowed user:', response);
              this.userData.isFollowing = false; // Update local state
            },
            (error) => {
              console.error('Error unfollowing user:', error);
            }
          );
      } else {
        console.error('Token is null or undefined');
      }
    } else {
      console.error('Current user ID is null or undefined');
    }
  }

  loadUserPosts() {
    const token = this.authService.getToken();
    if (token) {
      this.userService.getUserPosts(this.userId, token).subscribe(
        (posts) => {
          this.userPosts = posts;
        },
        (error) => {
          console.error('Error loading user posts:', error);
        }
      );
    }
  }

  updateProfilePicture(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.currentUserId === this.userId) {
      const file = input.files[0];
      const token = this.authService.getToken();

      if (token) {
        this.userService
          .updateProfilePicture(this.userId, file, token)
          .subscribe(
            (response) => {
              console.log('Profile picture updated:', response);
              this.loadUserData(); // Refresh user data
            },
            (error) => {
              console.error('Error updating profile picture:', error);
            }
          );
      }
    }
  }

  updateCoverPicture(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.currentUserId === this.userId) {
      const file = input.files[0];
      const token = this.authService.getToken();

      if (token) {
        this.userService.updateCoverPicture(this.userId, file, token).subscribe(
          (response) => {
            console.log('Cover picture updated:', response);
            this.loadUserData(); // Refresh user data
          },
          (error) => {
            console.error('Error updating cover picture:', error);
          }
        );
      }
    }
  }

  likePost(post: any) {    
    if (!this.userId) {
      console.error('User ID not found.');
      return;
    }
  
    // Ensure that the post object has _id
    if (!post || !post._id) {
      console.error('Invalid post object or missing post ID:', post._id);
      return;
    }
  
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const likeData = { userId: this.userId };
  
    console.log('Liking post with ID:', post._id, 'by user:', this.userId);
  
    this.httpClient
      .put(`http://localhost:3000/api/post/${post._id}/like`, likeData, { headers })
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
}
