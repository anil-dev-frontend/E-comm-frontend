import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Wishlist {
  
private baseUrl = `${environment.apiUrl}/wishlist`;

wishList:any = [];

  constructor(private http: HttpClient) {}

  // Get user's wishlist
  getWishlist(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  // Add product to wishlist
  addToWishlist(productId: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/add`,
      { productId }
    );
  }

  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/${productId}`
    );
  }

  init(): void {
  this.getWishlist().subscribe({
    next: (result) => {
      console.log('Wishlist API response:', result);

      this.wishList = result.data;

      console.log('Wishlist products:', this.wishList);
    },
    error: (error) => {
      console.error('Wishlist error:', error);
      this.wishList = [];
    }
  });
}
}
