import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkModeEnabled: boolean = false;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Check if localStorage is available and retrieve theme preference
    if (this.isLocalStorageAvailable()) {
      this.isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    }

    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;

    // Update localStorage only if available
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(
        'darkMode',
        this.isDarkModeEnabled ? 'enabled' : 'disabled'
      );
    }

    this.applyTheme();
  }

  applyTheme(): void {
    // Only attempt to modify the document if it is available
    if (this.document) {
      if (this.isDarkModeEnabled) {
        this.renderer.addClass(this.document.body, 'dark');
      } else {
        this.renderer.removeClass(this.document.body, 'dark');
      }
    }
  }

  isDarkMode(): boolean {
    return this.isDarkModeEnabled;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
