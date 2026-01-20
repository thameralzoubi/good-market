import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductM } from '../models/product.model';
import { AuthService, User } from './auth';

export interface Cart {
  product: ProductM;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Cart[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadCart(user.id);
      } else {
        this.cartItemsSubject.next([]);
      }
    });
  }

  // ===== helpers =====
  private get storageKey(): string | null {
    return this.currentUser ? `cart_user_${this.currentUser.id}` : null;
  }

  private saveCart(items: Cart[]) {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  private loadCart(userId: number) {
    const data = localStorage.getItem(`cart_user_${userId}`);
    const items = data ? JSON.parse(data) : [];
    this.cartItemsSubject.next(items);
  }

  // ===== public API =====
  getCartItems(): Cart[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: ProductM) {
    if (!this.currentUser) return;

    const items = this.getCartItems();
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      items.push({ product, quantity: 1 });
    }

    this.cartItemsSubject.next([...items]);
    this.saveCart(items);
  }

  removeFromCart(productId: number) {
    if (!this.currentUser) return;

    const items = this.getCartItems().filter((i) => i.product.id !== productId);
    this.cartItemsSubject.next(items);
    this.saveCart(items);
  }

  clearCart() {
    if (!this.currentUser) return;

    this.cartItemsSubject.next([]);
    this.saveCart([]);
  }

  updateQuantity(productId: number, quantity: number) {
    if (!this.currentUser) return;

    const items = this.getCartItems();
    const item = items.find((i) => i.product.id === productId);

    if (!item) return;

    item.quantity = quantity;

    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cartItemsSubject.next([...items]);
      this.saveCart(items);
    }
  }
}
