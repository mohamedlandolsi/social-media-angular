import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css'],
})
export class UpdateUserModalComponent {
  @Input() user: any = {}; // Input for selected user details
  @Output() closeModal = new EventEmitter<void>(); // Event emitter to close modal
  @Output() refreshUsers = new EventEmitter<void>(); // Event emitter to refresh user list

  constructor(private userService: UserService) {}

  handleClose() {
    this.closeModal.emit();
  }

  updateUser() {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      alert('Authorization error: No token found.');
      return;
    }

    this.userService.updateUserByAdmin(this.user._id, this.user, token).subscribe(
      () => {
        alert('User updated successfully!');
        this.refreshUsers.emit(); // Refresh the user list
        this.handleClose(); // Close the modal
      },
      (error) => {
        console.error('Error updating user:', error);
        alert(error.error.message || 'Failed to update user.');
      }
    );
  }
}
