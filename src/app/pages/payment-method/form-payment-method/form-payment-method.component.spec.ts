import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaymentMethodComponent } from './form-payment-method.component';

describe('FormPaymentMethodComponent', () => {
  let component: FormPaymentMethodComponent;
  let fixture: ComponentFixture<FormPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPaymentMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
