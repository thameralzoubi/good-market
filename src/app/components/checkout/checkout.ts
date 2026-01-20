import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Cart } from '../../services/cart';
import { Observable } from 'rxjs';
import { OrderService } from '../../services/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class Checkout {
  cartItems$: Observable<Cart[]> | undefined;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {
    this.cartItems$ = this.cartService.cartItems$; // تأكد أن الـ Observable موجود
  }

  getTotal(items: Cart[]): number {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  // === هذا هو confirmOrder الجديد ===
  confirmOrder() {
    const items = this.cartService.getCartItems(); // جلب العناصر الحالية مباشرة
    if (items.length === 0) {
      alert('No items to checkout.');
      return; // توقف هنا إذا فارغ
    }

    const order = this.orderService.placeOrder(); // إنشاء الطلب
    this.router.navigate(['/order-success']); // التوجيه لصفحة التأكيد
  }
}
