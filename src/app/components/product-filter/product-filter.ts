import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.scss',
})
export class ProductFilter implements OnChanges {
  @Input() maxAvailablePrice = 0; // يجي من المنتجات
  @Output() filterChange = new EventEmitter<any>();

  maxPrice = 0; // يبدأ من أعلى سعر تلقائي
  searchText = '';
  sortBy = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['maxAvailablePrice']) {
      this.maxPrice = this.maxAvailablePrice; // يبدأ من أعلى سعر عند استلام البيانات
    }
  }

  applyFilters() {
    this.filterChange.emit({
      searchText: this.searchText,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy,
    });
  }

  resetFilters() {
    this.searchText = '';
    this.maxPrice = this.maxAvailablePrice; // إعادة الضبط لأعلى سعر
    this.sortBy = '';
    this.applyFilters();
  }
}
