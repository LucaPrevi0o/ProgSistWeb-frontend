import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserInfoService } from '../../services/user-info-service'; // <--- importa il servizio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userInfoService: UserInfoService, // <--- aggiungi qui
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        // Usa refreshUserInfo per aggiornare la cache
        this.userInfoService.refreshUserInfo().subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/products']);
          },
          error: () => {
            this.loading = false;
            this.router.navigate(['/profile']);
          }
        });
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.error || 'Login fallito';
      }
    });
  }
}
