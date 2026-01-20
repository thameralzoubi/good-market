import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // استيراد ملف البيئة

export interface ApiCategory {
  slug: string;
  name: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // الآن رابط الـ API جاي من ملف environment
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiCategory[]> {
    return this.http.get<ApiCategory[]>(this.apiUrl);
  }
}
