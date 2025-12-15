import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      alert(`Errore HTTP: ${error.status} - ${error.message}`);
      if (error.status === 401) {
        alert('Sessione scaduta. Effettua di nuovo il login.');
        router.navigate(['/login']);
      } else if (error.status === 500) {
        alert('Errore interno del server. Riprova più tardi.');
      } else if (error.status === 0) {
        alert('Impossibile connettersi al server.');
      }
      return throwError(() => error);
    })
  );
};