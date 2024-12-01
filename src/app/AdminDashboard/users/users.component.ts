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
  isModalOpen = false;
  selectedUser: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        console.log('Users:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  openUpdateModal(user: any) {
    this.selectedUser = { ...user }; // Clone user object
    this.isModalOpen = true;
  }

  toggleModal() {
    this.isModalOpen = false;
  }

  toggleUserStatus(user: User): void {
    const updatedStatus = user.status === 'active' ? 'inactive' : 'active'; // Toggle the status string
  
    // Assuming updateUserStatus is defined in the userService and it calls the backend
    this.userService.updateUserStatus(user._id, updatedStatus).subscribe(
      (response) => {
        user.status = updatedStatus; // Update the local user's status
        console.log(
          `User status updated successfully. User: ${user.username}, New Status: ${updatedStatus}`
        );
      },
      (error) => {
        console.error('Error updating user status:', error);
        // Optionally, display a user-friendly message to the user
        alert('Failed to update user status. Please try again later.');
      }
    );
  }
  
}
