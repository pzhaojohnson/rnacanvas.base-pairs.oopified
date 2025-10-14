import { BasePair } from './BasePair';

import { Stem } from './Stem';

import { radializable } from '@rnacanvas/base-pairs';

import { Stems } from '@rnacanvas/base-pairs';

import { mountainPlotTraversal } from '@rnacanvas/base-pairs';

export class RadializableStructure<Nucleobase> {
  #bases;

  #indices = new Map<Nucleobase, number>();

  #basePairs;

  #partners = new Map<Nucleobase, Nucleobase>();

  #stems;

  #mountainPlotTraversal;

  constructor(bases: Nucleobase[], basePairs: BasePairTuple<Nucleobase>[]) {
    let _: unknown;

    // remove pseudoknots, repeat base-pairs, conflicting base-pairs, etc.
    [_, basePairs] = radializable(bases, basePairs);

    this.#bases = bases;

    this.#bases.forEach((b, i) => this.#indices.set(b, i));

    this.#basePairs = basePairs.map(bp => new BasePair(...bp));

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

  /**
   * The number of bases in the structure.
   */
  get numBases(): number {
    return this.#bases.length;
  }

  /**
   * The number of bases in the structure.
   */
  get length(): number {
    return this.numBases;
  }

  /**
   * Returns the base at the zero-based index.
   *
   * Throws for out-of-bounds indices.
   */
  atIndex(i: number): Nucleobase | never {
    if (i < 0 || i > this.#bases.length - 1) {
      throw new Error('Index is out-of-bounds.');
    }

    return this.#bases[i];
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
   * Returns the base at the one-based position.
   *
   * Throws for out-of-bounds positions.
   */
  atPosition(p: number): Nucleobase | never {
    if (p < 1 || p > this.#bases.length) {
      throw new Error('Position is out-of-bounds.');
    }

    return this.#bases[p - 1];
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
   * The first base in the structure.
   *
   * Throws for empty structures.
   */
  get firstBase(): Nucleobase | never {
    if (this.numBases == 0) {
      throw new Error('The structure is empty.');
    }

    return this.#bases[0];
  }

  /**
   * The last base in the structure.
   *
   * Throws for empty structures.
   */
  get lastBase(): Nucleobase | never {
    if (this.numBases == 0) {
      throw new Error('The structure is empty.');
    }

    return this.#bases[this.#bases.length - 1];
  }

  /**
   * Returns the subsequence defined by a start base and an end base, inclusive.
   *
   * The start base and end base can be input in either order.
   *
   * This method will never return the subsequence in reverse order.
   *
   * This method will throw if either the start base or end base are not in the structure.
   */
  subsequence(startBase: Nucleobase, endBase: Nucleobase): Iterable<Nucleobase> | never {
    let startIndex = this.indexOf(startBase);
    let endIndex = this.indexOf(endBase);

    let minIndex = Math.min(startIndex, endIndex);
    let maxIndex = Math.max(startIndex, endIndex);

    return this.#bases.slice(minIndex, maxIndex + 1);
  }

  /**
   * Returns the subsequence of bases between two bases
   * (not including the two bases themselves).
   *
   * The two bases can be input to this method in either order.
   *
   * (This method will never return the intervening bases in reverse order.)
   *
   * This method will throw if either of the input bases is not present in the structure.
   */
  interveningBases(b1: Nucleobase, b2: Nucleobase): Iterable<Nucleobase> | never {
    let subsequence = [...this.subsequence(b1, b2)];

    return subsequence.slice(1, -1);
  }

  get basePairs(): Iterable<BasePair<Nucleobase>> {
    return this.#basePairs.map(bp => bp.deepCopy());
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
   * Returns the subsequence of bases between the two bases of a base-pair
   * (not including the two bases of the base-pair).
   *
   * The two bases of the base-pair can be ordered either way within the base-pair.
   *
   * (This method will never return the spanned bases in reverse order.)
   *
   * This method will throw if either base of the base-pair is not present in the structure.
   */
  spannedBases(bp: BasePair<Nucleobase> | [Nucleobase, Nucleobase]): Iterable<Nucleobase> | never {
    return this.interveningBases(bp[0], bp[1]);
  }

  /**
   * Returns the sequence of bases joined by a base-pair
   * (including the two bases in the base-pair).
   *
   * The ordering of the two bases within the input base-pair doesn't matter.
   *
   * (This method will never return the joined bases in reverse order.)
   *
   * This method will throw if either base in the input base-pair is not present in the structure.
   */
  joinedBases(bp: BasePair<Nucleobase> | [Nucleobase, Nucleobase]): Iterable<Nucleobase> | never {
    let index1 = this.indexOf(bp[0]);
    let index2 = this.indexOf(bp[1]);

    let minIndex = Math.min(index1, index2);
    let maxIndex = Math.max(index1, index2);

    // in case of a self-pair
    if (minIndex == maxIndex) {
      return [...this.#bases];
    } else {
      return [...this.#bases.slice(0, minIndex + 1), ...this.#bases.slice(maxIndex)];
    }
  }

  /**
   * Returns the substructure defined by a starting base and an ending base, inclusive.
   *
   * The starting and ending base can be input to this method in either order.
   *
   * This method will never return the substructure in reverse order.
   *
   * This method will throw if either the starting or ending base are not present in the structure.
   */
  substructure(startingBase: Nucleobase, endingBase: Nucleobase): RadializableStructure<Nucleobase> | never {
    let subsequence = [...this.subsequence(startingBase, endingBase)];

    let subsequenceSet = new Set(subsequence);

    let basePairs: [Nucleobase, Nucleobase][] = (
      this.#basePairs
        .filter(bp => subsequenceSet.has(bp[0]) && subsequenceSet.has(bp[1]))
        .map(bp => [bp[0], bp[1]])
    );

    return new RadializableStructure(subsequence, basePairs);
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
