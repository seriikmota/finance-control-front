import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'categorias', loadComponent: () => import('./pages/category/list-category/list-category.component').then(m => m.ListCategoryComponent) }
  // { path: 'metodos-pagamento', loadComponent: () => import('./pages/metodos/metodo-list.component').then(m => m.MetodoListComponent) },
  // { path: 'transacoes', loadComponent: () => import('./pages/transacoes/transacao-list.component').then(m => m.TransacaoListComponent) },
];
