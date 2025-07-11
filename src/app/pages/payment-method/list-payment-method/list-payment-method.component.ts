import {Component, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DefaultTableComponent} from '../../../core/components/default-table.component';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {BaseEnum} from '../../../core/interfaces/enum.type';
import {NotificationService} from '../../../shared/services/notification.service';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {finalize, from, mergeMap, tap} from 'rxjs';
import {PaymentMethod, PaymentTypes} from '../model/payment-method.model';
import {PaymentMethodService} from '../service/payment-method.service';
import {FormPaymentMethodComponent} from '../form-payment-method/form-payment-method.component';

@Component({
  selector: 'app-list-payment-method',
  imports: [
    Button,
    DefaultTableComponent,
    InputText,
    ReactiveFormsModule,
    Select,
    ToggleSwitch,
    FormsModule,
    FormPaymentMethodComponent
  ],
  templateUrl: './list-payment-method.component.html',
  styleUrl: './list-payment-method.component.scss'
})
export class ListPaymentMethodComponent {
  selectedItems: PaymentMethod[] = [];
  modalFormVisible = false;
  editingObj: PaymentMethod | null = null;

  data: WritableSignal<PaymentMethod[]> = signal([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);

  form: FormGroup;

  cols = [
    { field: 'name', header: 'Nome', sortable: true },
    { field: 'type', header: 'Tipo', sortable: true },
    { field: 'bankAcccountName', header: 'Conta Bancária', sortable: true },
    { field: 'active', header: 'Ativo', sortable: true }
  ];

  activeOptions: BaseEnum[] = [
    { label: 'Todos', value: null },
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  constructor(private paymentMethodService: PaymentMethodService,
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
    this.paymentMethodService.search(this.page(), this.limit(), filter?.name, filter?.active)
      .subscribe((res: PaginationResult<PaymentMethod>) => {
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

  onEdit(paymentMethod: PaymentMethod) {
    this.editingObj = paymentMethod;
    this.modalFormVisible = true;
  }

  closeModalForm(refresh: boolean = false) {
    this.modalFormVisible = false;
    this.editingObj = null;
    if (refresh) {
      this.search()
    }
  }

  onDelete(paymentMethod: PaymentMethod) {
    this.notificationService.showConfirmation(
      `Deseja realmente excluir a forma de pagamento "${paymentMethod.name}"?`,
      () => {
        this.paymentMethodService.delete(paymentMethod.id).subscribe(() => {
          this.notificationService.showSuccess(`Forma de pagamento "${paymentMethod.name}" excluida com sucesso.`)
          this.search();
        })
      }
    )
  }

  onDeleteSelected() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showInfo('Nenhuma forma de pagamento selecionada para exclusão.');
      return;
    }

    this.notificationService.showConfirmation(
      'Deseja realmente excluir as categorias selecionadas?',
      () => {
        from(this.selectedItems)
          .pipe(
            mergeMap(paymentMethod =>
              this.paymentMethodService.delete(paymentMethod.id).pipe(
                tap(() =>
                  this.notificationService.showSuccess(`Forma de pagamento "${paymentMethod.name}" excluída com sucesso.`)
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

  toggleActive(paymentMethod: PaymentMethod) {
    this.paymentMethodService.patch(paymentMethod.id, { active: paymentMethod.active}).subscribe({
      next: (res: any) => {
        if (res.active) {
          this.notificationService.showSuccess('Forma de Pagamento foi ativada com sucesso');
        } else {
          this.notificationService.showSuccess('Forma de Pagamento foi desativada com sucesso');
        }
      },
      error: (err: any) => {
        paymentMethod.active = !paymentMethod.active;
      }
    })
  }

  getPaymentTypeLabel(value: number): string {
    const found = PaymentTypes.find(payType => payType.value === value);
    return found ? found.label : '';
  }

}
