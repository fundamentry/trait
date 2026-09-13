export interface Comparable<T = unknown> {
  compareTo(other: T): number;
}
