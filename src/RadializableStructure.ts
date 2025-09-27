import { BasePair } from './BasePair';

import { radializable } from '@rnacanvas/base-pairs';

export class RadializableStructure<Nucleobase> {
  #bases;

  #basePairs;

  #indices = new Map<Nucleobase, number>();

  #partners = new Map<Nucleobase, Nucleobase>();

  constructor(bases: Nucleobase[], basePairs: BasePairTuple<Nucleobase>[]) {
    let _: unknown;

    // remove pseudoknots, repeat base-pairs, conflicting base-pairs, etc.
    [_, basePairs] = radializable(bases, basePairs);

    this.#bases = bases;

    this.#basePairs = basePairs.map(bp => new BasePair(...bp));

    this.#bases.forEach((b, i) => this.#indices.set(b, i));

    this.#basePairs.forEach(bp => {
      this.#partners.set(bp[0], bp[1]);
      this.#partners.set(bp[1], bp[0]);
    });
  }

  get bases(): Iterable<Nucleobase> {
    return [...this.#bases];
  }

  get basePairs(): Iterable<BasePair<Nucleobase>> {
    return this.#basePairs.map(bp => bp.deepCopy());
  }

  /**
   * Returns the zero-based index of the specified base
   * in the sequence of bases for the structure.
   *
   * Throws if the specified base is not in the structure.
   */
  indexOf(b: Nucleobase): number | never {
    let i = this.#indices.get(b);

    if (i === undefined) {
      throw new Error('The specified base is not in the structure.');
    }

    return i;
  }

  /**
   * Returns the one-based position of the specified base
   * in the sequence of bases for the structure.
   *
   * Throws if the specified base is not in the structure.
   */
  positionOf(b: Nucleobase): number | never {
    return this.indexOf(b) + 1;
  }

  /**
   * Returns the partner base for the specified base.
   *
   * Throws if the specified base doesn't have a partner or is not in the structure.
   */
  partnerOf(b: Nucleobase): Nucleobase | never {
    if (!this.#indices.has(b)) {
      throw new Error('The specified base is not in the structure.');
    }

    let partner = this.#partners.get(b);

    if (partner === undefined) {
      throw new Error('The specified base is unpaired.');
    }

    return partner;
  }
}

type BasePairTuple<Nucleobase> = [Nucleobase, Nucleobase];
