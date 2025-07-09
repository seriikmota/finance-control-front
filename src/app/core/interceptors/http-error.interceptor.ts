import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, tap, throwError } from 'rxjs';
import {NotificationService} from '../../shared/services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(response => {
      const body = (response as any)?.body;
      if (body) {
        displayMessages(body.warnings, 'warn', 'Aviso');
        displayMessages(body.infos, 'info', 'Informação');
      }
    }),
    catchError((error) => {
      console.log('error', error);

      const apiError = error?.errors;

      if (apiError) {
        displayMessages(apiError.errors, 'error', 'Erro');
        displayMessages(apiError.warnings, 'warn', 'Aviso');
        displayMessages(apiError.infos, 'info', 'Informação');
      } else {
        notificationService.add({
          severity: 'error',
          summary: 'Ops...',
          detail: 'Ocorreu um erro inesperado. Tente novamente mais tarde ou contacte o suporte.',
        });
      }

      return throwError(() => error);
    })
  );

  function displayMessages(
    messages: string[] | undefined,
    severity: 'error' | 'warn' | 'info',
    summary: string
  ) {
    if (Array.isArray(messages)) {
      messages.forEach(msg =>
        notificationService.add({ severity, summary, detail: msg })
      );
    }
  }
};
