import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isOpen = false; // State to track if the mobile menu is open or closed
  username: string | null = null;
  isLoggedIn: boolean = false;
  userId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Set initial theme based on user preference
    this.themeService.applyTheme();

    // Subscribe to AuthService observables to update authentication state
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

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleDarkMode() {
    // Delegate dark mode toggling to ThemeService
    this.themeService.toggleDarkMode();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/']);
  }
}
