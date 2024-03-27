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
});
