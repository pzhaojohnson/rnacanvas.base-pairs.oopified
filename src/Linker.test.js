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
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
