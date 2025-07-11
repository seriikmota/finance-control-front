import {Component, signal, WritableSignal} from '@angular/core';
import {DefaultTableComponent} from '../../../core/components/default-table.component';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {FormBankAccountComponent} from '../form-bank-account/form-bank-account.component';
import {BaseEnum} from '../../../core/interfaces/enum.type';
import {NotificationService} from '../../../shared/services/notification.service';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {finalize, from, mergeMap, tap} from 'rxjs';
import {BankAccount} from '../model/bank-account.model';
import {BankAccountService} from '../service/bank-account.service';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-list-bank-account',
  imports: [
    DefaultTableComponent,
    ToggleSwitch,
    FormsModule,
    Button,
    ReactiveFormsModule,
    Select,
    FormBankAccountComponent,
    InputText
  ],
  templateUrl: './list-bank-account.component.html',
  styleUrl: './list-bank-account.component.scss'
})
export class ListBankAccountComponent {
  selectedItems: BankAccount[] = [];
  modalFormVisible = false;
  editingObj: BankAccount | null = null;

  data: WritableSignal<BankAccount[]> = signal([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);

  form: FormGroup;

  cols = [
    { field: 'name', header: 'Nome', sortable: true },
    { field: 'currentBalance', header: 'Saldo Atual', sortable: true },
    { field: 'active', header: 'Ativo', sortable: true }
  ];

  activeOptions: BaseEnum[] = [
    { label: 'Todos', value: null },
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  constructor(private bankAccountService: BankAccountService,
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
    this.bankAccountService.search(this.page(), this.limit(), filter?.name, filter?.active)
      .subscribe((res: PaginationResult<BankAccount>) => {
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

  onEdit(bankAccount: BankAccount) {
    this.editingObj = bankAccount;
    this.modalFormVisible = true;
  }

  closeModalForm(refresh: boolean = false) {
    this.modalFormVisible = false;
    this.editingObj = null;
    if (refresh) {
      this.search()
    }
  }

  onDelete(bankAccount: BankAccount) {
    this.notificationService.showConfirmation(
      `Deseja realmente excluir a categoria "${bankAccount.name}"?`,
      () => {
        this.bankAccountService.delete(bankAccount.id).subscribe(() => {
          this.notificationService.showSuccess(`Categoria "${bankAccount.name}" excluida com sucesso.`)
          this.search();
        })
      }
    )
  }

  onDeleteSelected() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showInfo('Nenhuma categoria selecionada para exclusão.');
      return;
    }

    this.notificationService.showConfirmation(
      'Deseja realmente excluir as categorias selecionadas?',
      () => {
        from(this.selectedItems)
          .pipe(
            mergeMap(bankAccount =>
              this.bankAccountService.delete(bankAccount.id).pipe(
                tap(() =>
                  this.notificationService.showSuccess(`Categoria "${bankAccount.name}" excluída com sucesso.`)
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

  toggleActive(bankAccount: BankAccount) {
    this.bankAccountService.patch(bankAccount.id, { active: bankAccount.active}).subscribe({
      next: (res: any) => {
        if (res.active) {
          this.notificationService.showSuccess('Conta Bancária e formas de pagamento associadas foram desativadas ativadas com sucesso');
        } else {
          this.notificationService.showSuccess('Conta Bancária e formas de pagamento associadas foram desativadas desativadas com sucesso');
        }
      },
      error: (err: any) => {
        bankAccount.active = !bankAccount.active;
      }
    })
  }
}
