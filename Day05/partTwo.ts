import { readFileSync } from "fs";

type Ingredient = number;
class Range {
  lowId: number;
  highId: number;
  constructor(low: number, high: number) {
    if (high < low) {
      throw new Error("Error - low > high!");
    }
    this.lowId = low;
    this.highId = high;
  }
  contains(value: number) {
    return value >= this.lowId && value <= this.highId;
  }
  overlaps(other: Range) {
    return !(other.lowId > this.highId || other.highId < this.lowId);
  }
  merge(other: Range) {
    return new Range(
      Math.min(this.lowId, other.lowId),
      Math.max(this.highId, other.highId)
    );
  }
}

const [ranges, ingredients] = readFileSync("input.txt", "utf-8")
  .split(/\r\n\r\n/)
  .map((lines, index) => {
    if (index === 0) {
      return lines.split(/\r\n/).map((line) => {
        const [lowId, highId] = line.split("-").map(Number);
        return new Range(lowId, highId);
      });
    } else {
      return lines.split(/\r\n/).map(Number);
    }
  }) as [Range[], Ingredient[]];

const discreteRanges = [];
const stack = [...ranges];

while (stack.length > 0) {
  const current = stack.pop();
  {
    let merged = false;
    for (let i = 0; i < discreteRanges.length; i++) {
      const discreteRange = discreteRanges[i];

      if (discreteRange.overlaps(current)) {
        stack.push(discreteRange.merge(current));
        discreteRanges.splice(i, 1);
        merged = true;
        break;
      }
    }
    if (!merged) {
      discreteRanges.push(current);
    }
  }
}

const totalFreshIdCount = discreteRanges.reduce(
  (count, range) => count + range.highId - range.lowId + 1,
  0
);

console.log(totalFreshIdCount);
