import { RadializableStructure } from './RadializableStructure';

import { BasePair } from './BasePair';

describe('`class RadializableStructure`', () => {
  test('`constructor()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    // an array of base-pair tuples (creating a stem)
    let basePairs = [
      [bases[0], bases[9]],
      [bases[1], bases[8]],
      [bases[2], bases[7]],
    ];

    // a repeat base-pair
    basePairs.push([bases[0], bases[9]]);

    // a conflicting base-pair
    // (the first base is already paired with the tenth base)
    basePairs.push([bases[0], bases[10]]);

    // a self base-pair
    basePairs.push([bases[5], bases[5]]);

    // a base-pair creating a pseudoknot
    basePairs.push([bases[3], bases[11]]);

    let structure = new RadializableStructure(bases, basePairs);

    expect([...structure.bases]).toStrictEqual(bases);
    expect(structure.bases).not.toBe(bases);

    expect(structure.basePairs).not.toBe(basePairs);

    [...structure.basePairs].length; // 3

    expect([...[...structure.basePairs][0]]).toStrictEqual([bases[2], bases[7]]);
    expect([...[...structure.basePairs][1]]).toStrictEqual([bases[1], bases[8]]);
    expect([...[...structure.basePairs][2]]).toStrictEqual([bases[0], bases[9]]);
  });

  test('`get bases()`', () => {
    let bases = [...'1234567890'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    expect([...structure.bases]).toStrictEqual(bases);

    expect(structure.bases).not.toBe(bases);

    // does not allow the bases iterable to be modified
    structure.bases[1] = new NucleobaseMock();
    expect([...structure.bases]).toStrictEqual(bases);
  });

  test('`get basePairs()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let basePairs = [
      [bases[0], bases[15]],
      [bases[1], bases[14]],
      [bases[2], bases[13]],
      [bases[3], bases[12]],
      [bases[4], bases[11]],
    ];

    let structure = new RadializableStructure(bases, basePairs);

    expect([...structure.basePairs].length).toBe(5);

    expect(structure.basePairs).not.toBe(basePairs);

    // returns base-pair objects
    expect([...structure.basePairs].every(bp => bp instanceof BasePair)).toBeTruthy();

    // does not allow base-pairs iterable to be edited
    structure.basePairs.push(new BasePair({}, {}));
    expect([...structure.basePairs].length).toBe(5);
  });

  test('`indexOf()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    expect(structure.indexOf(bases[0])).toBe(0);
    expect(structure.indexOf(bases[6])).toBe(6);
    expect(structure.indexOf(bases[11])).toBe(11);

    expect(() => structure.indexOf(new NucleobaseMock())).toThrow();
  });

  test('`positionOf()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    expect(structure.positionOf(bases[0])).toBe(1);
    expect(structure.positionOf(bases[6])).toBe(7);
    expect(structure.positionOf(bases[11])).toBe(12);

    expect(() => structure.positionOf(new NucleobaseMock())).toThrow();
  });
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
