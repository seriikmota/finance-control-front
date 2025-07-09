import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../model/category.model';
import {environment} from '../../../../environments/environment';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = environment.apiUrl + 'category';

  constructor(private http: HttpClient) {}

  search(page: number = 1, limit: number = 10, name?: string, type?: number, active?: boolean): Observable<PaginationResult<Category>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (type !== undefined && type !== null) {
      params = params.set('type', type.toString());
    }
    if (active !== undefined && active !== null) {
      params = params.set('active', active);
    }
    return this.http.get<PaginationResult<Category>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number) {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  create(category: Category) {
    return this.http.post<Category>(this.baseUrl, category);
  }

  update(category: Category) {
    return this.http.put<Category>(`${this.baseUrl}/${category.id}`, category);
  }

  patch(id: number, updates: Partial<Category>) {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, updates);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
