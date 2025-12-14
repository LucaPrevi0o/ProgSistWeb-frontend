import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserInfoService } from '../../services/user-info-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss'
})
export class UserInfoComponent implements OnInit {
  userInfoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userInfoService: UserInfoService,
    private router: Router
  ) {
    this.userInfoForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        city: ['', Validators.required],
        zip: ['', Validators.required],
        province: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      if (userInfo) {
        this.userInfoForm.patchValue({
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
  }

  onSubmit() {
    if (this.userInfoForm.invalid) return;
    const formValue = this.userInfoForm.value;
    const payload = {
      user_info: {
        last_name: formValue.lastName,
        first_name: formValue.firstName,
        phone: formValue.phone,
        address_attributes: formValue.address
      }
    };
    this.userInfoService.saveUserInfo(payload).subscribe({
      next: () => {
        alert('Informazioni salvate con successo!');
        this.router.navigate(['/profile']);
      },
      error: () => alert('Errore nel salvataggio delle informazioni.')
    });
  }
}
