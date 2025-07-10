import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {LoadingService} from '../../shared/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="visible()" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="text-white text-xl animate-pulse">Carregando...</div>
    </div>
  `
})
export class LoadingComponent {
  private service = inject(LoadingService);
  visible = computed(() => this.service.loading());
}
