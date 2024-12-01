import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Fix property name
})
export class LoginComponent {
  credentials = {
    usernameOrEmail: '', // Can be either a username or an email
    password: '',
  };
  

  errorMessage: string = ''; // Add an error message property for feedback

  constructor(private authService: AuthService, private router: Router) {}

  loginUser() {
    this.authService.loginUser(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful');
        console.log(`Username: ${response.user.username}`);
        console.log(`User ID: ${response.user._id}`);
  
        // Set token and user details
        this.authService.setLoginDetails(response.user, response.token);
  
        console.log('Login Response:', response);
  
        // Redirect to home or any other route
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
  
        // Check for specific error codes or messages
        if (error.status === 403) {
          this.errorMessage =
            'Your account has been deactivated. Please contact support.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid username/email or password.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
  
  
}
