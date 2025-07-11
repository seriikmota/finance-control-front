import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {Transaction} from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = environment.apiUrl + 'transaction';

  constructor(private http: HttpClient) { }

  search(page: number = 1, limit: number = 10, name?: string): Observable<PaginationResult<Transaction>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<PaginationResult<Transaction>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number) {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  create(transaction: Transaction) {
    return this.http.post<Transaction>(this.baseUrl, transaction);
  }

  update(transaction: Transaction) {
    return this.http.put<Transaction>(`${this.baseUrl}/${transaction.id}`, transaction);
  }

  patch(id: number, updates: Partial<Transaction>) {
    return this.http.patch<Transaction>(`${this.baseUrl}/${id}`, updates);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
