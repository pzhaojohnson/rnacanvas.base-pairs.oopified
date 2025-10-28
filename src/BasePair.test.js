import { BasePair } from './BasePair';

describe('BasePair class', () => {
  test('accessing the first base of a base-pair', () => {
    let firstBase = new NucleobaseMock();
    let bp = new BasePair(firstBase, new NucleobaseMock());
    expect(bp.firstBase).toBe(firstBase);
  });

  test('accessing the second base of a base-pair', () => {
    let secondBase = new NucleobaseMock();
    let bp = new BasePair(new NucleobaseMock(), secondBase);
    expect(bp.secondBase).toBe(secondBase);
  });

  test('accessing the first base by index', () => {
    let firstBase = new NucleobaseMock();
    let bp = new BasePair(firstBase, new NucleobaseMock());
    expect(bp[0]).toBe(firstBase);
  });

  test('accessing the second base by index', () => {
    let secondBase = new NucleobaseMock();
    let bp = new BasePair(new NucleobaseMock(), secondBase);
    expect(bp[1]).toBe(secondBase);
  });

  test('bases getter', () => {
    let firstBase = new NucleobaseMock();
    let secondBase = new NucleobaseMock();

    let bp = new BasePair(firstBase, secondBase);

    expect([...bp.bases].length).toBe(2);
    expect([...bp.bases][0]).toBe(firstBase);
    expect([...bp.bases][1]).toBe(secondBase);
  });

  test('iterating over a base-pair', () => {
    let firstBase = new NucleobaseMock();
    let secondBase = new NucleobaseMock();

    let bp = new BasePair(firstBase, secondBase);

    expect([...bp].length).toBe(2);
    expect([...bp][0]).toBe(firstBase);
    expect([...bp][1]).toBe(secondBase);
  });

  test('includes method', () => {
    let firstBase = new NucleobaseMock();
    let secondBase = new NucleobaseMock();

    let bp = new BasePair(firstBase, secondBase);

    expect(bp.includes(firstBase)).toBe(true);
    expect(bp.includes(secondBase)).toBe(true);
    expect(bp.includes(new NucleobaseMock())).toBe(false);
  });

  test('includesBoth method', () => {
    let firstBase = new NucleobaseMock();
    let secondBase = new NucleobaseMock();

    let bp = new BasePair(firstBase, secondBase);

    expect(bp.includesBoth(firstBase, secondBase)).toBe(true);
    expect(bp.includesBoth(secondBase, firstBase)).toBe(true);

    expect(bp.includesBoth(firstBase, new NucleobaseMock())).toBe(false);
    expect(bp.includesBoth(new NucleobaseMock(), secondBase)).toBe(false);
  });

  test('`equals()`', () => {
    let b1 = new NucleobaseMock();
    let b2 = new NucleobaseMock();

    let bp = new BasePair(b1, b2);

    expect(bp.equals(new BasePair(b1, b2))).toBe(true);
    expect(bp.equals(new BasePair(b2, b1))).toBe(true);

    expect(bp.equals([b1, b2])).toBe(true);
    expect(bp.equals([b2, b1])).toBe(true);

    expect(bp.equals(new BasePair(b1, new NucleobaseMock()))).toBe(false);
    expect(bp.equals(new BasePair(new NucleobaseMock(), b2))).toBe(false);

    expect(bp.equals([b1, new NucleobaseMock()])).toBe(false);
    expect(bp.equals([new NucleobaseMock(), b2])).toBe(false);

    expect(bp.equals(new BasePair(new NucleobaseMock(), new NucleobaseMock()))).toBe(false);

    expect(bp.equals([new NucleobaseMock(), new NucleobaseMock()])).toBe(false);
  });

  test('`deepCopy()`', () => {
    let b1 = new NucleobaseMock();
    let b2 = new NucleobaseMock();

    let bp1 = new BasePair(b1, b2);
    let bp2 = bp1.deepCopy();

    expect(bp2.firstBase).toBe(b1);
    expect(bp2.secondBase).toBe(b2);

    expect(bp2).not.toBe(bp1);
  });
});

class NucleobaseMock {
  /**
   * Make each instance unique.
   */
  id = Math.random();
}
