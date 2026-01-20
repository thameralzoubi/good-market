import { Injectable } from '@angular/core';
import { ProductM } from '../models/product.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductM[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res.products));
  }

  getProductById(id: number): Observable<ProductM> {
    return this.http.get<ProductM>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<ProductM[]> {
    return this.http
      .get<any>(`${this.apiUrl}/category/${category}`)
      .pipe(map((res) => res.products));
  }
}
