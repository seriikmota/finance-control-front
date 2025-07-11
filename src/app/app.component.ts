import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopbarComponent} from './layout/topbar.component';
import {SidebarComponent} from './layout/sidebar.component';
import {FooterComponent} from './layout/footer.component';
import {NgClass} from '@angular/common';
import {LayoutService} from './layout/layout.service';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {LoadingComponent} from './core/components/loading.component';
import {PrimeNG} from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    NgClass,
    Toast,
    ConfirmDialog,
    LoadingComponent
  ],
  template: `
    <div class="layout-wrapper" [ngClass]="containerClass">
      <app-topbar></app-topbar>
      <app-sidebar></app-sidebar>
      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
      <div class="layout-mask animate-fadein"></div>
    </div>
    <p-toast/>
    <p-confirmDialog/>
    <app-loading/>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private configPrimeNG = inject(PrimeNG);

  ngOnInit() {
    this.configPrimeNG.setTranslation({
      apply: 'Aplicar',
      clear: 'Limpar',
      accept: 'Sim',
      reject: 'Não',
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      dateFormat: 'dd/mm/yy',
    });
  }

  get containerClass() {
    return {
      'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
      'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
      'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
      'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
      'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
    };
  }
}
