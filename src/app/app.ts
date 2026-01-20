import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ToastComponent } from './components/toast/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shopify');
}
