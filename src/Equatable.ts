export interface Equatable<in T = unknown> {
  [Equatable.symbol]: (other: T) => boolean;
}

export namespace Equatable {
  export const symbol: unique symbol = Symbol.for(
    '@fundamentry/trait/Equatable'
  );

  export const is = (value: unknown): value is Equatable<never> =>
    typeof value === 'object' &&
    value !== null &&
    symbol in value &&
    typeof value[symbol] === 'function';

  export const equals = <T>(left: T, right: NoInfer<T>): boolean =>
    is(left) ? (left as Equatable<T>)[symbol](right) : Object.is(left, right);
}
