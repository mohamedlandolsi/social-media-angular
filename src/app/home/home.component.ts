import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  loggedIn: boolean = false;
  isOpen = false;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.loggedIn = this.authService.isLoggedIn();
  }
}
