import { describe, expect, expectTypeOf, it } from 'vitest';

import { Equatable } from './Equatable.js';

class Money implements Equatable<Money> {
  readonly amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  [Equatable.symbol](other: Money): boolean {
    return this.amount === other.amount;
  }
}

describe('Equatable', () => {
  describe('symbol', () => {
    it('is shared across copies of the package', () => {
      expect(Equatable.symbol).toBe(Symbol.for('@fundamentry/trait/Equatable'));
    });
  });

  describe('interface', () => {
    it('compares against any value by default', () => {
      expectTypeOf<Equatable>().toEqualTypeOf<{
        [Equatable.symbol]: (other: unknown) => boolean;
      }>();
    });

    it('requires an explicit opt-in through the symbol', () => {
      expectTypeOf<{
        equals: (other: unknown) => boolean;
      }>().not.toExtend<Equatable>();
    });

    it('rejects implementations that narrow the parameter type', () => {
      expectTypeOf<Money>().toExtend<Equatable<Money>>();
      expectTypeOf<Money>().not.toExtend<Equatable>();
    });

    it('is contravariant in its argument type', () => {
      expectTypeOf<Equatable>().toExtend<Equatable<Money>>();
      expectTypeOf<Equatable<Money>>().not.toExtend<Equatable>();
    });
  });
});
