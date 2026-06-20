import {Component, input, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'input-currency',
  imports: [FormsModule],
  templateUrl: './input-currency.html',
  styleUrl: './input-currency.css',
})
export class InputCurrency {
  placeholder = input<string>("1000");
  inputValue = signal<string>("");
  realValue = model<number>(0)

  handleInput(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    let rawValue = inputElement.value;

    // Convert commas to dots
    rawValue = rawValue.replace(/,/g, '.');

    // Remove any characters that are NOT numbers or dots
    rawValue = rawValue.replace(/[^0-9.]/g, '');

    // Handle multiple dots and limit to 2 decimal places
    const parts = rawValue.split('.');
    if (parts.length > 1) {
      // If the user types ".5", automatically format it as "0.5"
      const integerPart = parts[0] === '' ? '0' : parts[0];

      // Grab only the first two characters after the dot
      const decimalPart = parts[1].substring(0, 2);

      // Rebuild the string (this also naturally discards any extra dots)
      rawValue = `${integerPart}.${decimalPart}`;
    }

    inputElement.value = rawValue;
    this.inputValue.set(rawValue);

    this.realValue.set(parseFloat(rawValue) || 0);
  }
}
