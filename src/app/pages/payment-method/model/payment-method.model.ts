import {BaseEnum} from '../../../core/interfaces/enum.type';

export interface PaymentMethod {
  id: number
  name: string
  type: number
  active: boolean
  bankAccountId: number
  bankAccountName: string
}

export const PaymentTypes: BaseEnum[] = [
  { label: 'Cartão de Crédito', value: 1 },
  { label: 'Cartão de Débito', value: 2 },
  { label: 'Dinheiro', value: 3 },
  { label: 'PIX', value: 4 },
  { label: 'Boleto', value: 5 },
  { label: 'Outros', value: 6 },
];
