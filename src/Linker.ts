/**
 * Represents the connection between two consecutive stem sides in a structure.
 *
 * Includes the last base of the preceding stem side,
 * the unpaired bases between the two stem sides,
 * and the first base in the following stem side.
 *
 * A hairpin loop is an example of a linker.
 *
 * All neighboring stems have a linker between them.
 */
export class Linker<Nucleobase> {
  /**
   * The bases in the linker.
   */
  #bases;

  constructor(bases: Nucleobase[]) {
    if (bases.length < 2) {
      throw new Error('A linker must have at least two bases.');
    }

    this.#bases = [...bases];
  }

  [Symbol.iterator]() {
    return this.#bases.values();
  }

  get firstBase(): Nucleobase {
    if (this.#bases.length < 1) {
      throw new Error('This linker has no bases.');
    }

    return this.#bases[0];
  }

  get lastBase(): Nucleobase {
    if (this.#bases.length < 1) {
      throw new Error('This linker has no bases.');
    }

    return this.#bases[this.#bases.length - 1];
  }
}
