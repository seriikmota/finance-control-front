import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categorias', loadComponent: () => import('./pages/category/list-category/list-category.component').then(m => m.ListCategoryComponent) },
  { path: 'contas-bancarias', loadComponent: () => import('./pages/bank-account/list-bank-account/list-bank-account.component').then(m => m.ListBankAccountComponent) },
  { path: 'metodos-pagamentos', loadComponent: () => import('./pages/payment-method/list-payment-method/list-payment-method.component').then(m => m.ListPaymentMethodComponent) },
  { path: 'transacoes', loadComponent: () => import('./pages/transaction/list-transaction/list-transaction.component').then(m => m.ListTransactionComponent) },
];
