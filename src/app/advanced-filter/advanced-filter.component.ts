import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent {
  isOpen: boolean = false;                  // Dropdown visibility state
  selectedFilterOption: string = "include-my-posts"; // Default filter option
  @Output() filterSelected = new EventEmitter<string>();  // Event emitter to notify parent component

  // Toggles the dropdown open/close state
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  // Closes the dropdown (called when clicking outside the menu)
  closeDropdown(): void {
    this.isOpen = false;
  }

  // Updates the selected filter option and emits it to the parent component
  onSelectFilter(option: string): void {
    this.selectedFilterOption = option;      // Update the selected filter option
    this.filterSelected.emit(option);        // Emit the selected filter to parent component
    this.closeDropdown();                    // Close the dropdown
  }

  // Emit the selected filter option when the component is initialized (optional)
  ngOnInit(): void {
    this.filterSelected.emit(this.selectedFilterOption);  // Emit the default filter on initialization
  }
}
