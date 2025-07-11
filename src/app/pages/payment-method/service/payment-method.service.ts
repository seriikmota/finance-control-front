import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {PaymentMethod} from '../model/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private baseUrl = environment.apiUrl + 'payment-method';

  constructor(private http: HttpClient) {}

  search(page: number = 1, limit: number = 10, name?: string, active?: boolean): Observable<PaginationResult<PaymentMethod>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (active !== undefined && active !== null) {
      params = params.set('active', active);
    }
    return this.http.get<PaginationResult<PaymentMethod>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: number) {
    return this.http.get<PaymentMethod>(`${this.baseUrl}/${id}`);
  }

  create(paymentMethod: PaymentMethod) {
    return this.http.post<PaymentMethod>(this.baseUrl, paymentMethod);
  }

  update(paymentMethod: PaymentMethod) {
    return this.http.put<PaymentMethod>(`${this.baseUrl}/${paymentMethod.id}`, paymentMethod);
  }

  patch(id: number, updates: Partial<PaymentMethod>) {
    return this.http.patch<PaymentMethod>(`${this.baseUrl}/${id}`, updates);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
