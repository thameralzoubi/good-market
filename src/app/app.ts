import { Component, HostBinding, OnInit, effect, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('shopify');
  @HostBinding('attr.data-theme') dataTheme = 'light';

  constructor(private themeService: ThemeService) {
    effect(() => {
      this.dataTheme = this.themeService.isDarkMode() ? 'dark' : 'light';
    });
  }

  ngOnInit(): void {
    // ThemeService سيهيّء نفسه بنفسه عند الإنشاء
  }
}
