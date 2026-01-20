import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CartService } from '../services/cart';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const items = this.cartService.getCartItems();

    if (!items || items.length === 0) {
      this.router.navigate(['/cart']);
      return false;
    }

    return true;
  }
}
