import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

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

  constructor(private apiService: ApiService, private router: Router) {}

  registerUser() {
    this.apiService.registerUser(this.user).subscribe({
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
