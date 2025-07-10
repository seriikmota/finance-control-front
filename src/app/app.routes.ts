import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categorias', loadComponent: () => import('./pages/category/list-category/list-category.component').then(m => m.ListCategoryComponent) },
  { path: 'contas-bancarias', loadComponent: () => import('./pages/bank-account/list-bank-account/list-bank-account.component').then(m => m.ListBankAccountComponent) }
];
