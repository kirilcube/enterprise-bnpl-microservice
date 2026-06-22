import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCurrency } from './input-currency';

describe('InputCurrency', () => {
  let component: InputCurrency;
  let fixture: ComponentFixture<InputCurrency>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCurrency],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCurrency);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.nativeElement.querySelector('input');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('normalizes separators, strips invalid characters, and updates cents', () => {
    const emittedValues: bigint[] = [];
    component.centsChanged.subscribe((value) => emittedValues.push(value));
    inputElement.value = '001234,567abc';
    inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);

    component.handleInput({ target: inputElement } as unknown as Event);

    expect(inputElement.value).toBe('1 234.56');
    expect(component.inputValue()).toBe('1 234.56');
    expect(component.centsValue()).toBe(123456n);
    expect(emittedValues).toEqual([123456n]);
  });

  it('adds a leading zero for decimal-only values', () => {
    inputElement.value = '.5';
    inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);

    component.handleInput({ target: inputElement } as unknown as Event);

    expect(inputElement.value).toBe('0.5');
    expect(component.centsValue()).toBe(50n);
  });
});
