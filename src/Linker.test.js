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
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
