import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Cart, CartItem } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.loading = false;
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id).subscribe(() => {
      this.cartService.getCart().subscribe(cart => {
        this.cart = cart;
      });
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateItem(item.id, quantity).subscribe(() => {
      this.cartService.getCart().subscribe(cart => {
        this.cart = cart;
      });
    });
  }

  getTotal(): number {
    return this.cart?.cart_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) || 0;
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
