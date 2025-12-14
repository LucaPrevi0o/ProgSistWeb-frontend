import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Cart, CartItem } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.error = 'Devi essere loggato per vedere il carrello.';
      return;
    }
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: cart => {
        this.cart = cart;
        this.loading = false;
        this.cdr.detectChanges(); // Forza aggiornamento UI
      },
      error: err => {
        this.error = 'Errore nel caricamento del carrello';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id).subscribe({
      next: () => this.cartService.getCart().subscribe(cart => {
        this.cart = cart;
        this.cdr.detectChanges();
      })
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateItem(item.id, quantity).subscribe({
      next: () => this.cartService.getCart().subscribe(cart => {
        this.cart = cart;
        this.cdr.detectChanges();
      })
    });
  }

  getTotal(): number {
    return this.cart?.cart_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) || 0;
  }
}
