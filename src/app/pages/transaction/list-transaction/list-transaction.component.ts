import {Component, signal, WritableSignal} from '@angular/core';
import {DefaultTableComponent} from '../../../core/components/default-table.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BaseEnum} from '../../../core/interfaces/enum.type';
import {NotificationService} from '../../../shared/services/notification.service';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {finalize, from, mergeMap, tap} from 'rxjs';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {FormTransactionComponent} from '../form-transaction/form-transaction.component';
import {TransactionService} from '../service/transaction.service';
import {Transaction} from '../model/transaction.model';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-list-transaction',
  imports: [
    DefaultTableComponent,
    FormsModule,
    Button,
    ReactiveFormsModule,
    Select,
    FormTransactionComponent,
    InputText
  ],
  templateUrl: './list-transaction.component.html',
  styleUrl: './list-transaction.component.scss'
})
export class ListTransactionComponent {
  selectedItems: Transaction[] = [];
  modalFormVisible = false;
  editingObj: Transaction | null = null;

  data: WritableSignal<Transaction[]> = signal([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);

  form: FormGroup;

  cols = [
    { field: 'title', header: 'Título', sortable: true },
  ];

  activeOptions: BaseEnum[] = [
    { label: 'Todos', value: null },
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  constructor(private transactionService: TransactionService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: [''],
      active: [true],
    });
  }

  onLazyLoad(event: any) {
    this.page.set(event.first / event.rows + 1);
    this.limit.set(event.rows);
    this.search();
  }

  search() {
    const filter = this.form.value;
    this.transactionService.search(this.page(), this.limit(), filter?.title)
      .subscribe((res: PaginationResult<Transaction>) => {
        this.data.set(res.data);
        this.total.set(res.total);
      });
  }

  clear() {
    this.form.reset();
  }

  onAdd() {
    this.editingObj = null;
    this.modalFormVisible = true;
  }

  onEdit(transaction: Transaction) {
    this.editingObj = transaction;
    this.modalFormVisible = true;
  }

  closeModalForm(refresh: boolean = false) {
    this.modalFormVisible = false;
    this.editingObj = null;
    if (refresh) {
      this.search()
    }
  }

  onDelete(transaction: Transaction) {
    this.notificationService.showConfirmation(
      `Deseja realmente excluir a transação "${transaction.title}"?`,
      () => {
        this.transactionService.delete(transaction.id).subscribe(() => {
          this.notificationService.showSuccess(`Transação "${transaction.title}" excluida com sucesso.`)
          this.search();
        })
      }
    )
  }

  onDeleteSelected() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showInfo('Nenhuma transação selecionada para exclusão.');
      return;
    }

    this.notificationService.showConfirmation(
      'Deseja realmente excluir as transações selecionadas?',
      () => {
        from(this.selectedItems)
          .pipe(
            mergeMap(transaction =>
              this.transactionService.delete(transaction.id).pipe(
                tap(() =>
                  this.notificationService.showSuccess(`Transação "${transaction.title}" excluída com sucesso.`)
                )
              )
            ),
            finalize(() => {
              this.selectedItems = [];
              this.search();
            })
          )
          .subscribe();
      }
    );
  }

}
