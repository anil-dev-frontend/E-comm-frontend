import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Token localStorage se lo
  const token = localStorage.getItem('token');

  // Token available hai to request me attach karo
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      console.log('API Error:', error);

      // 401 = token missing / invalid / expired
      if (error.status === 401) {

        localStorage.removeItem('token');

        alert(
          error.error?.message ||
          'Session expired, please login again'
        );

        router.navigate(['/login']);
      }

      // 403 = permission nahi hai
      else if (error.status === 403) {

        alert(
          error.error?.message ||
          'You are not authorized'
        );
      }

      // 400 = Bad Request
      else if (error.status === 400) {

        console.log(
          error.error?.message ||
          'Bad request'
        );
      }

      // 500 = Server Error
      else if (error.status === 500) {

        alert('Server error. Please try again later.');
      }

      // Internet / server connection problem
      else if (error.status === 0) {

        alert('Unable to connect to server.');
      }

      return throwError(() => error);
    })
  );
};