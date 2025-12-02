import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf-8")
  .split(",")
  .map((entry) => entry.split("-"));

const magnitude = (value: number) => {
  return Math.floor(Math.log10(value));
};

const stringLength = (value: number) => {
  return magnitude(value) + 1;
};

const findFactors = (value: number) => {
  const sqrRoot = Math.sqrt(value);
  const factors = new Set([1]);
  for (let i = 2; i <= sqrRoot; i++) {
    if (value % i === 0) {
      factors.add(i);
      factors.add(value / i);
    }
  }
  return factors;
};

const buildId = (sequence: number, repeatCount: number) => {
  return Number(String(sequence).repeat(repeatCount));
};

const findInvalidIds = (firstId: number, lastId: number): Set<number> => {
  // Check equal length Ids
  if (magnitude(lastId) > magnitude(firstId)) {
    const lowOrderIds = findInvalidIds(firstId, 10 ** magnitude(lastId) - 1);
    const highOrderIds = findInvalidIds(10 ** magnitude(lastId), lastId);
    return lowOrderIds.union(highOrderIds);
  }

  const invalidIds: Set<number> = new Set();
  const sequenceLengths =
    stringLength(firstId) % 2 === 0 ? [stringLength(firstId) / 2] : [];
  sequenceLengths.forEach((sequenceLength) => {
    const lowSequence = Number(String(firstId).slice(0, sequenceLength));
    const highSequence = Number(String(lastId).slice(0, sequenceLength));
    const repeatCount = stringLength(firstId) / sequenceLength;

    // Any sequences strictly between these must be in range
    for (let i = lowSequence + 1; i < highSequence; i++) {
      const invalidId = buildId(i, repeatCount);
      invalidIds.add(invalidId);
    }
    // Check ends.
    const lowInvalidId = buildId(lowSequence, repeatCount);
    const highInvalidId = buildId(highSequence, repeatCount);

    for (const id of [lowInvalidId, highInvalidId]) {
      if (id >= firstId && id <= lastId) {
        invalidIds.add(id);
      }
    }
  });
  return invalidIds;
};

const result = input.reduce((idSum, range) => {
  const [lowId, highId] = range;
  const invalidIds = findInvalidIds(Number(lowId), Number(highId));
  invalidIds.forEach((id) => (idSum += id));
  return idSum;
}, 0);

console.log(result);
