import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TopbarComponent} from './layout/topbar.component';
import {SidebarComponent} from './layout/sidebar.component';
import {FooterComponent} from './layout/footer.component';
import {NgClass} from '@angular/common';
import {LayoutService} from './layout/layout.service';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    NgClass,
    Toast,
    ConfirmDialog
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
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private layoutService = inject(LayoutService)

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
