export interface Comparable<in T = unknown> {
  [Comparable.symbol]: (other: T) => number;
}

export namespace Comparable {
  export const symbol: unique symbol = Symbol.for(
    '@fundamentry/trait/Comparable'
  );
}
