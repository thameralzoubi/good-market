import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastService } from '../../services/toastmessage';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngIf="toast" [ngClass]="toast.type" class="toast">
        {{ toast.text }}
      </div>
    </div>
  `,
  styleUrls: ['./toast.scss'],
})
export class ToastComponent {
  toast: ToastMessage | null = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe((msg) => (this.toast = msg));
  }
}
