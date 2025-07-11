import { Component } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {MenuItem} from 'primeng/api';
import {MenuItemComponent} from './menuitem.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgIf,
    NgFor,
    MenuItemComponent
  ],
  template: `
    <div class="layout-sidebar">
      <ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
          <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
          <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
      </ul>
    </div>
  `
})
export class SidebarComponent {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
      },
      {
        label: 'Cadastros',
        items: [
          { label: 'Categoria', icon: 'pi pi-fw pi-id-card', routerLink: ['/categorias'] },
          { label: 'Conta Bancária', icon: 'pi pi-fw pi-check-square', routerLink: ['/contas-bancarias'] },
          { label: 'Metodo de Pagamento', icon: 'pi pi-fw pi-mobile', routerLink: ['/metodos-pagamentos'] }
        ]
      },
      {
        label: 'Painel',
        items: [
          { label: 'Transações', icon: 'pi pi-fw pi-id-card', routerLink: ['/transacoes'] },
          { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/relatorios'] },
        ]
      },
    ];
  }
}
