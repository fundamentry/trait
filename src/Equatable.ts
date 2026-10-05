export interface Equatable<in T = unknown> {
  [Equatable.symbol]: (other: T) => boolean;
}

export namespace Equatable {
  export const symbol: unique symbol = Symbol.for(
    '@fundamentry/trait/Equatable'
  );
}
