import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrl: './update-user-modal.component.css',
})
export class UpdateUserModalComponent {
  @Output() closeModal = new EventEmitter<void>(); // Emits an event to close the modal

  handleClose() {
    this.closeModal.emit(); // Emit event to parent
  }
}
