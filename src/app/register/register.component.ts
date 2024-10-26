import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  registerUser() {
    this.authService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/']);
        // Handle successful registration (e.g., redirect or show a message)
      },
      error: (error) => {
        console.error('Registration error', error);
        // Handle errors (e.g., show a message to the user)
      },
    });
  }
}
