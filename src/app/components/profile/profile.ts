import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/user-model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  user: User | null = null;

  constructor(private auth: AuthService) {
    this.auth.getCurrentUser().subscribe(u => this.user = u);
  }
}