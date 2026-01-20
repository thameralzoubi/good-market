import { Injectable } from '@angular/core';
import { CartService, Cart } from './cart';
import { BehaviorSubject } from 'rxjs';

export interface Order {
  id: number;
  items: Cart[];
  total: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private lastOrderSubject = new BehaviorSubject<Order | null>(null);
  lastOrder$ = this.lastOrderSubject.asObservable();

  constructor(private cartService: CartService) {}

  placeOrder() {
    const items = this.cartService.getCartItems();
    if (!items.length) {
      throw new Error('Cart is empty');
    }

    const newOrder: Order = {
      id: Date.now(),
      items: [...items],
      total: items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      date: new Date(),
    };

    this.orders.push(newOrder);
    this.lastOrderSubject.next(newOrder);
    this.cartService.clearCart(); // تفريغ السلة بعد الطلب

    return newOrder;
  }

  getOrders(): Order[] {
    return [...this.orders];
  }
}
