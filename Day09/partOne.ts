import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => line.split(",").map(Number));

let maxArea = 0;

for (let i = 0; i < input.length; i++) {
  for (let j = i + 1; j < input.length; j++) {
    const width = Math.abs(input[i][0] - input[j][0] + 1);
    const height = Math.abs(input[i][1] - input[j][1] + 1);
    const area = width * height;

    if (area > maxArea) {
      maxArea = area;
    }
  }
}

console.log(maxArea);
