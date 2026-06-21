import {Component, computed, effect, input, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {CentsToCurrencyPipe} from '../../../../core/pipes/cents-to-currency-pipe';

@Component({
  selector: 'pkb-monthly-payments',
  imports: [
    CurrencyPipe,
    CentsToCurrencyPipe
  ],
  templateUrl: './monthly-payments.html',
})
export class MonthlyPayments {
  monthlyPaymentsInCents = input.required<bigint[]>();

  monthlyPaymentsAllTheSame = computed(() => this.monthlyPaymentsInCents().every(c => c === this.monthlyPaymentsInCents()[0])
  )

  isAnyMonthlyPayments = computed(() => !!(
    this.monthlyPaymentsInCents().length && this.monthlyPaymentsInCents()[0]
  ))

  constructor() {
    effect(() => {
      const _newData = this.monthlyPaymentsInCents();

      this.expandPaymentsInfo(false);
    });
  }

  isPaymentsInfoExpanded = signal<boolean>(false);
  expandPaymentsInfo(value = !this.isPaymentsInfoExpanded()) {
    this.isPaymentsInfoExpanded.set(value);
  }
}
