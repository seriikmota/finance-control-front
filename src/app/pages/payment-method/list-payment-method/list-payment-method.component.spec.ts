import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentMethodComponent } from './list-payment-method.component';

describe('ListPaymentMethodComponent', () => {
  let component: ListPaymentMethodComponent;
  let fixture: ComponentFixture<ListPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPaymentMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
