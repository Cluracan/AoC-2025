import { readFileSync } from "fs";
import { InputParser } from "../Utils/inputParser.js";

const input: string = readFileSync("input.txt", "utf-8");

const puzzleGrid = new InputParser(input).toGrid();
const startTime = Date.now();
const neighbourCountbyLocation = new Map<string, number>();
const rollsByNeighbourCount = new Map<number, Set<string>>();
for (let i = 0; i < 9; i++) {
  rollsByNeighbourCount.set(i, new Set());
}

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
      neighbourCountbyLocation.set(location, count);
      rollsByNeighbourCount.get(count).add(location);
    }
  }
}

// Remove available rolls
const initialRollCount = neighbourCountbyLocation.size;
const availableRolls = () => {
  return (
    rollsByNeighbourCount.get(0).size +
      rollsByNeighbourCount.get(1).size +
      rollsByNeighbourCount.get(2).size +
      rollsByNeighbourCount.get(3).size >
    0
  );
};

while (availableRolls()) {
  const rollLocations = new Set<string>();
  for (let i = 0; i < 4; i++) {
    const locations = rollsByNeighbourCount.get(i);
    locations.forEach((location) => rollLocations.add(location));
  }
  rollLocations.forEach((location) => {
    const count = neighbourCountbyLocation.get(location);
    rollsByNeighbourCount.get(count).delete(location);
    neighbourCountbyLocation.delete(location);
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
          neighbourCountbyLocation.set(searchLocation, oldCount - 1);
          rollsByNeighbourCount.get(oldCount).delete(searchLocation);
          rollsByNeighbourCount.get(oldCount - 1).add(searchLocation);
        }
      }
    }
  });
}

const finalRollCount = neighbourCountbyLocation.size;
console.log(initialRollCount - finalRollCount);
console.log(Date.now() - startTime);
