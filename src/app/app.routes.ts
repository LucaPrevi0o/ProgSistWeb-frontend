import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }
];
