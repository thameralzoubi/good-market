import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.html',
  styleUrls: ['./success.scss'],
})
export class Success implements OnInit {
  order: Order | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.orderService.lastOrder$.subscribe((o) => {
      if (!o) {
        // إذا ما في طلب سابق نرجع للصفحة الرئيسية
        this.router.navigate(['/']);
      } else {
        this.order = o;
      }
    });
  }
  backToHome() {
    this.router.navigate(['/']);
  }
}
