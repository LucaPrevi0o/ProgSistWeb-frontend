import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product-service';
import { CartService, CartItem, Cart } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service'; // aggiungi questa import

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  cart: Cart | null = null;
  cartItem: CartItem | null = null;
  quantity = 1;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private auth: AuthService // aggiungi qui
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error = 'ID prodotto non valido';
    }

    // Controlla autenticazione prima di caricare il carrello
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn) {
      this.cartService.getCart().subscribe(cart => {
        this.cart = cart;
        this.updateCartItem();
      });
    } else {
      this.cart = null;
      this.cartItem = null;
    }
  }

  updateCartItem(): void {
    if (this.cart && this.product) {
      this.cartItem = this.cart.cart_items.find(
        item => item.product.id === this.product!.id
      ) || null;
      this.quantity = 1;
      // this.cdr.detectChanges(); // Puoi rimuovere questa riga se non hai problemi di UI
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Prodotto caricato:', product);
        this.product = product;
        this.loading = false;
        this.updateCartItem();
        this.cdr.detectChanges(); // <--- AGGIUNGI QUESTA RIGA
      },
      error: (err) => {
        console.error('Errore caricamento prodotto:', err);
        this.error = 'Errore nel caricamento del prodotto';
        this.loading = false;
        this.cdr.detectChanges(); // <--- AGGIUNGI QUESTA RIGA
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock_quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem(this.product.id, this.quantity).subscribe({
        next: () => {
          // alert(`${this.quantity}x ${this.product!.name} aggiunto al carrello!`);
          this.router.navigate(['/cart']); // Naviga al carrello dopo l'aggiunta
        },
        error: (err) => {
          alert('Errore durante l\'aggiunta al carrello');
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.cartService.refreshCart();
    this.router.navigate(['/products']);
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > this.maxSelectableQuantity) value = this.maxSelectableQuantity;
    this.quantity = value;
  }

  onQuantityBlur(): void {
    if (this.quantity < 1) this.quantity = 1;
    if (this.quantity > this.maxSelectableQuantity) this.quantity = this.maxSelectableQuantity;
  }

  get isOutOfStockForUser(): boolean {
    if (!this.product) return false;
    const inCart = this.cartItem ? this.cartItem.quantity : 0;
    return inCart >= this.product.stock_quantity;
  }

  get maxSelectableQuantity(): number {
    if (!this.product) return 1;
    const inCart = this.cartItem ? this.cartItem.quantity : 0;
    const available = this.product.stock_quantity - inCart;
    return available > 0 ? available : 0;
  }
}
