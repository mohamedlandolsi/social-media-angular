import { Component } from '@angular/core';
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
    private authService: AuthService,
    private router: Router
  ) {}

  loginUser() {
    this.authService.loginUser(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful');
        console.log(`Username: ${response.user.username}`);
        this.authService.setToken(response.token);
        this.authService.setUsername(response.user.username); // Set username in AuthService
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
      },
    });
  }
  
}
