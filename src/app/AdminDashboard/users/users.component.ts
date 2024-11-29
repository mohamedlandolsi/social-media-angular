import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(userId: string): void {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error('Authorization error: No token found');
        alert('Authorization error: No token found.');
        return;
      }

      // Call the service to delete the user
      this.userService.deleteUserByAdmin(userId, token).subscribe(
        () => {
          alert('User deleted successfully!');
          this.loadUsers(); // Reload user list
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert(error.error.message || 'Failed to delete user.');
        }
      );
    }
  }

  isOpen = false; // Modal visibility state

  toggleModal(): void {
    this.isOpen = !this.isOpen;
  }
}
