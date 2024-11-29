import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  activeTab: string = 'users'; // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  
}
