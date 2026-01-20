import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../services/auth';
import { Router } from '@angular/router';
import { LucideAngularModule, Settings, LogOut } from 'lucide-angular';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    public cartService: CartService,
  ) {}
  searchTerm = '';
  isHomePage = true;
  ngOnInit(): void {
    this.user$ = this.authService.user$;

    // ✅ الاستماع للحدث العالمي لفتح المودال
    window.addEventListener('openLoginModal', () => {
      this.openLoginModal();
    });

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });
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

  /** ✅ الجديد: الانتقال لصفحة السلة */
  goToCart() {
    this.router.navigate(['/cart']);
  }
}
