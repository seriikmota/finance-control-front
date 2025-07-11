import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {NotificationService} from '../../../shared/services/notification.service';
import {PaymentMethodService} from '../service/payment-method.service';
import {PaymentMethod} from '../model/payment-method.model';

@Component({
  selector: 'app-form-payment-method',
  imports: [
    Button,
    Dialog,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    InputText,
    NgIf,
    ReactiveFormsModule,
    ToggleSwitch
  ],
  templateUrl: './form-payment-method.component.html',
  styleUrl: './form-payment-method.component.scss'
})
export class FormPaymentMethodComponent {
  @Input() visible = false;
  @Input() title = 'Forma de Pagamento';
  @Input() paymentMethod: PaymentMethod | null = null;

  @Output() onClose = new EventEmitter<boolean>();

  form: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder,
              private paymentMethodService: PaymentMethodService,
              private notificationService: NotificationService) {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      initialBalance: [null, Validators.required],
      active: [true, Validators.required],
    });
  }

  ngOnChanges() {
    if (this.paymentMethod && this.paymentMethod.id) {
      this.isEditing = true;
      this.paymentMethodService.getById(this.paymentMethod.id).subscribe(res => {
        this.paymentMethod = res;
        this.form.patchValue(this.paymentMethod);
      })
    } else {
      this.isEditing = false;
      this.form.reset({ active: true });
    }
  }

  submit() {
    if (this.form.valid) {
      let paymentMethod = this.form.value as PaymentMethod;

      if (paymentMethod.id) {
        this.paymentMethodService.update(paymentMethod).subscribe(
          res => {
            this.notificationService.showSuccess('Conta Bancária editada com sucesso!');
            this.onClose.emit(true);
            this.form.reset({ active: true });
          }
        )
      } else {
        this.paymentMethodService.create(paymentMethod).subscribe(
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
