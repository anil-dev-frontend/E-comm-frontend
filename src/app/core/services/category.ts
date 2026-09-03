import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Category {

  private baseUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  // 1. Get All Categories (GET)
  getCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getCustomerCategories(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/home/categories`);
}
  

  // 2. Create Category (POST)
  createCategory(categoryData: { name: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, categoryData);
  }

  // 3. Update Category (PUT)
  updateCategory(id: string, categoryData: { name: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, categoryData);
  }

  // 4. Delete Category (DELETE)
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
  

