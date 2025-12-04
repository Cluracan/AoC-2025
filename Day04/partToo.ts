import { readFileSync } from "fs";
import { InputParser } from "../Utils/inputParser.js";

const input: string = readFileSync("input.txt", "utf-8");

const puzzleGrid = new InputParser(input).toGrid();
const startTime = Date.now();

const neighbourCountbyLocation = new Map<string, number>();
const removeableRolls = new Set<string>();

const countNeighbours = (
  row: number,
  col: number,
  array: (string | number)[][],
  searchString: string
) => {
  let count = 0;
  for (const rowInc of [-1, 0, 1]) {
    for (const colInc of [-1, 0, 1]) {
      if (rowInc === 0 && colInc === 0) {
        continue;
      }
      const searchCol = col + colInc;
      const searchRow = row + rowInc;
      if (
        searchRow < 0 ||
        searchRow >= array.length ||
        searchCol < 0 ||
        searchCol >= array[0].length
      ) {
        continue;
      }

      if (array[searchRow][searchCol] === searchString) {
        count++;
      }
    }
  }
  return count;
};

// Initialise maps
for (let i = 0; i < puzzleGrid.length; i++) {
  for (let j = 0; j < puzzleGrid[0].length; j++) {
    if (puzzleGrid[i][j] === "@") {
      const location = `${i}x${j}`;
      const count = countNeighbours(i, j, puzzleGrid, "@");
      if (count >= 4) {
        neighbourCountbyLocation.set(location, count);
      } else {
        removeableRolls.add(location);
      }
    }
  }
}

// Remove available rolls
const initialRollCount = neighbourCountbyLocation.size + removeableRolls.size;

while (removeableRolls.size > 0) {
  const queue = Array.from(removeableRolls);
  removeableRolls.clear();
  for (const location of queue) {
    const [row, col] = location.split("x").map(Number);

    for (const rowInc of [-1, 0, 1]) {
      for (const colInc of [-1, 0, 1]) {
        if (rowInc === 0 && colInc === 0) {
          continue;
        }
        const searchRow = row + rowInc;
        const searchCol = col + colInc;
        const searchLocation = `${searchRow}x${searchCol}`;
        const oldCount = neighbourCountbyLocation.get(searchLocation);
        if (oldCount !== undefined) {
          const newCount = oldCount - 1;
          if (oldCount > 4) {
            neighbourCountbyLocation.set(searchLocation, newCount);
          } else {
            neighbourCountbyLocation.delete(searchLocation);
            removeableRolls.add(searchLocation);
          }
        }
      }
    }
  }
}

const finalRollCount = neighbourCountbyLocation.size;
console.log(initialRollCount - finalRollCount);
console.log(Date.now() - startTime);
