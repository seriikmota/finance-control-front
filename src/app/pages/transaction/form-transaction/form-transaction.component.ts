import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NotificationService} from '../../../shared/services/notification.service';
import {Dialog} from 'primeng/dialog';
import {InputNumber} from 'primeng/inputnumber';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {TransactionService} from '../service/transaction.service';
import {RecurrenceTypes, Transaction, TransactionTypes} from '../model/transaction.model';
import {Select} from 'primeng/select';
import {CategoryTypes} from '../../category/model/category.model';
import {DatePicker} from 'primeng/datepicker';
import {Checkbox} from 'primeng/checkbox';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Textarea} from 'primeng/textarea';
import {CategoryService} from '../../category/service/category.service';
import {BankAccountService} from '../../bank-account/service/bank-account.service';
import {PaymentMethodService} from '../../payment-method/service/payment-method.service';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-form-transaction',
  imports: [
    Dialog,
    ReactiveFormsModule,
    InputNumber,
    Button,
    InputText,
    Select,
    DatePicker,
    Checkbox,
    AutoComplete,
    Textarea,
    FloatLabel
  ],
  templateUrl: './form-transaction.component.html',
  styleUrl: './form-transaction.component.scss'
})
export class FormTransactionComponent {
  @Input() visible = false;
  @Input() title = 'Transação';
  @Input() transaction: Transaction | null = null;

  @Output() onClose = new EventEmitter<boolean>();

  form: FormGroup;
  isEditing = false;


  listCat: any[] = [];
  listFilterCat: any[] = [];

  listBan: any[] = [];
  listFilterBan: any[] = [];

  listPay: any[] = [];
  listFilterPay: any[] = [];

  constructor(private fb: FormBuilder,
              private transactionService: TransactionService,
              private notificationService: NotificationService,
              private categoryService: CategoryService,
              private bankAccountService: BankAccountService,
              private paymentMethodService: PaymentMethodService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      type: [null, Validators.required],
      value: [null, [Validators.required, Validators.min(0)]],
      date: [null, Validators.required],
      isRecurring: [false],
      recurrenceType: [],
      location: [''],
      notes: [''],
      category: [null, Validators.required],
      bankAccount: [null, Validators.required],
      paymentMethod: [null, Validators.required],
    });
  }

  ngOnChanges() {
    if (this.transaction && this.transaction.id) {
      this.isEditing = true;
      this.transactionService.getById(this.transaction.id).subscribe(res => {
        this.transaction = res;
        this.form.patchValue(this.transaction);
        this.loadCategories()
        this.loadBankAccount()
        this.loadPaymentMethods()
      })
    } else {
      this.isEditing = false;
      this.form.reset({ active: true });
      this.loadCategories()
      this.loadBankAccount()
      this.loadPaymentMethods()
    }
  }

  submit() {
    if (this.form.valid) {
      let transaction = this.form.value as Transaction;

      if (transaction.id) {
        this.transactionService.update(transaction).subscribe(
          res => {
            this.notificationService.showSuccess('Transação editada com sucesso!');
            this.onClose.emit(true);
            this.form.reset({ active: true });
          }
        )
      } else {
        this.transactionService.create(transaction).subscribe(
          res => {
            this.notificationService.showSuccess('Transação criada com sucesso!');
            this.onClose.emit(true);
            this.form.reset({ active: true });
          }
        )
      }
    }
  }

  close() {
    this.onClose.emit(false);
  }

  loadCategories() {
    this.categoryService.search(1, 1000, undefined, this.form.get('type')?.value, true).subscribe(res => {
      this.listCat = res.data;
    })
  }

  loadBankAccount() {
    this.bankAccountService.search(1, 1000, undefined, true).subscribe(res => {
      this.listBan = res.data;
    })
  }

  loadPaymentMethods() {
    this.paymentMethodService.search(1, 1000, undefined, true).subscribe(res => {
      this.listPay = res.data;
    })
  }

  filterCat(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.listCat as any[]).length; i++) {
      const category = (this.listCat as any[])[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }

    this.listFilterCat = filtered;
  }

  filterBan(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.listBan as any[]).length; i++) {
      const bank = (this.listBan as any[])[i];
      if (bank.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(bank);
      }
    }

    this.listFilterBan = filtered;
  }

  filterPay(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.listPay as any[]).length; i++) {
      const payment = (this.listPay as any[])[i];
      if (payment.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(payment);
      }
    }

    this.listFilterPay = filtered;
  }

  protected readonly CategoryTypes = CategoryTypes;
  protected readonly TransactionTypes = TransactionTypes;
  protected readonly RecurrenceTypes = RecurrenceTypes;
}
