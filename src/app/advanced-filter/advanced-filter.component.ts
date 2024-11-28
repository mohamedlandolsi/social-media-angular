import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.css'
})
export class AdvancedFilterComponent {
  isOpen: boolean = false;
  @Output() filterSelected = new EventEmitter<string>();

  onSelectFilter(option: string): void {
    this.filterSelected.emit(option); // Emit the selected filter
  }

  // Toggles the dropdown open/close state
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  // Closes the dropdown when clicking outside the menu
  closeDropdown(): void {
    this.isOpen = false;
  }
}
