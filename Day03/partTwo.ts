import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => line.split("").map(Number));

const startTime = Date.now();
const joltageLength = 12;

const maximiseJoltage = (bank: number[]) => {
  const bestJoltage = Array.from({ length: joltageLength }, () => -1);
  for (let bankIndex = 0; bankIndex < bank.length; bankIndex++) {
    const currentValue = bank[bankIndex];
    for (let joltageIndex = 0; joltageIndex < joltageLength; joltageIndex++) {
      const requiredSpace = joltageLength - 1 - joltageIndex;
      if (
        currentValue > bestJoltage[joltageIndex] &&
        bankIndex + requiredSpace < bank.length
      ) {
        bestJoltage[joltageIndex] = currentValue;
        for (let i = joltageIndex + 1; i < joltageLength; i++) {
          bestJoltage[i] = -1;
        }
        break;
      }
    }
  }
  let result = 0;
  for (let i = 0; i < joltageLength; i++) {
    result += bestJoltage[i] * 10 ** (joltageLength - 1 - i);
  }
  return result;
};

let totalJoltage = 0;
input.forEach((bank) => (totalJoltage += maximiseJoltage(bank)));
console.log(totalJoltage);
console.log(Date.now() - startTime);
