import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: any;
}

export interface Cart {
  id: number;
  user_id: number;
  status: string;
  cart_items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getCart(): Observable<Cart> {
    if (!this.auth.isAuthenticated()) {
      return of(null as any);
    }
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(() => {
        this.cartSubject.next(null);
        return of(null as any);
      })
    );
  }

  getCartObservable(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

  addItem(product_id: number, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/items`, { product_id, quantity });
  }

  updateItem(id: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.apiUrl}/items/${id}`, { quantity });
  }

  removeItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  refreshCart() {
    if (this.auth.isAuthenticated()) {
      this.getCart().subscribe(cart => {
        this.cartSubject.next(cart);
      });
    } else {
      this.cartSubject.next(null);
    }
  }
}