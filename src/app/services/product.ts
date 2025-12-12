import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {
    console.log('ProductService initialized with apiUrl:', this.apiUrl);
  }

  getProducts(filters?: {
    category?: string;
    q?: string;
    page?: number;
    per_page?: number;
  }): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.q) params = params.set('q', filters.q);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.per_page) params = params.set('per_page', filters.per_page.toString());
    }

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('Making HTTP GET request to:', url);

    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      tap(response => console.log('HTTP response received:', response)),
      catchError(error => {
        console.error('HTTP error occurred:', error);
        throw error;
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    console.log('Getting product:', id);
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
