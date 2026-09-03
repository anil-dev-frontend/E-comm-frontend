import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
private baseUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, productData);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Search + Filter + Pagination
  getProductList(
    searchTerm: string = '',
    categoryId: string = '',
    brandId: string = '',
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {

    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('categoryId', categoryId)
      .set('brandId', brandId)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(
      `${this.baseUrl}/list`,
      { params }
    );
  }
  
}
