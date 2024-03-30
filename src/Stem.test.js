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

  test('numBasePairs getter', () => {
    let st = new Stem(createBasePairMocks(182));
    expect(st.numBasePairs).toBe(182);
  });

  test('iterating over a stem', () => {
    let basePairs = createBasePairMocks(7);
    let st = new Stem(basePairs);

    expect([...st].length).toBe(7);

    [...st].forEach((bp, i) => {
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

  test('side5 getter', () => {
    let basePairs = createBasePairMocks(6);
    let st = new Stem(basePairs);

    expect([...st.side5].length).toBe(6);

    [...st.side5].forEach((b, i) => {
      expect(b).toBe(basePairs[i][0]);
    });
  });

  test('side3 getter', () => {
    let basePairs = createBasePairMocks(9);
    let st = new Stem(basePairs);

    expect([...st.side3].length).toBe(9);

    [...st.side3].forEach((b, i) => {
      expect(b).toBe(basePairs[9 - i - 1][1]);
    });
  });

  test('upstreamSide getter', () => {
    let basePairs = createBasePairMocks(8);
    let st = new Stem(basePairs);

    expect([...st.upstreamSide].length).toBe(8);

    [...st.upstreamSide].forEach((b, i) => {
      expect(b).toBe(basePairs[i][0]);
    });
  });

  test('downstreamSide getter', () => {
    let basePairs = createBasePairMocks(7);
    let st = new Stem(basePairs);

    expect([...st.downstreamSide].length).toBe(7);

    [...st.downstreamSide].forEach((b, i) => {
      expect(b).toBe(basePairs[7 - i - 1][1]);
    });
  });

  test('bases getter', () => {
    let basePairs = createBasePairMocks(11);
    let st = new Stem(basePairs);

    expect([...st.bases].length).toBe(2 * 11);

    [...st.bases].forEach((b, i) => {
      if (i < 11) {
        expect(b).toBe(basePairs[i][0]);
      } else {
        expect(b).toBe(basePairs[(2 * 11) - i - 1][1]);
      }
    });
  });

  test('contains method', () => {
    let basePairs = createBasePairMocks(5);
    let st = new Stem(basePairs);

    basePairs.forEach(bp => {
      expect(st.contains(bp[0])).toBe(true);
      expect(st.contains(bp[1])).toBe(true);
    });

    expect(st.contains(new NucleobaseMock())).toBe(false);
  });

  test('containsAll method', () => {
    let basePairs = createBasePairMocks(6);
    let st = new Stem(basePairs);

    let bs = basePairs.flat();

    // contains all
    expect(st.containsAll([bs[8], bs[7], bs[3], bs[2], bs[5], bs[1], bs[2]])).toBe(true);

    // doesn't contain one
    expect(st.containsAll([bs[3], bs[1], bs[5], {}, bs[7], bs[9]])).toBe(false);

    // doesn't contain three
    expect(st.containsAll([bs[2], bs[3], {}, bs[1], {}, {}, bs[0], bs[4]])).toBe(false);

    // doesn't contain any
    expect(st.containsAll([{}, {}, {}, {}])).toBe(false);

    // vacuously returns true for an empty array of bases
    expect(st.containsAll([])).toBe(true);

    // one base
    expect(st.containsAll([bs[3]])).toBe(true);
    expect(st.containsAll([{}])).toBe(false);
  });
});
