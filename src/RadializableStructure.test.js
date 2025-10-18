import { RadializableStructure } from './RadializableStructure';

import { BasePair } from './BasePair';

import { parseDotBracket } from '@rnacanvas/base-pairs';

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

  test('`get numBases()`', () => {
    let bases = [...'123456789'].map(() => new NucleobaseMock());

    var structure = new RadializableStructure(bases, []);
    expect(structure.numBases).toBe(9);

    var structure = new RadializableStructure([], []);
    expect(structure.numBases).toBe(0);
  });

  test('`get length()`', () => {
    let bases = [...'1234567'].map(() => new NucleobaseMock());

    var structure = new RadializableStructure(bases, []);
    expect(structure.length).toBe(7);

    var structure = new RadializableStructure([], []);
    expect(structure.length).toBe(0);
  });

  test('`atIndex()`', () => {
    let bases = [...'123456'].map(() => new NucleobaseMock());

    var structure = new RadializableStructure(bases, []);

    expect(structure.atIndex(0)).toBe(bases[0]);
    expect(structure.atIndex(2)).toBe(bases[2]);
    expect(structure.atIndex(5)).toBe(bases[5]);

    // out of bounds
    expect(() => structure.atIndex(-10)).toThrow();
    expect(() => structure.atIndex(-1)).toThrow();
    expect(() => structure.atIndex(6)).toThrow();
    expect(() => structure.atIndex(60)).toThrow();

    // empty structure
    var structure = new RadializableStructure([], []);
    expect(() => structure.atIndex(0)).toThrow();
  });

  test('`indexOf()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    expect(structure.indexOf(bases[0])).toBe(0);
    expect(structure.indexOf(bases[6])).toBe(6);
    expect(structure.indexOf(bases[11])).toBe(11);

    expect(() => structure.indexOf(new NucleobaseMock())).toThrow();
  });

  test('`atPosition()`', () => {
    let bases = [...'123456'].map(() => new NucleobaseMock());

    var structure = new RadializableStructure(bases, []);

    expect(structure.atPosition(1)).toBe(bases[0]);
    expect(structure.atPosition(3)).toBe(bases[2]);
    expect(structure.atPosition(6)).toBe(bases[5]);

    // out of bounds
    expect(() => structure.atPosition(-10)).toThrow();
    expect(() => structure.atPosition(0)).toThrow();
    expect(() => structure.atPosition(7)).toThrow();
    expect(() => structure.atPosition(60)).toThrow();

    // empty structure
    var structure = new RadializableStructure([], []);
    expect(() => structure.atPosition(1)).toThrow();
  });

  test('`positionOf()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    expect(structure.positionOf(bases[0])).toBe(1);
    expect(structure.positionOf(bases[6])).toBe(7);
    expect(structure.positionOf(bases[11])).toBe(12);

    expect(() => structure.positionOf(new NucleobaseMock())).toThrow();
  });

  test('`get firstBase()`', () => {
    let bases = [...'123456'].map(() => new NucleobaseMock());

    // multiple bases
    var structure = new RadializableStructure(bases, []);
    expect(structure.firstBase).toBe(bases[0]);

    // one base
    var structure = new RadializableStructure([bases[2]], []);
    expect(structure.firstBase).toBe(bases[2]);

    // no bases
    var structure = new RadializableStructure([], []);
    expect(() => structure.firstBase).toThrow();
  });

  test('`get lastBase()`', () => {
    let bases = [...'123456'].map(() => new NucleobaseMock());

    // multiple bases
    var structure = new RadializableStructure(bases, []);
    expect(structure.lastBase).toBe(bases[5]);

    // one base
    var structure = new RadializableStructure([bases[2]], []);
    expect(structure.lastBase).toBe(bases[2]);

    // no bases
    var structure = new RadializableStructure([], []);
    expect(() => structure.lastBase).toThrow();
  });

  test('`subsequence()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    // base 1 comes before base 2
    expect([...structure.subsequence(bases[2], bases[8])]).toStrictEqual(bases.slice(2, 8 + 1));

    // base 1 comes after base 2
    expect([...structure.subsequence(bases[6], bases[3])]).toStrictEqual(bases.slice(3, 6 + 1));

    // base 1 and base 2 are the same base
    expect([...structure.subsequence(bases[7], bases[7])]).toStrictEqual([bases[7]]);

    // base 1 is not in the structure
    expect(() => structure.subsequence(new NucleobaseMock(), bases[2])).toThrow();

    // base 2 is not in the structure
    expect(() => structure.subsequence(bases[5], new NucleobaseMock())).toThrow();
  });

  test('`interveningBases()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    // base 1 comes before base 2
    expect([...structure.interveningBases(bases[4], bases[9])]).toStrictEqual(bases.slice(5, 8 + 1));

    // base 1 comes after base 2
    expect([...structure.interveningBases(bases[10], bases[3])]).toStrictEqual(bases.slice(4, 9 + 1));

    // base 1 and 2 are the same base
    expect([...structure.interveningBases(bases[5], bases[5])]).toStrictEqual([]);

    // base 1 and 2 are neighboring bases
    expect([...structure.interveningBases(bases[6], bases[7])]).toStrictEqual([]);

    // there is only one base between bases 1 and 2
    expect([...structure.interveningBases(bases[5], bases[7])]).toStrictEqual([bases[6]]);

    // base 1 is not in the structure
    expect(() => structure.interveningBases(new NucleobaseMock(), bases[5])).toThrow();

    // base 2 is not in the structure
    expect(() => structure.interveningBases(bases[3], new NucleobaseMock())).toThrow();
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

  test('`isPaired()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let basePairs = [
      [bases[2], bases[14]],
      [bases[3], bases[10]],
    ];

    let structure = new RadializableStructure(bases, basePairs);

    expect(structure.isPaired(bases[2])).toBe(true);
    expect(structure.isPaired(bases[10])).toBe(true);

    expect(structure.isPaired(bases[0])).toBe(false);
    expect(structure.isPaired(bases[4])).toBe(false);

    // a base not in the structure
    expect(structure.isPaired(new NucleobaseMock())).toBe(false);
  });

  test('`isUnpaired()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let basePairs = [
      [bases[2], bases[14]],
      [bases[3], bases[10]],
    ];

    let structure = new RadializableStructure(bases, basePairs);

    expect(structure.isUnpaired(bases[2])).toBe(false);
    expect(structure.isUnpaired(bases[10])).toBe(false);

    expect(structure.isUnpaired(bases[0])).toBe(true);
    expect(structure.isUnpaired(bases[4])).toBe(true);

    // a base not in the structure
    expect(structure.isUnpaired(new NucleobaseMock())).toBe(true);
  });

  test('`partnerOf()`', () => {
    let bases = [...'1234567890'].map(() => new NucleobaseMock());

    let basePairs = [
      [bases[2], bases[8]],
      [bases[3], bases[7]],
    ];

    let structure = new RadializableStructure(bases, basePairs);

    expect(structure.partnerOf(bases[2])).toBe(bases[8]);
    expect(structure.partnerOf(bases[8])).toBe(bases[2]);

    expect(structure.partnerOf(bases[3])).toBe(bases[7]);
    expect(structure.partnerOf(bases[7])).toBe(bases[3]);

    // an unpaired base
    expect(() => structure.partnerOf(bases[4])).toThrow();

    // a base that's not in the structure
    expect(() => structure.partnerOf(new NucleobaseMock())).toThrow();
  });

  test('`get stems()`', () => {
    let bases = [...'12345678901234567890123456789012'].map(() => new NucleobaseMock());

    // an unstructured structure
    var structure = new RadializableStructure(bases, []);

    expect([...structure.stems].length).toBe(0);

    let basePairs = [...parseDotBracket(bases, '..(((...((((.....))..))....)))..')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.stems].length).toBe(3);

    expect([...[...structure.stems][0].bottomBasePair]).toStrictEqual([bases[2], bases[29]]);
    expect([...[...structure.stems][1].bottomBasePair]).toStrictEqual([bases[8], bases[22]]);
    expect([...[...structure.stems][2].bottomBasePair]).toStrictEqual([bases[10], bases[18]]);
  });

  test('`get linkers()`', () => {
    var bases = [...'1234567890123456789012345'].map(() => new NucleobaseMock());

    var basePairs = [...parseDotBracket(bases, '...(((...(((....)))..))).')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.linkers][0].firstBase).toBe(bases[5]);

    expect([...structure.linkers].map(li => [li.firstBase, li.lastBase])).toStrictEqual([
      [bases[5], bases[9]],
      [bases[11], bases[16]],
      [bases[18], bases[21]],
    ]);

    // no linkers
    var structure = new RadializableStructure(bases, []);

    expect([...structure.linkers]).toStrictEqual([]);
  });

  test('`get danglingBases5()`', () => {
    var bases = [...'123456789012345678901234567890'].map(() => new NucleobaseMock());

    var basePairs = [...parseDotBracket(bases, '.....(((.....(((.....)))..))).')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.danglingBases5]).toStrictEqual(bases.slice(0, 5));

    // zero 5' dangling bases
    var basePairs = [...parseDotBracket(bases, '(((......)))....')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.danglingBases5]).toStrictEqual([]);

    // a structure with no base-pairs
    var structure = new RadializableStructure(bases, []);

    expect([...structure.danglingBases5]).toStrictEqual([]);
  });

  test('`get danglingBases3()`', () => {
    var bases = [...'123456789012345678901234567890'].map(() => new NucleobaseMock());

    var basePairs = [...parseDotBracket(bases, '..((((.....((.....))..))))....')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.danglingBases3]).toStrictEqual(bases.slice(26, 30));

    // zero 3' dangling bases
    var basePairs = [...parseDotBracket(bases, '......((((.....((.....))..))))')];

    var structure = new RadializableStructure(bases, basePairs);

    expect([...structure.danglingBases3]).toStrictEqual([]);

    // a structure with no base-pairs
    var structure = new RadializableStructure(bases, []);

    expect([...structure.danglingBases3]).toStrictEqual([]);
  });

  test('`spannedBases()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let structure = new RadializableStructure(bases, []);

    // base 1 comes before base 2
    expect([...structure.spannedBases([bases[3], bases[11]])]).toStrictEqual(bases.slice(4, 10 + 1));

    // base 1 comes after base 2
    expect([...structure.spannedBases([bases[11], bases[3]])]).toStrictEqual(bases.slice(4, 10 + 1));

    // one spanned base
    expect([...structure.spannedBases([bases[3], bases[5]])]).toStrictEqual([bases[4]]);

    // there are no spanned bases
    expect([...structure.spannedBases([bases[3], bases[3]])]).toStrictEqual([]);
    expect([...structure.spannedBases([bases[3], bases[4]])]).toStrictEqual([]);

    // base 1 is not present in the structure
    expect(() => structure.spannedBases(new NucleobaseMock(), bases[5])).toThrow();

    // base 2 is not present in the structure
    expect(() => structure.spannedBases(bases[2], new NucleobaseMock())).toThrow();

    let bp = new BasePair(bases[3], bases[11]);

    // inputting a base-pair object
    expect([...structure.spannedBases(bp)]).toStrictEqual(bases.slice(4, 10 + 1));
  });

  test('`joinedBases()`', () => {
    var bases = [...'12345678901234567890'].map(() => new NucleobaseMock());

    var structure = new RadializableStructure(bases, []);

    // base 1 comes before base 2
    expect([...structure.joinedBases([bases[4], bases[9]])]).toStrictEqual([...bases.slice(0, 4 + 1), ...bases.slice(9)]);

    // base 1 comes after base 2
    expect([...structure.joinedBases([bases[9], bases[4]])]).toStrictEqual([...bases.slice(0, 4 + 1), ...bases.slice(9)]);

    // a base-pair object
    expect([...structure.joinedBases(new BasePair(bases[4], bases[9]))]).toStrictEqual([...bases.slice(0, 4 + 1), ...bases.slice(9)]);

    // the base-pair involves the first base in the structure
    expect([...structure. joinedBases([bases[0], bases[15]])]).toStrictEqual([bases[0], ...bases.slice(15)]);

    // the base-pair involves the last base in the structure
    expect([...structure.joinedBases([bases[4], bases.at(-1)])]).toStrictEqual([...bases.slice(0, 4 + 1), bases[19]]);

    expect([...structure.joinedBases([bases[0], bases.at(-1)])]).toStrictEqual([bases[0], bases[19]]);

    // base 1 is not in the structure
    expect(() => structure.joinedBases(new NucleobaseMock(), bases[5])).toThrow();

    // base 2 is not in the structure
    expect(() => structure.joinedBases(bases[6], new NucleobaseMock())).toThrow();

    // a self-pair
    expect([...structure.joinedBases([bases[5], bases[5]])]).toStrictEqual(bases);

    var b = new NucleobaseMock();

    // a self-pair and a sequence length of 1
    var structure = new RadializableStructure([b], []);
    expect([...structure.joinedBases([b, b])]).toStrictEqual([b]);
  });

  test('`substructure()`', () => {
    let bases = [...'123456789012345678901234567890'].map(() => new NucleobaseMock());
    expect(bases.length).toBe(30);

    let basePairs = [];

    // hairpin 1
    basePairs.push([bases[1], bases[8]], [bases[2], bases[7]]);

    // hairpin 2
    basePairs.push([bases[11], bases[18]], [bases[12], bases[17]]);

    // hairpin 3
    basePairs.push([bases[21], bases[28]], [bases[22], bases[27]]);

    let structure = new RadializableStructure(bases, basePairs);

    var substructure = structure.substructure(bases[5], bases[25]);

    expect([...substructure.bases]).toStrictEqual(bases.slice(5, 25 + 1));

    expect([...substructure.basePairs].length).toBe(2);
    expect([...[...substructure.basePairs][1]]).toStrictEqual([bases[11], bases[18]]);
    expect([...[...substructure.basePairs][0]]).toStrictEqual([bases[12], bases[17]]);

    // reverse starting and ending bases
    var substructure = structure.substructure(bases[25], bases[5]);

    expect([...substructure.bases]).toStrictEqual(bases.slice(5, 25 + 1));

    expect([...substructure.basePairs].length).toBe(2);
    expect([...[...substructure.basePairs][1]]).toStrictEqual([bases[11], bases[18]]);
    expect([...[...substructure.basePairs][0]]).toStrictEqual([bases[12], bases[17]]);

    // starting base is not in structure
    expect(() => structure.substructure(new NucleobaseMock(), bases[25])).toThrow();

    // ending base is not in structure
    expect(() => structure.substructure(bases[5], new NucleobaseMock())).toThrow();
  });

  test('`mountainPlotHeight()`', () => {
    let bases = [...'1234567890123456'].map(() => new NucleobaseMock());

    let basePairs = [...parseDotBracket(bases, '..(((....))).')];

    let structure = new RadializableStructure(bases, basePairs);

    expect(structure.mountainPlotHeight(bases[0])).toBe(0);
    expect(structure.mountainPlotHeight(bases[3])).toBe(1);
    expect(structure.mountainPlotHeight(bases[6])).toBe(3);
    expect(structure.mountainPlotHeight(bases[9])).toBe(2);
    expect(structure.mountainPlotHeight(bases[11])).toBe(0);

    // a base that's not in the structure
    expect(() => structure.mountainPlotHeight(new NucleobaseMock())).toThrow();
  });
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
