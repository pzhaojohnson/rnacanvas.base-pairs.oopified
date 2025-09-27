import { BasePair } from './BasePair';

import { radializable } from '@rnacanvas/base-pairs';

export class RadializableStructure<Nucleobase> {
  #bases;

  #basePairs;

  constructor(bases: Nucleobase[], basePairs: BasePairTuple<Nucleobase>[]) {
    // remove pseudoknots, repeat base-pairs, conflicting base-pairs, etc.
    [bases, basePairs] = radializable(bases, basePairs);

    this.#bases = bases;

    this.#basePairs = basePairs.map(bp => new BasePair(...bp));
  }

  get bases(): Iterable<Nucleobase> {
    return [...this.#bases];
  }

  get basePairs(): Iterable<BasePair<Nucleobase>> {
    return this.#basePairs.map(bp => bp.deepCopy());
  }
}

type BasePairTuple<Nucleobase> = [Nucleobase, Nucleobase];
