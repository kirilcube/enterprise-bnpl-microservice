import {Component, computed, signal, viewChild} from '@angular/core';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {InputCurrency} from '../../ui/input-currency/input-currency';
import {DiscreteSlider} from '../../ui/discrete-slider/discrete-slider';
import {BNPL_RULES} from '../../constants/bnpl.constants';
import {MonthlyPayments} from './components/monthly-payments/monthly-payments';

@Component({
  selector: 'simulator',
  imports: [
    InputCurrency,
    DiscreteSlider,
    MonthlyPayments,
    CurrencyPipe,
    PercentPipe,
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator {
  inputCurrencyRef = viewChild(InputCurrency);
  centsAmount = computed(() => this.inputCurrencyRef()?.centsValue() ?? 0);

  months = signal<number>(3);

  cashbackPercents = computed(() => {
    return ((BNPL_RULES.CASHBACK.PERCENT_FOR_MONTH * 100) * this.months()) / 100;
  })
  cashbackCents = computed(() => Math.round(
    this.centsAmount() * this.cashbackPercents()
  ))
  //TODO: replace with real number from backend
  monthlyPaymentsInCents = signal<number[]>([
    10001,
    10000,
    10000
  ]);

  confirm() {
    alert("This is just a simulation, confirm part is unimplemented")
  }
}
