import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSignal = signal<boolean>(this.getInitialTheme());
  darkMode$ = this.darkModeSignal.asReadonly();
  private transitionTimeoutId: number | null = null;

  constructor() {
    this.initializeTheme();
  }

  /**
   * تهيئة الوضع الليلي بناءً على تفضيلات النظام أو التخزين المحلي
   */
  private initializeTheme(): void {
    const isDarkMode = this.darkModeSignal();
    this.applyTheme(isDarkMode);
  }

  /**
   * الحصول على الوضع الليلي الأولي
   */
  private getInitialTheme(): boolean {
    // التحقق من التخزين المحلي أولاً
    const saved = localStorage.getItem('theme-mode');
    if (saved !== null) {
      return saved === 'dark';
    }

    // التحقق من تفضيلات النظام
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }

    return false;
  }

  /**
   * تطبيق الوضع الليلي على DOM
   */
  private applyTheme(isDark: boolean): void {
    const theme = isDark ? 'dark' : 'light';

    document.documentElement.classList.add('theme-transition');
    if (document.body) {
      document.body.classList.add('theme-transition');
    }

    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    document.documentElement.setAttribute('data-theme', theme);

    document.documentElement.classList.toggle('dark-mode', isDark);

    if (document.body) {
      document.body.classList.toggle('dark-theme', isDark);
      document.body.classList.toggle('light-theme', !isDark);
      document.body.setAttribute('data-theme', theme);
      document.body.classList.toggle('dark-mode', isDark);
    }

    if (this.transitionTimeoutId !== null) {
      window.clearTimeout(this.transitionTimeoutId);
    }

    this.transitionTimeoutId = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
      if (document.body) {
        document.body.classList.remove('theme-transition');
      }
    }, 260);

    // حفظ التفضيل
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');

    // إرسال حدث مخصص للمكونات الأخرى
    window.dispatchEvent(
      new CustomEvent('themechange', {
        detail: { isDark },
      }),
    );
  }

  /**
   * تبديل الوضع الليلي
   */
  toggleDarkMode(): void {
    const isDark = !this.darkModeSignal();
    this.darkModeSignal.set(isDark);
    this.applyTheme(isDark);
  }

  /**
   * تعيين الوضع الليلي
   */
  setDarkMode(isDark: boolean): void {
    this.darkModeSignal.set(isDark);
    this.applyTheme(isDark);
  }

  /**
   * الحصول على الوضع الليلي الحالي
   */
  isDarkMode(): boolean {
    return this.darkModeSignal();
  }
}
