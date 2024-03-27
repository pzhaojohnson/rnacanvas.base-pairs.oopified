import { BasePair } from './BasePair';

class NucleobaseMock {
  constructor() {}
}

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
});
