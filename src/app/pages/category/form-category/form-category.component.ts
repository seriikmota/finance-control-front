import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {Button} from 'primeng/button';
import {Category, CategoryTypes} from '../model/category.model';
import {Select} from 'primeng/select';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {CategoryService} from '../service/category.service';
import {NotificationService} from '../../../shared/services/notification.service';

@Component({
  selector: 'app-form-category',
  imports: [
    Dialog,
    ReactiveFormsModule,
    DropdownModule,
    Button,
    Select,
    ToggleSwitch,
    InputText,
    Textarea,
    AutoComplete
  ],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.scss'
})
export class FormCategoryComponent {
  @Input() visible = false;
  @Input() title = 'Categoria';
  @Input() category: Category | null = null;

  @Output() onClose = new EventEmitter<boolean>();

  listParentCat: any[] | undefined;
  listFilterParentCat: any[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private categoryService: CategoryService,
              private notificationService: NotificationService) {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      type: [null, Validators.required],
      active: [true, Validators.required],
      parentCategory: [null],
      description: ['']
    });
  }

  ngOnChanges() {
    if (this.category && this.category.id) {
      this.categoryService.getById(this.category.id).subscribe(res => {
        this.category = res;
        this.form.patchValue(this.category);
        this.loadParentCategories()
      })
    } else {
      this.form.reset({ active: true });
    }
  }

  submit() {
    if (this.form.valid) {
      let cat = this.form.value as Category;

      if (this.form.get('parentCategory')?.value && this.form.get('parentCategory')?.value.id) {
        cat.parentCategoryId = this.form.get('parentCategory')?.value.id;
      }

      if (cat.id) {
        this.categoryService.update(cat).subscribe(
          () => {
            this.notificationService.showSuccess('Categoria editada com sucesso!');
            this.onClose.emit(true);
            this.form.reset({ active: true });
          }
        )
      } else {
        this.categoryService.create(cat).subscribe(
          () => {
            this.notificationService.showSuccess('Categoria criada com sucesso!');
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

  loadParentCategories() {
    this.categoryService.search(1, 1000, undefined, this.form.get('type')?.value, true).subscribe(res => {
      this.listParentCat = res.data;
    })
  }

  filterParentCat(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.listParentCat as any[]).length; i++) {
      const parentCat = (this.listParentCat as any[])[i];
      if (parentCat.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(parentCat);
      }
    }

    this.listFilterParentCat = filtered;
  }

  protected readonly CategoryTypes = CategoryTypes;
}
