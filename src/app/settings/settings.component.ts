import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  email: string = '';
  password: string = '';
  isDarkMode: boolean = false;
  loggedIn: boolean = false; // Add this property

  constructor(public router: Router, private authService: AuthService) {
    // Initialize theme state
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    // Check if the user is logged in
    this.loggedIn = this.authService.isLoggedIn();
    
  }

  updateEmail() {
    if (this.email.trim() === '') {
      alert('Email cannot be empty.');
      return;
    }
    console.log(`Updating email to: ${this.email}`);
    alert('Email updated successfully!');
  }

  updatePassword() {
    if (this.password.trim() === '') {
      alert('Password cannot be empty.');
      return;
    }
    console.log(`Updating password to: ${this.password}`);
    alert('Password updated successfully!');
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is irreversible!')) {
      console.log('Account deleted');
      alert('Account deleted successfully.');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', theme);
  }
}
