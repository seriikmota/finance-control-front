import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {BankAccount} from '../model/bank-account.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = environment.apiUrl + 'bank-account';

  constructor(private http: HttpClient) {}

  search(page: number = 1, limit: number = 10, name?: string, active?: boolean): Observable<PaginationResult<BankAccount>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (active !== undefined && active !== null) {
      params = params.set('active', active);
    }
    return this.http.get<PaginationResult<BankAccount>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number) {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  create(bankAccount: BankAccount) {
    return this.http.post<BankAccount>(this.baseUrl, bankAccount);
  }

  update(bankAccount: BankAccount) {
    return this.http.put<BankAccount>(`${this.baseUrl}/${bankAccount.id}`, bankAccount);
  }

  patch(id: number, updates: Partial<BankAccount>) {
    return this.http.patch<BankAccount>(`${this.baseUrl}/${id}`, updates);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
