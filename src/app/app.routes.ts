import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { UserInfoComponent } from './components/user-info/user-info';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'user-info', component: UserInfoComponent }
];
