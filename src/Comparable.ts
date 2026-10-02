export interface Comparable<in T> {
  compareTo: (other: T) => number;
}
