import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductM } from '../../models/product.model';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  imports: [CommonModule, LucideAngularModule],
})
export class ProductDetail implements OnInit {
  product!: ProductM;
  quantity = 1;
  currentImageIndex = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService, // ✅ استدعاء AuthService للتحقق من تسجيل الدخول
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading = false;
      },
    });
  }

  prevImage() {
    if (this.product.images && this.product.images.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  nextImage() {
    if (this.product.images && this.product.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (this.authService.isAuthenticated()) {
      // ✅ المستخدم مسجل دخول → نضيف المنتج للسلة
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
    } else {
      // ✅ المستخدم غير مسجل → نرسل حدث لفتح نافذة تسجيل الدخول
      const loginEvent = new CustomEvent('openLoginModal', { bubbles: true });
      window.dispatchEvent(loginEvent);
    }
  }

  // لحساب السعر بعد الخصم إن وجد
  get discountedPrice(): number {
    if (!this.product.discountPercentage) return this.product.price;
    const discount = (this.product.price * this.product.discountPercentage) / 100;
    return +(this.product.price - discount).toFixed(2);
  }

  // لمعرفة حالة التوفر
  get inStock(): boolean {
    return this.product.stock > 0;
  }
}
