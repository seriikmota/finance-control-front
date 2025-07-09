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
    Textarea
  ],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.scss'
})
export class FormCategoryComponent {
  @Input() visible = false;
  @Input() title = 'Categoria';
  @Input() category: Category | null = null;

  @Output() onClose = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      type: [null, Validators.required],
      active: [true, Validators.required],
      description: ['']
    });
  }

  ngOnChanges() {
    if (this.category) {
      const selectedType = this.CategoryTypes.find(opt => opt.value === this.category?.type);
      this.form.patchValue({ ...this.category, type: selectedType });
    } else {
      this.form.reset({ active: true });
    }
  }

  submit() {
    if (this.form.valid) {
      this.onClose.emit(true);
    }
  }

  close() {
    this.onClose.emit(false);
  }

  protected readonly CategoryTypes = CategoryTypes;
}
