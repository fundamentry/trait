import { describe, expect, expectTypeOf, it } from 'vitest';

import { Comparable } from './Comparable.js';

class Version implements Comparable<Version> {
  readonly major: number;

  constructor(major: number) {
    this.major = major;
  }

  [Comparable.symbol](other: Version): number {
    return this.major - other.major;
  }
}

describe('Comparable', () => {
  describe('symbol', () => {
    it('is shared across copies of the package', () => {
      expect(Comparable.symbol).toBe(
        Symbol.for('@fundamentry/trait/Comparable')
      );
    });
  });

  describe('interface', () => {
    it('compares against any value by default', () => {
      expectTypeOf<Comparable>().toEqualTypeOf<{
        [Comparable.symbol]: (other: unknown) => number;
      }>();
    });

    it('requires an explicit opt-in through the symbol', () => {
      expectTypeOf<{
        compareTo: (other: unknown) => number;
      }>().not.toExtend<Comparable>();
    });

    it('rejects implementations that narrow the parameter type', () => {
      expectTypeOf<Version>().toExtend<Comparable<Version>>();
      expectTypeOf<Version>().not.toExtend<Comparable>();
    });

    it('is contravariant in its argument type', () => {
      expectTypeOf<Comparable>().toExtend<Comparable<Version>>();
      expectTypeOf<Comparable<Version>>().not.toExtend<Comparable>();
    });
  });
});
