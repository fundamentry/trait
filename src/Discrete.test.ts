import { describe, expect, expectTypeOf, it } from 'vitest';

import { Discrete } from './Discrete.js';

class Version implements Discrete<Version> {
  readonly major: number;

  constructor(major: number) {
    this.major = major;
  }

  [Discrete.successor](): Version {
    return new Version(this.major + 1);
  }

  [Discrete.predecessor](): Version {
    return new Version(this.major - 1);
  }
}

describe('Discrete', () => {
  describe('successor', () => {
    it('is shared across copies of the package', () => {
      expect(Discrete.successor).toBe(
        Symbol.for('@fundamentry/trait/Discrete/successor')
      );
    });
  });

  describe('predecessor', () => {
    it('is shared across copies of the package', () => {
      expect(Discrete.predecessor).toBe(
        Symbol.for('@fundamentry/trait/Discrete/predecessor')
      );
    });
  });

  describe('interface', () => {
    it('steps to any value by default', () => {
      expectTypeOf<Discrete>().toEqualTypeOf<{
        [Discrete.successor]: () => unknown;
        [Discrete.predecessor]: () => unknown;
      }>();
    });

    it('requires an explicit opt-in through the symbols', () => {
      expectTypeOf<{
        next: () => unknown;
        previous: () => unknown;
      }>().not.toExtend<Discrete>();
    });

    it('requires both directions', () => {
      expectTypeOf<{
        [Discrete.successor]: () => unknown;
      }>().not.toExtend<Discrete>();
    });

    it('is covariant in its result type', () => {
      expectTypeOf<Discrete<Version>>().toExtend<Discrete>();
      expectTypeOf<Discrete>().not.toExtend<Discrete<Version>>();
    });
  });

  describe('implementation', () => {
    it('steps up to the successor', () => {
      expect(new Version(2)[Discrete.successor]().major).toBe(3);
    });

    it('steps down to the predecessor', () => {
      expect(new Version(2)[Discrete.predecessor]().major).toBe(1);
    });
  });
});
