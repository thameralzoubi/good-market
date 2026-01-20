import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductM } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { Search } from '../../services/search'; // ✅ إضافة

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilter],
  templateUrl: './productlist.html',
  styleUrls: ['./productlist.scss'],
})
export class ProductListComponent implements OnInit {
  category!: string;

  allProducts: ProductM[] = [];
  filteredProducts: ProductM[] = [];

  maxPriceInProducts = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private searchService: Search, // ✅ إضافة
  ) {}

  ngOnInit(): void {
    // ✅ جديد: نراقب query params (q) للبحث العام
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['q'];

      if (searchQuery) {
        // 🔍 بحث عام (منتج / تصنيف / أي شي)
        this.searchService.search(searchQuery).subscribe((res) => {
          this.allProducts = res;
          this.filteredProducts = res;
          this.maxPriceInProducts = res.length ? Math.max(...res.map((p) => p.price)) : 0;
        });
        return;
      }

      // ⬇️ السلوك القديم كما هو تمامًا
      this.category = this.route.snapshot.paramMap.get('category')!;

      this.productService.getProductsByCategory(this.category).subscribe((res) => {
        this.allProducts = res;
        this.filteredProducts = res;
        this.maxPriceInProducts = Math.max(...res.map((p) => p.price));
      });
    });
  }

  onAddToCart(productId: number) {
    const product = this.allProducts.find((p) => p.id === productId);
    if (product) {
      this.cartService.addToCart(product);
    }
  }

  applyFilters(filters: any) {
    this.filteredProducts = this.allProducts
      .filter(
        (p) =>
          (!filters.searchText ||
            p.title.toLowerCase().includes(filters.searchText.toLowerCase())) &&
          (filters.maxPrice == null || p.price <= filters.maxPrice),
      )
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'name-asc') return a.title.localeCompare(b.title);
        return 0;
      });
  }

  resetAllFilters() {
    this.filteredProducts = [...this.allProducts];
  }
}
