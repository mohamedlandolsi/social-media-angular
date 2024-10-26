import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-user-settings-dropdown',
  templateUrl: './user-settings-dropdown.component.html',
  styleUrl: './user-settings-dropdown.component.css',
  animations: [
    trigger('dropdownAnimation', [
      transition('void => open', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition('open => void', [
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'scale(0.9)' })
        ),
      ]),
    ]),
  ],
})
export class UserSettingsDropdownComponent {
  @Input() username: string | null = null;
  @Input() userEmail: string | null = null;
  @Output() logout = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();
  isOpen = false;

  // Toggles the dropdown menu
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  // Closes the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const clickedInside = targetElement.closest('.dropdown-container');
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  // Method to emit logout event
  onLogout() {
    this.logout.emit(); // Emit logout event
    this.isOpen = false; // Close dropdown after logout
  }

  // Method to emit toggle dark mode event
  onToggleDarkMode() {
    this.toggleDarkMode.emit(); // Emit toggle dark mode event
  }
}
