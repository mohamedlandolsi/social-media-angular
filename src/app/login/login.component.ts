import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  loginUser() {
    this.apiService.loginUser(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authService.setToken(response.token); // Assuming the token is in response.token
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
      },
    });
  }
}
