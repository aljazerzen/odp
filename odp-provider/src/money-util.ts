import { Money } from './common/money';

interface CurrencyMap {
  [currency: string]: number;
}

export function moneyAggregate(items: (Money | null)[]): Money[] {
  return moneyFinish(items.reduce(moneyReduce, {} as CurrencyMap))
}

export function moneyReduce(map: CurrencyMap, money: Money | null) {
  if (!money) return map;
  map[money.currency] = (map[money.currency] ?? 0) + money.amount;
  return map;
}

export function moneyFinish(map: CurrencyMap): Money[] {
  return Object.keys(map).map(currency => ({ currency, amount: map[currency] }));
}

export function moneyMultiply(factor: number): (m: Money | null) => Money | null {
  return (money: Money) => (money === null ? null : {
    amount: factor * money.amount,
    currency: money.currency
  });
}
