import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';
  description: string = '';
  city: string = '';
  homeTown: string = '';
  relationship: string = '';

  userId: string = '';
  isDarkMode: boolean = false;
  loggedIn: boolean = false;
  token: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getCurrentUserId() || '';
    this.token = this.authService.getToken() || '';
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loggedIn = this.authService.isLoggedIn();

    this.userId = this.authService.getCurrentUserId() || ''; // Get the logged-in user's ID
    this.token = this.authService.getToken() || ''; // Get the user's token

    if (this.userId && this.token) {
      this.userService.getUserById(this.userId).subscribe(
        (userData) => {
          // Populate the form fields with user data
          this.username = userData.username;
          this.email = userData.email;
          this.description = userData.description;
          this.city = userData.city;
          this.homeTown = userData.homeTown;
          this.relationship = userData.relationship;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.error('User ID or token is missing.');
      this.router.navigate(['/login']); // Redirect to login if no user is logged in
    }
  }

  updateUser() {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    if (!token) {
      alert('Authentication token is missing. Please log in again.');
      return;
    }

    const updatedData = {
      username: this.username,
      email: this.email,
      password: this.password,
      description: this.description,
      city: this.city,
      homeTown: this.homeTown,
      relationship: this.relationship,
    };

    // Remove empty fields to avoid sending undefined values
    (Object.keys(updatedData) as (keyof typeof updatedData)[]).forEach(
      (key) => {
        if (updatedData[key] === '') {
          delete updatedData[key]; // Safely remove empty fields
        }
      }
    );

    this.userService.updateUser(this.userId, updatedData, token).subscribe(
      (response) => {
        alert('Profile updated successfully!');

        // Refresh the user data in the UI
        this.userService.getUserById(this.userId).subscribe(
          (userData) => {
            this.username = userData.username;
            this.email = userData.email;
            this.description = userData.description;
            this.city = userData.city;
            this.homeTown = userData.homeTown;
            this.relationship = userData.relationship;
          },
          (error) => {
            console.error('Error refreshing user data:', error);
          }
        );
      },
      (error) => {
        alert('Failed to update profile. Please try again.');
        console.error(error);
      }
    );
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', theme);
  }
}
