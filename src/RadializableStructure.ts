import { BasePair } from './BasePair';

import { Stem } from './Stem';

import { radializable } from '@rnacanvas/base-pairs';

import { Stems } from '@rnacanvas/base-pairs';

import { mountainPlotTraversal } from '@rnacanvas/base-pairs';

export class RadializableStructure<Nucleobase> {
  #bases;

  #basePairs;

  #indices = new Map<Nucleobase, number>();

  #partners = new Map<Nucleobase, Nucleobase>();

  #stems;

  #mountainPlotTraversal;

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

    this.#stems = (new Stems(bases, basePairs)).get().map(stem => new Stem(stem));

    this.#mountainPlotTraversal = mountainPlotTraversal(bases, basePairs);
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
   * Returns true if the base is in a base-pair in the structure.
   */
  isPaired(b: Nucleobase): boolean {
    return this.#partners.has(b);
  }

  /**
   * Returns true if the base is not in a base-pair.
   */
  isUnpaired(b: Nucleobase): boolean {
    return !this.isPaired(b);
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

  /**
   * All stems in the structure.
   */
  get stems(): Iterable<Stem<Nucleobase>> {
    return [...this.#stems];
  }

  /**
   * Returns the mountain plot height of a given base
   * in the mountain plot traversal of the structure.
   *
   * Throws if the given base is not in the structure.
   */
  mountainPlotHeight(b: Nucleobase): number | never {
    return this.#mountainPlotTraversal[this.indexOf(b)];
  }
}

type BasePairTuple<Nucleobase> = [Nucleobase, Nucleobase];
