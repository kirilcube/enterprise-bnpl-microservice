import {Component, computed, signal, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {InputCurrency} from './ui/input-currency/input-currency';
import {DiscreteSlider} from './ui/discrete-slider/discrete-slider';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    InputCurrency,
    DiscreteSlider
  ],
  templateUrl: './app.html',
})
export class App {
  inputCurrencyRef = viewChild(InputCurrency);
  moneyAmount = computed(() => this.inputCurrencyRef()?.realValue() ?? 0);

  months = signal<number>(3);
}
