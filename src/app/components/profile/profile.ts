import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserInfoService, UserInfo } from '../../services/user-info-service';
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
  userInfo: UserInfo | null = null;
  showAdditionalInfo = false;

  constructor(
    private auth: AuthService,
    private userInfoService: UserInfoService,
    private router: Router
  ) {
    this.auth.getCurrentUser().subscribe(u => this.user = u);
    // Sottoscrivi allo stream reattivo
    this.userInfoService.userInfo$().subscribe(info => this.userInfo = info);
  }

  toggleAdditionalInfo() {
    this.showAdditionalInfo = !this.showAdditionalInfo;
  }

  goToUserInfo() {
    this.router.navigate(['/user-info']);
  }
}