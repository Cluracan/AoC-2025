// https://www.designgurus.io/course-play/grokking-the-coding-interview/doc/introduction-to-monotonic-stack

import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => line.split("").map(Number));

const startTime = Date.now();
const maximiseJoltage = (batteries: number[], joltageLength: number) => {
  let skipsAvailable = batteries.length - joltageLength;
  const stack = [];

  for (let i = 0; i < batteries.length; i++) {
    const currentValue = batteries[i];
    while (
      stack.length > 0 &&
      stack[stack.length - 1] < currentValue &&
      skipsAvailable > 0
    ) {
      stack.pop();
      skipsAvailable--;
    }

    if (stack.length < joltageLength) {
      stack.push(currentValue);
    } else {
      skipsAvailable--;
    }
  }

  return stack.reduce((total, currentValue) => total * 10 + currentValue, 0);
};

let totalJoltage = 0;
input.forEach((bank) => (totalJoltage += maximiseJoltage(bank, 12)));
console.log(totalJoltage);
console.log(Date.now() - startTime);
