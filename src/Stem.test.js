import { Stem } from './Stem';

class NucleobaseMock {}

function createBasePairMocks(num) {
  return Array.from({ length: num }).map(() => [new NucleobaseMock(), new NucleobaseMock()]);
}

describe('Stem class', () => {
  describe('constructor', () => {
    it('throws if given an empty array of base-pairs', () => {
      expect(() => new Stem([])).toThrow();
    });
  });

  test('basePairs getter', () => {
    let basePairs = createBasePairMocks(10);
    let st = new Stem(basePairs);

    expect([...st.basePairs].length).toBe(10);

    [...st.basePairs].forEach((bp, i) => {
      expect(bp.firstBase).toBe(basePairs[i][0]);
      expect(bp.secondBase).toBe(basePairs[i][1]);
    });
  });
});