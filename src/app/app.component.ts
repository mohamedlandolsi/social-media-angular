import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Social Media App';

  constructor(public router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    // Ensures the theme is applied on app load
    this.themeService.applyTheme();
  }
}
