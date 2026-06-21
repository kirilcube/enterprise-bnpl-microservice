import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centsToCurrency',
  standalone: true
})
export class CentsToCurrencyPipe implements PipeTransform {
  transform(value: bigint | undefined | null): string {
    if (value === null || value === undefined) return '';

    const dollars = value / 100n;
    const cents = value % 100n;

    return `${dollars}.${cents.toString().padStart(2, '0')}`;
  }
}
