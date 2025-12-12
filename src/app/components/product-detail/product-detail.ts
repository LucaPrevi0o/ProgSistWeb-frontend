import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error = 'ID prodotto non valido';
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del prodotto';
        console.error('Error loading product:', err);
        this.loading = false;
        this.cdr.detectChanges();
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
      // TODO: Implementare aggiunta al carrello
      console.log(`Adding ${this.quantity}x ${this.product.name} to cart`);
      alert(`${this.quantity}x ${this.product.name} aggiunto al carrello!`);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
