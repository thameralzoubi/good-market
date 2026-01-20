import { Component } from '@angular/core';
import {
  LucideAngularModule,
  ShoppingBag,
  Facebook,
  Instagram,
  Twitter,
  CreditCard,
  Smartphone,
  CheckCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  currentYear = new Date().getFullYear();
}
