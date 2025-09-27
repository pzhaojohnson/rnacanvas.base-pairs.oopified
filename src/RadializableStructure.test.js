import { RadializableStructure } from './RadializableStructure';

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
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
