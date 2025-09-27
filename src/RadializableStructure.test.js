import { RadializableStructure } from './RadializableStructure';

import { BasePair } from './BasePair';

describe('`class RadializableStructure`', () => {
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
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
