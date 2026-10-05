export interface Stringable {
  [Symbol.toPrimitive]: (hint: 'string' | 'number' | 'default') => string;
}
