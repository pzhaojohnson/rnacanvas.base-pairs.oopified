import { BasePair } from './BasePair';

/**
 * A perfect stack of uninterrupted base-pairs
 * (i.e., with no intervening unpaired bases between them).
 */
export class Stem<Nucleobase> {
  /**
   * Store directly as an array to improve performance.
   */
  private _basePairs: BasePair<Nucleobase>[];

  /**
   * The base-pairs passed to this constructor are assumed to already be sorted
   * (i.e., with bottom base-pair first and top base-pair last,
   * with base-pairs overall in ascending order by upstream partner position within the parent structure,
   * with the upstream partner ordered before the downstream partner within individual base-pairs).
   *
   * Throws if the passed base-pairs array is empty.
   *
   * @param basePairs The base-pairs comprising the stem.
   */
  constructor(basePairs: [Nucleobase, Nucleobase][]) {
    if (basePairs.length == 0) {
      throw new Error('All stems must have at least one base-pair.');
    }

    this._basePairs = basePairs.map(bp => new BasePair(...bp));
  }

  /**
   * The base-pairs comprising the stem.
   */
  get basePairs(): Iterable<BasePair<Nucleobase>> {
    return this._basePairs;
  }

  /**
   * The number of base-pairs in the stem.
   */
  get numBasePairs(): number {
    return this._basePairs.length;
  }

  [Symbol.iterator](): Iterator<BasePair<Nucleobase>> {
    return this._basePairs.values();
  }

  /**
   * The base-pair of the stem with the 5'-most upstream partner
   * (and 3'-most downstream partner).
   */
  get bottomBasePair(): BasePair<Nucleobase> {
    return this._basePairs[0];
  }

  /**
   * The base-pair of the stem with the 5'-least upstream partner
   * (and 3'-least downstream partner).
   */
  get topBasePair(): BasePair<Nucleobase> {
    return this._basePairs[this._basePairs.length - 1];
  }

  /**
   * The 5' side of the stem.
   *
   * Bases are returned in ascending order by sequence position in the parent structure
   * (i.e., bottom base-pair upstream partner first, top base-pair upstream partner last).
   */
  get side5(): Iterable<Nucleobase> {
    return this._basePairs.map(bp => bp.firstBase);
  }

  /**
   * The 3' side of the stem.
   *
   * Bases are returned in ascending order by sequence position in the parent structure
   * (i.e., top base-pair downstream partner first, bottom base-pair downstream partner last).
   */
  get side3(): Iterable<Nucleobase> {
    let side3 = this._basePairs.map(bp => bp.secondBase);
    side3.reverse();
    return side3;
  }

  /**
   * An alias for the 5' side of the stem.
   */
  get upstreamSide() {
    return this.side5;
  }

  /**
   * The bases in the stem.
   *
   * Bases are returned in ascending order by sequence position in the parent structure
   * (i.e., bottom base-pair upstream partner first, bottom base-pair downstream partner last).
   */
  get bases(): Iterable<Nucleobase> {
    return [...this.side5, ...this.side3];
  }
}
