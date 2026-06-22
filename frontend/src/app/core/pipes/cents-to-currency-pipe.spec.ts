import { CentsToCurrencyPipe } from './cents-to-currency-pipe';

describe('CentsToCurrencyPipe', () => {
  it('formats bigint cents into a currency string', () => {
    const pipe = new CentsToCurrencyPipe();

    expect(pipe.transform(12345n)).toBe('123.45');
    expect(pipe.transform(5n)).toBe('0.05');
  });

  it('returns an empty string for nullish values', () => {
    const pipe = new CentsToCurrencyPipe();

    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
