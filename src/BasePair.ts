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
}
