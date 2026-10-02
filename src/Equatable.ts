export interface Equatable<in T> {
  equals: (other: T) => boolean;
}
