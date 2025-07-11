import {BaseEnum} from '../../../core/interfaces/enum.type';

export interface Transaction {
  id: number
  title: string
  type: number
  value: number
  date: Date
  isRecurring: boolean
  recurrenceType: number
  location?: string
  notes?: string
  categoryId: number
  categoryName: string
  bankAccountId: number
  paymentMethodId: number
}

export const TransactionTypes: BaseEnum[] = [
  { label: 'Receita', value: 1 },
  { label: 'Despesa', value: 2 },
  { label: 'Transferência', value: 3 },
  { label: 'Outros', value: 4 },
];

export const RecurrenceTypes: BaseEnum[] = [
  { label: 'Diária', value: 1 },
  { label: 'Semanal', value: 2 },
  { label: 'Mensal', value: 3 },
  { label: 'Anual', value: 4 },
  { label: 'Nenhum', value: 5 },
];
