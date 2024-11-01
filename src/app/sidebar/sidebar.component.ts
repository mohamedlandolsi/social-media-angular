import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isOpen = false; // State to track if the mobile menu is open or closed
  username: string | null = null;
  isLoggedIn: boolean = false;
  userId: string | null = null;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  constructor(private renderer: Renderer2, private authService: AuthService) {
    // Check if localStorage is available (only run this in the browser)
    if (this.isBrowser() && localStorage.getItem('darkMode') === 'enabled') {
      this.renderer.addClass(document.body, 'dark');
    }
  }

  toggleDarkMode() {
    if (this.isBrowser()) {
      const body = document.body;
      if (body.classList.contains('dark')) {
        this.renderer.removeClass(body, 'dark');
        localStorage.setItem('darkMode', 'disabled'); // Save preference
      } else {
        this.renderer.addClass(body, 'dark');
        localStorage.setItem('darkMode', 'enabled'); // Save preference
      }
    }
  }

  // Utility function to check if we're in the browser environment
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  ngOnInit() {
    this.authService.username$.subscribe((username) => {
      this.username = username;
      this.isLoggedIn = !!username; // Set isLoggedIn to true if username is truthy
    });

    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        console.log('User ID:', this.userId); // Debugging log
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = null;
  }
}
