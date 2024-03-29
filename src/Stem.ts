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
   * with base-pairs overall in ascending order by upstream parter position within the parent structure,
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
}
