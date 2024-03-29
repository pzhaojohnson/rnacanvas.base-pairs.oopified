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

  test('bottomBasePair getter', () => {
    let basePairs = createBasePairMocks(8);
    let st = new Stem(basePairs);

    expect(st.bottomBasePair.firstBase).toBe(basePairs[0][0]);
    expect(st.bottomBasePair.secondBase).toBe(basePairs[0][1]);
  });

  test('topBasePair getter', () => {
    let basePairs = createBasePairMocks(5);
    let st = new Stem(basePairs);

    expect(st.topBasePair.firstBase).toBe(basePairs[4][0]);
    expect(st.topBasePair.secondBase).toBe(basePairs[4][1]);
  });
});
