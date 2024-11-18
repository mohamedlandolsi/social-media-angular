import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Set initial theme based on user preference
    this.themeService.applyTheme();
  }

  toggleDarkMode() {
    // Delegate dark mode toggling to ThemeService
    this.themeService.toggleDarkMode();
  }
}
