import { describe, expectTypeOf, it } from 'vitest';

import { type Stringable } from './Stringable.js';

class Money implements Stringable {
  readonly amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  [Symbol.toPrimitive](): string {
    return `${String(this.amount)} USD`;
  }
}

describe('Stringable', () => {
  describe('interface', () => {
    it('accepts implementations of the conversion protocol', () => {
      expectTypeOf<Money>().toExtend<Stringable>();
    });

    it('rejects values without an explicit opt-in', () => {
      expectTypeOf<object>().not.toExtend<Stringable>();
      expectTypeOf<number>().not.toExtend<Stringable>();
      expectTypeOf<string>().not.toExtend<Stringable>();
      expectTypeOf<Map<unknown, unknown>>().not.toExtend<Stringable>();
      expectTypeOf<{ toString: () => string }>().not.toExtend<Stringable>();
    });

    it('rejects conversions that may produce a non-string', () => {
      expectTypeOf<Date>().not.toExtend<Stringable>();
    });
  });
});
