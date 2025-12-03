import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => line.split("").map(Number));

const canImproveTens = (
  value: number,
  currentTens: number,
  index: number,
  length: number
) => {
  return value > currentTens && index < length - 1;
};

const canImproveUnits = (value: number, currentUnits: number) => {
  return value > currentUnits;
};

const maximiseJoltage = (bank: number[]) => {
  const initialJoltage = { tens: -1, units: -1 };
  const maxJoltage = bank.reduce((joltage, currentValue, index, bank) => {
    if (canImproveTens(currentValue, joltage.tens, index, bank.length)) {
      return { tens: currentValue, units: -1 };
    }
    if (canImproveUnits(currentValue, joltage.units)) {
      return { tens: joltage.tens, units: currentValue };
    }
    return joltage;
  }, initialJoltage);
  return 10 * maxJoltage.tens + maxJoltage.units;
};

const joltageSum = input.reduce(
  (totalJoltage, bank) => totalJoltage + maximiseJoltage(bank),
  0
);

console.log(joltageSum);
