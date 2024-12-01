import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-suggested-users',
  templateUrl: './suggested-users.component.html',
  styleUrls: ['./suggested-users.component.css'],
})
export class SuggestedUsersComponent implements OnInit {
  suggestedUsers: User[] = [];
  loggedInUserId: string | null = null;
  authToken: string | null = null;
  followingIds: string[] = [];
  successMessage: string | null = null; // Message to show when the follow action is successful

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve the user ID and token from AuthService
    this.authService.userId$.subscribe((userId) => {
      this.loggedInUserId = userId;
      this.authToken = this.authService.getToken(); // Ensure the token is set

      // Check if userId is not null before calling loadFollowingIds
      if (userId) {
        this.loadFollowingIds(userId); // Load following IDs when the user ID is available
      }
    });
  }

  followUser(targetUserId: string): void {
    if (this.loggedInUserId && this.authToken) {
      this.userService
        .followUser(targetUserId, this.loggedInUserId, this.authToken)
        .subscribe({
          next: () => {
            // Remove the followed user from the suggestions list
            this.suggestedUsers = this.suggestedUsers.filter(
              (user) => user._id !== targetUserId
            );

            // Optionally add to followingIds for local state
            this.followingIds.push(targetUserId);

            // Show success message
            this.successMessage = `You are now following user ID: ${targetUserId}`;
            setTimeout(() => {
              this.successMessage = null; // Clear the message after 3 seconds
            }, 3000);

            console.log(`Followed user with ID: ${targetUserId}`);
          },
          error: (error) => {
            console.error('Failed to follow user:', error);
            console.error('Error details:', error.error); // Log error body for debugging
          },
        });
    } else {
      console.error('User is not authenticated');
    }
  }

  loadFollowingIds(userId: string): void {
    // Fetch the following IDs for the logged-in user.
    this.userService.getUserDetails(userId).subscribe((user) => {
      this.followingIds = user.followings || []; // Use 'followings' instead of 'followingIds'
      this.loadSuggestedUsers(); // Reload suggested users after fetching following IDs
    });
  }

  loadSuggestedUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.suggestedUsers = users.filter(
        (user: User) =>
          !this.followingIds.includes(user._id) && // Exclude followed users
          user._id !== this.loggedInUserId && // Exclude the logged-in user
          user.status === 'active' // Include only active users
      );
    });
  }
}
