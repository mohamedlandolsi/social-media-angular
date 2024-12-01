import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css'],
})
export class SortByComponent {
  isOpen = false; // Tracks the dropdown state
  selectedSortOption: string = 'date'; // Default selected option

  // Emit the selected sorting option to the parent
  @Output() sortSelected = new EventEmitter<string>();

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  onSort(option: string): void {
    this.selectedSortOption = option; // Update the selected option
    this.sortSelected.emit(option); // Emit the selected option
    this.closeDropdown(); // Close the dropdown
  }

  ngOnInit(): void {
    // Emit default sort option on page load
    this.sortSelected.emit(this.selectedSortOption);
  }
}
