import {Component, EventEmitter, Input, Output, Signal, TemplateRef, ViewChild} from '@angular/core';
import {TableModule} from 'primeng/table';
import {NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-default-table',
  imports: [
    TableModule,
    NgTemplateOutlet,
    NgFor,
    NgIf,
    NgClass
  ],
  template: `
    <ng-template #topButtonsDefault/>
    <ng-template #filtersDefault/>
    <ng-template #actionsDefault let-row/>

    <p-table
      [value]="data()"
      [paginator]="true"
      [lazy]="lazy"
      [rows]="rows"
      [first]="(page - 1) * rows"
      [totalRecords]="totalRecords"
      [rowHover]="true"
      [tableStyle]="{ 'min-width': '75rem' }"
      [rowsPerPageOptions]="[10, 20, 30]"
      [(selection)]="selectedRows"
      (selectionChange)="onSelectionChange($event)"
      (onLazyLoad)="onLazyLoad.emit($event)"
      dataKey="id"
      currentPageReportTemplate="Exibindo {first} à {last} de {totalRecords} registros"
    >

      <ng-template #caption>
        <div class="flex items-center justify-between p-3">
          <h3 class="m-0">{{ title }}</h3>

          <div class="flex flex-wrap gap-3">
            <ng-container [ngTemplateOutlet]="topButtonsTemplate || topButtonsDefault"/>
          </div>
        </div>

        <div class="p-3 mb-6">
          <ng-container [ngTemplateOutlet]="filterTemplate || filtersDefault"/>
        </div>
      </ng-template>

      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox/>
          </th>
          <th *ngFor="let col of columns" [pSortableColumn]="col.sortable ? col.field : ''">{{ col.header }} <p-sortIcon *ngIf="col.sortable" [field]="col.field" />
          <th *ngIf="actionsTemplate" style="width: 6rem">Ações</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-row>
        <tr (click)="onRowClick.emit(row)" [ngClass]="{ 'cursor-pointer' : hasRowClick() }">
          <td><p-tableCheckbox [value]="row" /></td>
          <ng-container *ngTemplateOutlet="rowTemplate; context: { $implicit: row }"/>
          <td *ngIf="actionsTemplate" class="w-[300px]">
            <div class="flex gap-1 items-center">
              <ng-container [ngTemplateOutlet]="actionsTemplate || actionsDefault" [ngTemplateOutletContext]="{ $implicit: row }"/>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class DefaultTableComponent<T extends { id: any }> {
  @Input() title!: string;
  @Input() data!: Signal<T[]>;
  @Input() columns!: { field: string; header: string; sortable?: boolean }[];
  @Input() rowTemplate!: TemplateRef<any>;

  @Input() topButtonsTemplate?: TemplateRef<any>;
  @Input() filterTemplate?: TemplateRef<any>;
  @Input() actionsTemplate?: TemplateRef<any>;

  @Input() lazy = false;
  @Input() totalRecords = 0;
  @Input() rows = 10;
  @Input() page = 1;

  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() onRowClick = new EventEmitter<T>();

  selectedRows: T[] = [];

  onSelectionChange(rows: T[]) {
    this.selectionChange.emit(rows);
  }

  hasRowClick(): boolean {
    return this.onRowClick.observed
  }
}
