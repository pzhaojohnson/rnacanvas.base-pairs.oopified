/**
 * A pairing of two bases.
 *
 * Is iterable (first base then the second base).
 */
export class BasePair<Nucleobase> {
  constructor(readonly firstBase: Nucleobase, readonly secondBase: Nucleobase) {}

  get '0'(): Nucleobase {
    return this.firstBase;
  }

  get '1'(): Nucleobase {
    return this.secondBase;
  }

  [Symbol.iterator]() {
    return [this.firstBase, this.secondBase].values();
  }

  /**
   * Returns true if the given base is one of the bases in the base-pair.
   *
   * Returns false otherwise.
   */
  includes(b: Nucleobase): boolean {
    return [this.firstBase, this.secondBase].includes(b);
  }
}
