import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductM } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class Search {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** بحث عام */
  search(term: string): Observable<ProductM[]> {
    if (!term.trim()) {
      return this.http.get<any>(this.apiUrl).pipe(map((res) => res.products));
    }

    return this.http.get<any>(`${this.apiUrl}/search?q=${term}`).pipe(map((res) => res.products));
  }
}
