import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {NotificationService} from '../../../shared/services/notification.service';
import {BankAccountService} from '../service/bank-account.service';
import {BankAccount} from '../model/bank-account.model';
import {NgIf} from '@angular/common';
import {InputNumber} from 'primeng/inputnumber';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-form-bank-account',
  imports: [
    Button,
    Dialog,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    ToggleSwitch,
    NgIf,
    InputNumber,
    InputGroup,
    InputGroupAddon
  ],
  templateUrl: './form-bank-account.component.html',
  styleUrl: './form-bank-account.component.scss'
})
export class FormBankAccountComponent {
  @Input() visible = false;
  @Input() title = 'Conta Bancária';
  @Input() bankAccount: BankAccount | null = null;

  @Output() onClose = new EventEmitter<boolean>();

  form: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder,
              private bankAccountService: BankAccountService,
              private notificationService: NotificationService) {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      initialBalance: [null, Validators.required],
      active: [true, Validators.required],
    });
  }

  ngOnChanges() {
    if (this.bankAccount && this.bankAccount.id) {
      this.isEditing = true;
      this.bankAccountService.getById(this.bankAccount.id).subscribe(res => {
        this.bankAccount = res;
        this.form.patchValue(this.bankAccount);
      })
    } else {
      this.isEditing = false;
      this.form.reset({ active: true });
    }
  }

  submit() {
    if (this.form.valid) {
      let bankAccount = this.form.value as BankAccount;

      if (bankAccount.id) {
        this.bankAccountService.update(bankAccount).subscribe(
          res => {
            this.notificationService.showSuccess('Conta Bancária editada com sucesso!');
            this.onClose.emit(true);
            this.form.reset({ active: true });
          }
        )
      } else {
        this.bankAccountService.create(bankAccount).subscribe(
          res => {
            this.notificationService.showSuccess('Conta Bancária criada com sucesso!');
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
}
