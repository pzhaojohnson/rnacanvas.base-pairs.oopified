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

  /**
   * An iterable over the two bases in the base-pair (the first base then the second base).
   */
  get bases(): Iterable<Nucleobase> {
    return [this.firstBase, this.secondBase];
  }

  [Symbol.iterator]() {
    return [...this.bases].values();
  }

  /**
   * Returns true if the given base is one of the bases in the base-pair.
   *
   * Returns false otherwise.
   */
  includes(b: Nucleobase): boolean {
    return [...this.bases].includes(b);
  }

  /**
   * Returns true if both bases are in the base-pair and returns false otherwise.
   */
  includesBoth(b1: Nucleobase, b2: Nucleobase): boolean {
    return this.includes(b1) && this.includes(b2);
  }

  /**
   * Returns true if this base-pair equals the specified base-pair
   * (i.e., they both pair the same two bases).
   */
  equals(bp: BasePair<Nucleobase> | BasePairTuple<Nucleobase>): boolean {
    return (
      (this[0] === bp[0] && this[1] === bp[1])
      || (this[0] === bp[1] && this[1] === bp[0])
    );
  }

  deepCopy(): BasePair<Nucleobase> {
    return new BasePair(this.firstBase, this.secondBase);
  }
}

type BasePairTuple<Nucleobase> = [Nucleobase, Nucleobase];
