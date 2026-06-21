import {Component, computed, input, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'monthly-payments',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './monthly-payments.html',
})
export class MonthlyPayments {
  monthlyPaymentsInCents = input.required<number[]>();

  monthlyPaymentsAllTheSame = computed(() => this.monthlyPaymentsInCents().every(c => c === this.monthlyPaymentsInCents()[0])
  )

  isPaymentsInfoExpanded = signal<boolean>(false);
  expandPaymentsInfo(value = !this.isPaymentsInfoExpanded()) {
    this.isPaymentsInfoExpanded.set(value);
  }
}
