import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(text: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ text, type });
    setTimeout(() => this.toastSubject.next(null), 4000); // تختفي بعد 4 ثواني
  }
}
