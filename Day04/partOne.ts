import { readFileSync } from "fs";
import { InputParser } from "../Utils/inputParser.js";

const input: string = readFileSync("input.txt", "utf-8");

const puzzleGrid = new InputParser(input).toBorderedGrid(1, ".");

const maxNeighbours = 3;

const isAccessible = (row: number, col: number) => {
  let neighbourCount = 0;
  for (const dy of [-1, 0, 1]) {
    for (const dx of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) continue;
      if (puzzleGrid[row + dy][col + dx] === "@") {
        neighbourCount++;
      }
      if (neighbourCount > maxNeighbours) {
        return false;
      }
    }
  }
  return true;
};

let accessibleCount = 0;
const printGrid = new InputParser(input).toBorderedGrid(1, ".");

for (let i = 1; i < puzzleGrid.length - 1; i++) {
  for (let j = 1; j < puzzleGrid[0].length - 1; j++) {
    if (puzzleGrid[i][j] === "@" && isAccessible(i, j)) {
      accessibleCount++;
      printGrid[i][j] = "x";
    }
  }
}
printGrid.forEach((row) => console.log(...row));
console.log(accessibleCount);
