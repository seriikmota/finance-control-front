import {BaseEnum} from '../../../core/interfaces/enum.type';

export interface Category {
  id: number;
  name: string;
  type: number;
  active: boolean;
  parentCategoryId: string;
  parentCategoryName: string;
}

export const CategoryTypes: BaseEnum[] = [
  { label: 'Receita', value: 1 },
  { label: 'Despesa', value: 2 },
  { label: 'Transferência', value: 3 },
  { label: 'Outros', value: 4 },
];
