import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product';
import { ProductCreateRequest } from '../models/product-create-request';
import { ProductListResponse } from '../models/product-list-response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(page: number = 1, pageSize: number = 10, search: string = ''): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  create(data: ProductCreateRequest): Observable<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('active', data.active.toString());
    
    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.post<Product>(`${this.apiUrl}/products`, formData);
  }

  update(id: string, data: ProductCreateRequest): Observable<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('active', data.active.toString());
    
    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  toggleActive(id: string, active: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, { active });
  }
}