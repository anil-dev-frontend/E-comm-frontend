import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Customerservice {
  
private http = inject(HttpClient);
 
  private baseUrl = `${environment.apiUrl}/home`;

  constructor() {}

  getHomeNewProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/new-product`);
  }
  
  getHomeFeaturedProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/featured-products`);
  }
}
