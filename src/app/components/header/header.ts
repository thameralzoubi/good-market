import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService, User } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { Login } from '../login/login';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, RouterModule, RouterLink, Login, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  showLoginModal = false;
  dropdownOpen = false;
  user$!: Observable<User | null>;
  darkMode$: Observable<boolean>;
  cartCount$: Observable<number>;
  isHomePage = true;
  isCompactHeader = false;
  showBackButton = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    public cartService: CartService,
    private themeService: ThemeService,
  ) {
    this.darkMode$ = toObservable(this.themeService.darkMode$);
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
    );
  }

  searchTerm = '';

  ngOnInit(): void {
    this.user$ = this.authService.user$;

    // ✅ الاستماع للحدث العالمي لفتح المودال
    window.addEventListener('openLoginModal', () => {
      this.openLoginModal();
    });

    this.updateHeaderState(this.router.url);

    this.router.events.subscribe(() => {
      this.updateHeaderState(this.router.url);
    });
  }

  private updateHeaderState(url: string) {
    const cleanUrl = url.split('?')[0];
    const isAuthPage = cleanUrl === '/login' || cleanUrl === '/signup';
    const isProfilePage = cleanUrl === '/profile-settings';
    const isProductDetail = /^\/product\/.+\/\d+$/.test(cleanUrl);

    this.isHomePage = cleanUrl === '/';
    this.isCompactHeader = isAuthPage || isProfilePage;
    this.showBackButton = this.isCompactHeader || isProductDetail;
  }

  performSearch() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/productlist'], {
      queryParams: { q: this.searchTerm },
    });
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  goBack(event?: Event) {
    event?.stopPropagation();
    this.location.back();
  }

  /** ✅ الجديد: الانتقال لصفحة السلة */
  goToCart() {
    this.router.navigate(['/cart']);
  }
}
