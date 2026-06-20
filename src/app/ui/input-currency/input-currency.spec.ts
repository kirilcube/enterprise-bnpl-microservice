import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCurrency } from './input-currency';

describe('InputCurrency', () => {
  let component: InputCurrency;
  let fixture: ComponentFixture<InputCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCurrency],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCurrency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
