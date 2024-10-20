import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isOpen = false; // State to track if the mobile menu is open or closed

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  constructor(private renderer: Renderer2) {
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
}
