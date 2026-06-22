import {Component, input, output, signal} from '@angular/core';

@Component({
  selector: 'pkb-input-currency',
  imports: [],
  templateUrl: './input-currency.html',
  styleUrl: './input-currency.css',
})
export class InputCurrency {
  inputId = input<string>("purchase-amount-input");
  placeholder = input<string>("1 000");
  currency = input<string>("MXN");
  inputValue = signal<string>("");
  centsValue = signal<bigint>(0n);
  centsChanged = output<bigint>();

  handleInput(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    let rawValue = inputElement.value;
    let cursorPosition = inputElement.selectionStart || 0;

    // 1. BEFORE FORMATTING: Count how many numbers/dots/commas are behind the cursor
    let digitsBeforeCursor = 0;
    for (let i = 0; i < cursorPosition; i++) {
      if (/[0-9.,]/.test(rawValue[i])) {
        digitsBeforeCursor++;
      }
    }

    // Convert commas to dots
    rawValue = rawValue.replace(/,/g, '.');

    // Remove any characters that are NOT numbers or dots
    rawValue = rawValue.replace(/[^0-9.]/g, '');
    while(rawValue[0] === '0' && rawValue.length > 1) {
      rawValue = rawValue.slice(1);
    }

    const parts = rawValue.split('.');
    let output = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (parts.length > 1) {
      if (!output) {
        output = '0';
        digitsBeforeCursor++;
      }
      output += `.${parts[1].substring(0, 2)}`;
    }

    // Update the visual input and your signal
    inputElement.value = output;
    this.inputValue.set(output);

    // 2. AFTER FORMATTING: Place cursor after that exact same number of digits/dots
    let newCursorPosition = 0;
    let digitsCounted = 0;

    for (let i = 0; i < output.length; i++) {
      // Once we've passed the same number of digits as before, stop moving the cursor
      if (digitsCounted === digitsBeforeCursor) {
        break;
      }
      // Only count numbers and dots, ignore the formatting spaces
      if (/[0-9.]/.test(output[i])) {
        digitsCounted++;
      }
      newCursorPosition++;
    }

    // Apply the corrected cursor position
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

    const float = parseFloat(
      output.replaceAll(" ", "")
    ) || 0

    const cents = BigInt(Math.round(float * 100));
    this.centsValue.set(cents);
    this.centsChanged.emit(cents);
  }
}
