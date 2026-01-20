import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { Home } from './components/home/home';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { ProductListComponent } from './components/productlist/productlist';
import { ProductDetail } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Success } from './components/success/success';

import { AuthGuard } from './guards/auth.guard';
import { CheckoutGuard } from './guards/checkout.guard';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'signup', component: Signup },
  { path: 'login', component: Login },

  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: Checkout, canActivate: [CheckoutGuard] },
  { path: 'order-success', component: Success },

  { path: 'productlist', component: ProductListComponent },
  { path: 'product/:category/:id', component: ProductDetail },
  { path: 'product/:category', component: ProductListComponent },

  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
