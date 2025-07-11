import {Injectable, signal} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading = signal(false);
  private _count = 0;

  show() {
    this._count++;
    this.loading.set(true);
  }

  hide() {
    this._count = Math.max(this._count - 1, 0);
    if (this._count === 0) this.loading.set(false);
  }
}
