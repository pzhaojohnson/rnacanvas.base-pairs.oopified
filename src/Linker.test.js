import { Linker } from './Linker';

describe('`class Linker`', () => {
  test('`constructor()`', () => {
    var bases = [...'123456'].map(() => new NucleobaseMock());

    var linker = new Linker(bases);
    expect([...linker]).toStrictEqual(bases);

    // throws for less than two bases
    expect(() => new Linker([])).toThrow();
    expect(() => new Linker([bases[0]])).toThrow();
  });

  test('`get bases()`', () => {
    var bases = [...'123456'].map(() => new NucleobaseMock());

    var linker = new Linker(bases);
    expect([...linker.bases]).toStrictEqual(bases);

    var linker = new Linker(bases.slice(2, 4));
    expect([...linker.bases]).toStrictEqual(bases.slice(2, 4));
  });

  test('`get firstBase()`', () => {
    var bases = [...'123456'].map(() => new NucleobaseMock());

    var linker = new Linker(bases);
    expect(linker.firstBase).toBe(bases[0]);

    var linker = new Linker(bases.slice(3, 5));
    expect(linker.firstBase).toBe(bases[3]);
  });

  test('`get lastBase()`', () => {
    var bases = [...'123456'].map(() => new NucleobaseMock());

    var linker = new Linker(bases);
    expect(linker.lastBase).toBe(bases[5]);

    var linker = new Linker(bases.slice(2, 4));
    expect(linker.lastBase).toBe(bases[3]);
  });

  test('`get unpairedBases()`', () => {
    var bases = [...'123456'].map(() => new NucleobaseMock());

    var linker = new Linker(bases);
    expect([...linker.unpairedBases]).toStrictEqual(bases.slice(1, 5));

    // zero unpaired bases
    var linker = new Linker(bases.slice(0, 2));
    expect([...linker.unpairedBases]).toStrictEqual([]);

    // one unpaired base
    var linker = new Linker(bases.slice(3, 6));
    expect([...linker.unpairedBases]).toStrictEqual([bases[4]]);
  });
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
