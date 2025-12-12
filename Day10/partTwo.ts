import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => {
    const joltsRegex = /\{([\d\,]+)\}/;
    const jolts = line.match(joltsRegex)[1].split(",").map(Number);

    const buttonRegex = /\(([\d\,]+)\)/g;
    const buttons = [...line.matchAll(buttonRegex)].map((match) =>
      match[1].split(",").map(Number)
    );

    return { jolts, buttons };
  });

const getAugmentedMatrix = (buttons: number[][], target: number[]) => {
  const augmentedMatrix = Array.from({ length: target.length }, () =>
    Array.from({ length: buttons.length }, () => 0)
  );
  for (let row = 0; row < target.length; row++) {
    for (let col = 0; col < buttons.length; col++) {
      if (buttons[col].includes(row)) {
        augmentedMatrix[row][col] = 1;
      }
    }
    augmentedMatrix[row].push(target[row]);
  }
  return augmentedMatrix;
};

const snap = (x: number): number => {
  const errorAllowance = 1e-9;

  if (Math.abs(x) < errorAllowance) return 0;
  if (Math.abs(x - 1) < errorAllowance) return 1;
  if (Math.abs(x + 1) < errorAllowance) return -1;
  return x;
};

const toReducedRowEchelonForm = (matrix: number[][]) => {
  let lead = 0;
  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  for (let r = 0; r < rowCount; r++) {
    if (colCount <= lead) {
      return matrix;
    }
    let i = r;
    // Find the next row with a non-zero lead column
    while (matrix[i][lead] === 0) {
      i = i + 1;
      if (i === rowCount) {
        i = r;
        lead++;
        if (colCount === lead) {
          return matrix;
        }
      }
    }
    // Swap row r with row i
    const rowR = matrix[r].slice();
    matrix[r] = matrix[i].slice();
    matrix[i] = rowR;

    // Normalise row r so leading entry is 1
    const leadValue = matrix[r][lead];
    if (leadValue !== 0) {
      for (let col = 0; col < colCount; col++) {
        matrix[r][col] = snap(matrix[r][col] / leadValue);
      }
    }

    // Eliminate all other entries from this column
    for (let row = 0; row < rowCount; row++) {
      if (row === r) continue;
      const leadValue = matrix[row][lead];
      for (let col = 0; col < colCount; col++) {
        matrix[row][col] = snap(matrix[row][col] - leadValue * matrix[r][col]);
      }
    }
    lead++;
  }
  return matrix.map((row) => row.map((v) => snap(v)));
};

const getFreeVariableIndices = (matrix: number[][]) => {
  const variableCount = matrix[0].length - 1;
  const pivotColumns = new Set<number>();
  for (let row = 0; row < matrix.length; row++) {
    const pivot = matrix[row].findIndex((v) => v !== 0);
    if (pivot >= 0 && pivot < variableCount) {
      pivotColumns.add(pivot);
    }
  }
  const freeVariables = [];
  for (let i = 0; i < variableCount; i++) {
    if (!pivotColumns.has(i)) {
      freeVariables.push(i);
    }
  }
  return freeVariables;
};

const findMaxPresses = (
  index: number,
  buttons: number[][],
  jolts: number[]
) => {
  let maxPresses = Infinity;
  buttons[index].forEach((joltIndex) => {
    maxPresses = Math.min(maxPresses, jolts[joltIndex]);
  });
  return maxPresses;
};

const solveWithFreeVariables = (
  matrix: number[][],
  freeAssignments: number[][],
  buttons?: number[][],
  jolts?: number[]
): number[] | null => {
  const variableCount = matrix[0].length - 1;
  const result = Array.from({ length: variableCount }, () => 0);
  const epsilon = 1e-9;

  // Set free variables
  for (const [varIndex, value] of freeAssignments) {
    result[varIndex] = value;
  }

  // Solve for pivot variables
  for (let row = 0; row < matrix.length; row++) {
    const pivotCol = matrix[row].findIndex((v) => v !== 0);
    if (pivotCol < 0 || pivotCol >= variableCount) {
      continue;
    }

    const rhs = matrix[row][matrix[0].length - 1];
    let sum = rhs;

    // Subtract contributions from all other variables
    for (let col = 0; col < variableCount; col++) {
      if (col !== pivotCol) {
        sum -= matrix[row][col] * result[col];
      }
    }

    // Round to nearest integer if very close
    sum = Math.abs(sum - Math.round(sum)) < epsilon ? Math.round(sum) : sum;
    result[pivotCol] = sum;

    // Check if solution is valid (non-negative integer)
    if (
      result[pivotCol] < -epsilon ||
      Math.abs(result[pivotCol] - Math.round(result[pivotCol])) > epsilon
    ) {
      return null;
    }
  }

  // Round all results and check validity
  for (let i = 0; i < result.length; i++) {
    result[i] = Math.round(result[i]);
    if (result[i] < 0) {
      return null;
    }
  }

  // Verify solution if buttons and jolts provided
  if (buttons && jolts) {
    const verification = Array(jolts.length).fill(0);
    for (let i = 0; i < result.length; i++) {
      for (const joltIndex of buttons[i]) {
        verification[joltIndex] += result[i];
      }
    }
    for (let i = 0; i < jolts.length; i++) {
      if (verification[i] !== jolts[i]) {
        return null;
      }
    }
  }

  return result;
};

const generateSolutions = (
  matrix: number[][],
  freeVariables: number[],
  buttons: number[][],
  jolts: number[]
) => {
  if (freeVariables.length === 0) {
    const solution = solveWithFreeVariables(matrix, [], buttons, jolts);
    if (solution === null) return Infinity;
    return solution.reduce((acc, cur) => acc + cur, 0);
  }

  // Get max values for each free variable
  const maxValues = freeVariables.map((freeVar) =>
    findMaxPresses(freeVar, buttons, jolts)
  );

  // Generate all combinations using recursive approach
  let bestResult = Infinity;

  const tryAllCombinations = (index: number, assignments: number[][]) => {
    if (index === freeVariables.length) {
      // Try this combination
      const solution = solveWithFreeVariables(
        matrix,
        assignments,
        buttons,
        jolts
      );
      if (solution !== null) {
        const total = solution.reduce((acc, cur) => acc + cur, 0);
        bestResult = Math.min(bestResult, total);
      }
      return;
    }

    const freeVar = freeVariables[index];
    const maxVal = maxValues[index];

    for (let val = 0; val <= maxVal; val++) {
      tryAllCombinations(index + 1, [...assignments, [freeVar, val]]);
    }
  };

  tryAllCombinations(0, []);
  return bestResult;
};

let result = 0;

input.forEach((x, index) => {
  const augmentedMatrix = getAugmentedMatrix(x.buttons, x.jolts);
  const rref = toReducedRowEchelonForm(augmentedMatrix);
  const freeVariables = getFreeVariableIndices(rref);
  const solution = generateSolutions(rref, freeVariables, x.buttons, x.jolts);

  result += solution;
});

console.log(result);
