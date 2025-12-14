import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartService, Cart } from '../../services/cart-service';
import { UserInfoService } from '../../services/user-info-service';
import { AuthService } from '../../services/auth-service'; // <--- aggiungi questa import

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private userInfoService: UserInfoService,
    private auth: AuthService // <--- aggiungi qui
  ) {
    this.checkoutForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        city: ['', Validators.required],
        zip: ['', Validators.required],
        province: ['', Validators.required]
      }),
      country: ['', Validators.required],
      notes: ['']
    });

    this.cartService.getCartObservable().subscribe(cart => this.cart = cart);
    this.cartService.refreshCart();

    // Precompila il form con UserInfo
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      if (userInfo) {
        this.checkoutForm.patchValue({
          lastName: userInfo.last_name,
          firstName: userInfo.first_name,
          phone: userInfo.phone,
          address: {
            street: userInfo.address?.street,
            number: userInfo.address?.number,
            city: userInfo.address?.city,
            zip: userInfo.address?.zip,
            province: userInfo.address?.province
          }
        });
      }
    });

    // Precompila il campo email con l'utente autenticato
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.checkoutForm.patchValue({
          email: user.email
        });
      }
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) return;
    // Gestione invio ordine
    console.log(this.checkoutForm.value);
  }

  getTotal(): number {
    return this.cart?.cart_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) || 0;
  }
}
