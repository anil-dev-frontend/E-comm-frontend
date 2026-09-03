import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Brands } from '../types/brand';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Brand {
  private baseUrl = `${environment.apiUrl}/brand`;

  constructor(private http: HttpClient) {}


  getBrands(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  createBrand(brandData: Brands): Observable<any> {
    return this.http.post<any>(this.baseUrl, brandData);
  }

  updateBrand(id: string, brandData: Brands): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, brandData);
  }

  deleteBrand(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getCustomerBrands(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/home/brands`
    );
  }
}
