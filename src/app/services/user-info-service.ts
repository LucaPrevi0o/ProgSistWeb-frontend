import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Address {
  street: string;
  number: string;
  city: string;
  zip: string;
  province: string;
}

export interface UserInfo {
  last_name: string;
  first_name: string;
  phone: string;
  address: Address;
}

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private apiUrl = `${environment.apiUrl}/user_info`;
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);

  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<UserInfo | null> {
    // Se già presente, restituisci il valore
    if (this.userInfoSubject.value) {
      return of(this.userInfoSubject.value);
    }
    // Altrimenti fai la richiesta e aggiorna la cache
    return this.http.get<UserInfo>(this.apiUrl).pipe(
      tap(info => this.userInfoSubject.next(info)),
      catchError(() => {
        this.userInfoSubject.next(null);
        return of(null);
      })
    );
  }

  // Metodo per forzare l’aggiornamento (es. dopo login)
  refreshUserInfo(): Observable<UserInfo | null> {
    return this.http.get<UserInfo>(this.apiUrl).pipe(
      tap(info => this.userInfoSubject.next(info)),
      catchError(() => {
        this.userInfoSubject.next(null);
        return of(null);
      })
    );
  }

  userInfo$(): Observable<UserInfo | null> {
    return this.userInfoSubject.asObservable();
  }

  updateUserInfo(data: Partial<UserInfo>): Observable<UserInfo> {
    return this.http.patch<UserInfo>(this.apiUrl, data);
  }

  saveUserInfo(data: any): Observable<any> {
    return this.http.patch(this.apiUrl, data); // o .post se è una creazione
  }
}