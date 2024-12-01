import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isOpen = false; // State to track if the mobile menu is open or closed
  username: string | null = null;
  email: string | null = null;
  isLoggedIn: boolean = false;
  userId: string | null = null;
  userData: any;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
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

    this.authService.email$.subscribe((email) => {
      this.email = email;
    });

    this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        console.log('User ID:', this.userId); // Debugging log
      }
    });

    
    

    this.loadUserData();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleDarkMode() {
    // Delegate dark mode toggling to ThemeService
    this.themeService.toggleDarkMode();
  }

  loadUserData() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((data) => {
        this.userData = data; // Store data in a component property
        this.isAdmin = data.isAdmin === true; // Check if the user is an admin
      });
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
