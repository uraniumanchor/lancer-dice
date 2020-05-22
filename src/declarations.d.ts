declare namespace Combinatorics {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IGenerator<T> {
    reduce<U>(
      callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => U,
      initialValue: U
    ): U;
  }
}
