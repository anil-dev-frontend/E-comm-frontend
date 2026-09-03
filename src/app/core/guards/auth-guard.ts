import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Authservice } from '../services/authservice';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(Authservice);
  const router = inject(Router);

  // Login check
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Admin check
  const isAdmin = authService.checkIsAdmin();

  if (isAdmin) {
    return true;
  }

  // Normal user hai
  router.navigate(['/']);
  return false;
};