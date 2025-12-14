import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { environment } from '../../../environments/environment';
import { CartService, Cart } from '../../services/cart-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtri
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];

  cart: Cart | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.cartService.refreshCart();
    this.loadProducts();
    this.cartService.getCartObservable().subscribe(cart => {
      this.cart = cart;
    });
  }

  loadProducts(): void {
    console.log('loadProducts started, setting loading = true');
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    
    const filters: any = {};
    if (this.searchQuery) filters.q = this.searchQuery;
    if (this.selectedCategory) filters.category = this.selectedCategory;

    console.log('Starting HTTP call to:', `${environment.apiUrl}/products`);
    console.log('With filters:', filters);

    this.productService.getProducts(filters).subscribe({
      next: (products) => {
        console.log('SUCCESS: Received products:', products);
        this.products = products;
        this.extractCategories(products);
        this.loading = false;
        console.log('Setting loading = false');
        this.cdr.detectChanges(); // Forza aggiornamento UI
      },
      error: (err) => {
        console.error('ERROR: Failed to load products:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText
        });
        this.error = 'Errore nel caricamento dei prodotti';
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('HTTP call completed');
      }
    });
  }

  extractCategories(products: Product[]): void {
    const uniqueCategories = new Set(products.map(p => p.category).filter(c => c));
    this.categories = Array.from(uniqueCategories);
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.loadProducts();
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/300x200/cccccc/666666?text=No+Image';
  }

  getCartQuantity(productId: number): number {
    if (!this.cart) return 0;
    const item = this.cart.cart_items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}
