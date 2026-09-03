import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  
private baseUrl = `${environment.apiUrl}/auth`;

  // Login status
  private loggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );

  isLoggedIn$ = this.loggedInSubject.asObservable();

  // User name
  private userNameSubject = new BehaviorSubject<string>(
    this.getUserNameFromStorage()
  );

  userName$ = this.userNameSubject.asObservable();

  // Admin status
  private adminSubject = new BehaviorSubject<boolean>(
    this.getAdminFromStorage()
  );

  isAdmin$ = this.adminSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/signup`,
      data
    );
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      data
    );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/forget-password`,
      { email }
    );
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

  // Login ke baad call hoga
  setLogin(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.loggedInSubject.next(true);

    this.userNameSubject.next(
      user?.name || ''
    );

    this.adminSubject.next(
      user?.isAdmin === true
    );
  }

  // Check admin
  checkIsAdmin(): boolean {
    const user = localStorage.getItem('user');

    if (!user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);

      return userData?.isAdmin === true;
    } catch (error) {
      return false;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.loggedInSubject.next(false);
    this.userNameSubject.next('');
    this.adminSubject.next(false);
  }

  // Page reload ke baad user name nikalne ke liye
  private getUserNameFromStorage(): string {
    const user = localStorage.getItem('user');

    if (!user) {
      return '';
    }

    try {
      const userData = JSON.parse(user);

      return userData?.name || '';
    } catch (error) {
      return '';
    }
  }

  // Page reload ke baad admin status nikalne ke liye
  private getAdminFromStorage(): boolean {
    const user = localStorage.getItem('user');

    if (!user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);

      return userData?.isAdmin === true;
    } catch (error) {
      return false;
    }
  }
}