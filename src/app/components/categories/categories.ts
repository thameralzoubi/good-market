import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { CategoryService, ApiCategory } from '../../services/categoryservice';
import { CATEGORY_ICONS } from '../../config/category-icons';

interface CategoryView {
  key: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
})
export class Categories implements OnInit {
  categories: CategoryView[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((apiCategories: ApiCategory[]) => {
      this.categories = apiCategories.map((cat: ApiCategory) => ({
        key: cat.slug,
        name: cat.name,
        icon: CATEGORY_ICONS[cat.slug] ?? ShoppingCart, // fallback icon
        color: '#e5e7eb',
        desc: `View products in ${cat.name} category`, // ✅ وصف بالإنجليزية
      }));

      console.log('Final categories:', this.categories);
    });
  }
}
