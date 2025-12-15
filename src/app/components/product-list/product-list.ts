import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product-service';
import { environment } from '../../../environments/environment';
import { CartService, Cart } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service'; // <--- aggiungi questa import

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

  // Paginazione
  page = 1;
  perPage = 6;
  total = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    // Carica il carrello solo se autenticato
    if (this.auth.isAuthenticated()) {
      this.cartService.getCartObservable().subscribe(cart => {
        this.cart = cart;
      });
      this.cartService.refreshCart();
    } else {
      this.cart = null;
    }
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const filters: any = {
      page: this.page,
      per_page: this.perPage
    };
    if (this.searchQuery) filters.q = this.searchQuery;
    if (this.selectedCategory) filters.category = this.selectedCategory;

    this.productService.getProducts(filters).subscribe(res => {
      this.products = res.products;
      this.total = res.total;
      this.loading = false;
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.page = page;
    this.loadProducts();
  }

  totalPages(): number {
    return Math.ceil(this.total / this.perPage);
  }

  onPageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > this.totalPages()) value = this.totalPages();
    this.goToPage(value);
  }
}
