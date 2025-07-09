import {Component, signal, WritableSignal} from '@angular/core';
import {Category, CategoryTypes} from '../model/category.model';
import {TableModule} from 'primeng/table';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {DefaultTableComponent} from '../../../core/components/default-table.component';
import {Select} from 'primeng/select';
import {CategoryService} from '../service/category.service';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {FormCategoryComponent} from '../form-category/form-category.component';
import {BaseEnum} from '../../../core/interfaces/enum.type';
import {NotificationService} from '../../../shared/services/notification.service';
import {PaginationResult} from '../../../core/interfaces/pagination.dto';
import {finalize, forkJoin, from, mergeMap, tap} from 'rxjs';

@Component({
  selector: 'app-list-category',
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    Button,
    InputText,
    DefaultTableComponent,
    Select,
    ToggleSwitch,
    FormsModule,
    FormCategoryComponent
  ],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})
export class ListCategoryComponent {
  selectedCategories: Category[] = [];
  modalFormVisible = false;
  editingCategory: Category | null = null;

  categories: WritableSignal<Category[]> = signal([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);

  form: FormGroup;

  categoryCols = [
    { field: 'name', header: 'Nome', sortable: true },
    { field: 'parentCategoryName', header: 'Categoria Pai', sortable: true },
    { field: 'type', header: 'Tipo', sortable: true },
    { field: 'active', header: 'Ativo', sortable: true }
  ];

  activeOptions: BaseEnum[] = [
    { label: 'Todos', value: null },
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  typesOptions: BaseEnum[] = [
    { label: 'Todos', value: null },
    ...CategoryTypes
  ];

  constructor(private categoryService: CategoryService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              ) {
    this.form = this.fb.group({
      name: [''],
      type: [null],
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
    this.categoryService.search(this.page(), this.limit(), filter?.name, filter?.type, filter?.active)
      .subscribe((res: PaginationResult<Category>) => {
        this.categories.set(res.data);
        this.total.set(res.total);
      });
  }

  clear() {
    this.form.reset();
  }

  onAdd() {
    this.editingCategory = null;
    this.modalFormVisible = true;
  }

  onEdit(category: Category) {
    this.editingCategory = category;
    this.modalFormVisible = true;
  }

  closeModalForm(refresh: boolean = false) {
    this.modalFormVisible = false;
    this.editingCategory = null;
    if (refresh) {
      this.search()
    }
  }

  onDelete(category: Category) {
    this.notificationService.showConfirmation(
      `Deseja realmente excluir a categoria "${category.name}"?`,
      () => {
        this.categoryService.delete(category.id).subscribe(res => {
          this.notificationService.showSuccess(`Categoria "${category.name}" excluida com sucesso.`)
          this.search();
        })
      }
    )
  }

  onDeleteSelected() {
    if (this.selectedCategories.length === 0) {
      this.notificationService.showInfo('Nenhuma categoria selecionada para exclusão.');
      return;
    }

    this.notificationService.showConfirmation(
      'Deseja realmente excluir as categorias selecionadas?',
      () => {
        from(this.selectedCategories)
          .pipe(
            mergeMap(cat =>
              this.categoryService.delete(cat.id).pipe(
                tap(() =>
                  this.notificationService.showSuccess(`Categoria "${cat.name}" excluída com sucesso.`)
                )
              )
            ),
            finalize(() => {
              this.selectedCategories = [];
              this.search();
            })
          )
          .subscribe();
      }
    );
  }

  toggleActive(cat: Category) {
    this.categoryService.patch(cat.id, cat).subscribe(res => {
      if (res.active) {
        this.notificationService.showSuccess('Categoria ativada com sucesso');
      } else {
        this.notificationService.showSuccess('Categoria desativada com sucesso');
      }
    })
  }

  getCategoryTypeLabel(value: number): string {
    const found = CategoryTypes.find(catType => catType.value === value);
    return found ? found.label : '';
  }
}
