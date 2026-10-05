import { describe, expect, expectTypeOf, it, vi } from 'vitest';

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

const stub = (result: boolean) => ({
  [Equatable.symbol]: vi
    .fn<(other: unknown) => boolean>()
    .mockReturnValue(result),
});

describe('Equatable', () => {
  describe('symbol', () => {
    it('is shared across copies of the package', () => {
      expect(Equatable.symbol).toBe(Symbol.for('@fundamentry/trait/Equatable'));
    });
  });

  describe('is', () => {
    it.each([
      { name: 'class instance', value: new Money(1) },
      { name: 'plain object', value: { [Equatable.symbol]: () => true } },
      {
        name: 'null-prototype object',
        value: Object.assign(Object.create(null) as object, {
          [Equatable.symbol]: () => true,
        }),
      },
    ])('accepts $name implementing the protocol', ({ value }) => {
      expect(Equatable.is(value)).toBe(true);
    });

    it.each([
      { name: 'null', value: null },
      { name: 'undefined', value: undefined },
      { name: 'number', value: 1 },
      { name: 'object without the protocol', value: {} },
      {
        name: 'object with a string-keyed equals',
        value: { equals: () => true },
      },
      {
        name: 'object with a non-function protocol member',
        value: { [Equatable.symbol]: true },
      },
      {
        name: 'function implementing the protocol',
        value: Object.assign(() => true, { [Equatable.symbol]: () => true }),
      },
    ])('rejects $name', ({ value }) => {
      expect(Equatable.is(value)).toBe(false);
    });

    it('narrows to an equatable of unknown argument type', () => {
      expectTypeOf(Equatable.is).guards.toEqualTypeOf<Equatable<never>>();
    });
  });

  describe('equals', () => {
    it.each([
      { name: 'distinct operands', result: true, right: () => ({}) },
      {
        name: 'the same operand',
        result: false,
        right: (left: unknown) => left,
      },
    ])(
      'returns $result from the left operand for $name',
      ({ result, right }) => {
        const left = stub(result);
        const other = right(left);

        expect(Equatable.equals<unknown>(left, other)).toBe(result);
        expect(left[Equatable.symbol]).toHaveBeenCalledExactlyOnceWith(other);
      }
    );

    it('ignores the protocol of the right operand', () => {
      const right = stub(true);

      expect(Equatable.equals<unknown>(1, right)).toBe(false);
      expect(right[Equatable.symbol]).not.toHaveBeenCalled();
    });

    const object = {};

    it.each([
      { name: 'equal numbers', left: 1, right: 1, expected: true },
      { name: 'different numbers', left: 1, right: 2, expected: false },
      { name: 'NaN and NaN', left: NaN, right: NaN, expected: true },
      { name: 'zero and negative zero', left: 0, right: -0, expected: false },
      { name: 'the same object', left: object, right: object, expected: true },
      { name: 'distinct objects', left: {}, right: {}, expected: false },
    ])(
      'falls back to SameValue equality for $name',
      ({ left, right, expected }) => {
        expect(Equatable.equals<unknown>(left, right)).toBe(expected);
      }
    );
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
