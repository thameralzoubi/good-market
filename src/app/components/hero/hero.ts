import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
})
export class Hero {
  searchTerm = '';

  heroImages = ['assets/img/thamer1.jpg', 'assets/img/thamer2.jpg', 'assets/img/thamer3.jpg'];
  currentBgIndex = 0;

  constructor(private router: Router) {
    setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.heroImages.length;
    }, 6000);
  }

  performSearch() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/productlist'], {
      queryParams: { q: this.searchTerm },
    });
  }
}
