export interface Discrete<out T = unknown> {
  [Discrete.successor]: () => T;
  [Discrete.predecessor]: () => T;
}

export namespace Discrete {
  export const successor: unique symbol = Symbol.for(
    '@fundamentry/trait/Discrete/successor'
  );

  export const predecessor: unique symbol = Symbol.for(
    '@fundamentry/trait/Discrete/predecessor'
  );
}
