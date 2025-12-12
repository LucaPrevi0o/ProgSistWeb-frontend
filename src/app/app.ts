import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <--- aggiungi questo import
import { AuthService } from './services/auth-service';
import { User } from './models/user-model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // <--- aggiungi CommonModule qui
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Shop Online';
  user: User | null = null;

  constructor(private auth: AuthService) {
    this.auth.getCurrentUser().subscribe(u => this.user = u);
  }

  logout() {
    this.auth.logout();
    this.user = null;
  }
}
