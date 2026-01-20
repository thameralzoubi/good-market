import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductM } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth'; // ✅ استدعاء الخدمة

@Component({
  imports: [CommonModule, LucideAngularModule],
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
  standalone: true,
})
export class ProductCardComponent {
  @Input() product!: ProductM;
  @Output() addToCart = new EventEmitter<number>();

  currentImageIndex = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService, // ✅ حققنا ال auth
  ) {}

  addToCartClick() {
    // ✅ إذا المستخدم مسجل دخول → يضيف للـ cart
    if (this.authService.isAuthenticated()) {
      this.cartService.addToCart(this.product);
    } else {
      // ✅ إذا مش مسجل دخول → نفتح نافذة تسجيل الدخول
      const loginEvent = new CustomEvent('openLoginModal', { bubbles: true });
      window.dispatchEvent(loginEvent);
    }
  }

  nextImage() {
    if (!this.product.images?.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  prevImage() {
    const len = this.product.images.length;
    this.currentImageIndex = (this.currentImageIndex - 1 + len) % len;
  }

  goToImage(index: number) {
    if (!this.product.images?.length) return;
    this.currentImageIndex = index;
  }

  goToDetails() {
    this.router.navigate(['/product', this.product.category, this.product.id]);
  }
}
