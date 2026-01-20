import { Component } from '@angular/core';
import { CartService, Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent {
  cartItems$: Observable<Cart[]>;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  increment(productId: number) {
    const item = this.cartService.getCartItems().find((i) => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrement(productId: number) {
    const item = this.cartService.getCartItems().find((i) => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  getTotal(items: Cart[]): number {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  goToShop() {
    this.router.navigate(['/']);
  }
}
