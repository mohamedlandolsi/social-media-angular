import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
  };

  errorMessage = '';  // To store email error message
  usernameError = ''; // To store username error message
  passwordError = ''; // To store password error message
  requiredError = ''; // To store generic "required" error message

  constructor(private authService: AuthService, private router: Router) {}

  registerUser() {
    // Reset all error messages
    this.errorMessage = '';
    this.usernameError = '';
    this.passwordError = '';
    this.requiredError = '';

    // Check if all fields are filled (required validation)
    if (!this.user.username.trim()) {
      this.usernameError = 'Username is required.';
    }
    if (!this.user.email.trim()) {
      this.errorMessage = 'Email is required.';
    }
    if (!this.user.password.trim()) {
      this.passwordError = 'Password is required.';
    }

    // If any field is empty, stop the function and show error messages
    if (this.usernameError || this.errorMessage || this.passwordError) {
      this.requiredError = 'Please fill in all required fields.';
      return;
    }

    // Regular expression to validate email for Gmail or Yahoo domains
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;

    // Validate the email
    if (!emailPattern.test(this.user.email)) {
      this.errorMessage = 'Email must be from Gmail or Yahoo (e.g., example@gmail.com)';
      return; // Stop the function if email is invalid
    }

    // Validate the username (example: non-empty, minimum length)
    if (this.user.username.trim() === '') {
      this.usernameError = 'Username is required.';
      return; // Stop the function if username is invalid
    }

    // Validate the password (example: minimum length of 6 characters)
    if (this.user.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
      return; // Stop the function if password is invalid
    }

    // Proceed with registration if all fields are valid
    this.authService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
        // Handle successful registration (e.g., redirect or show a message)
      },
      error: (error) => {
        console.error('Registration error', error);
        // Handle errors (e.g., show a message to the user)
      },
    });
  }
}
