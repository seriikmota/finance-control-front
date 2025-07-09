import { Injectable } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private confirmService: ConfirmationService,
              private messageService: MessageService,
              ) { }

  showConfirmation(message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.confirmService.confirm({
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      message: message,
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: onConfirm,
      reject: onCancel,
    });
  }

  add(param: {severity: string; summary: string; detail: string}) {
    this.messageService.add({
      severity: param.severity,
      summary: param.summary,
      detail: param.detail,
      life: 3000
    });
  }

  showSuccess(message: string): void {
    this.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
    });
  }

  showError(message: string): void {
    this.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
    });
  }

  showInfo(message: string): void {
    this.add({
      severity: 'info',
      summary: 'Informação',
      detail: message,
    });
  }

  showWarning(message: string): void {
    this.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: message,
    });
  }
}
