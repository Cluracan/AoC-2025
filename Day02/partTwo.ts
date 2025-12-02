import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf-8")
  .split(",")
  .map((entry) => entry.split("-"));

const magnitude = (value: number) => {
  return stringLength(value) - 1;
};

const stringLength = (value: number) => {
  return String(value).length;
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

const getLeadingDigits = (id: number, length: number) => {
  const idLength = stringLength(id);
  return Math.floor(id / 10 ** (idLength - length));
};

const findInvalidIds = (firstId: number, lastId: number): Set<number> => {
  // Check equal length Ids
  if (magnitude(lastId) > magnitude(firstId)) {
    const lowOrderEnd = 10 ** magnitude(lastId) - 1;
    const highOrderStart = 10 ** magnitude(lastId);
    const lowOrderIds = findInvalidIds(firstId, lowOrderEnd);
    const highOrderIds = findInvalidIds(highOrderStart, lastId);
    return lowOrderIds.union(highOrderIds);
  }

  const invalidIds: Set<number> = new Set();
  const sequenceLengths = findFactors(stringLength(firstId));

  sequenceLengths.forEach((sequenceLength) => {
    const lowSequence = getLeadingDigits(firstId, sequenceLength);
    const highSequence = getLeadingDigits(lastId, sequenceLength);
    const repeatCount = stringLength(firstId) / sequenceLength;

    if (repeatCount > 1) {
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
    }
  });
  return invalidIds;
};

const allInvalidIds: Set<number> = new Set();
input.forEach((range) => {
  const [lowId, highId] = range;
  const invalidIds = findInvalidIds(Number(lowId), Number(highId));
  invalidIds.forEach((id) => allInvalidIds.add(id));
}, 0);
let total = 0;

allInvalidIds.forEach((id) => (total += id));
console.log(total);
