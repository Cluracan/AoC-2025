import { readFileSync } from "fs";
const input = readFileSync("input.txt", "utf-8").split(/\r\n/);

interface State {
  total: number;
  operator: Operator;
}

const applyOperation = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b,
} as const;
type Operator = keyof typeof applyOperation;

const identity: Record<Operator, number> = {
  "+": 0,
  "*": 1,
};

const isOperator = (value: string): value is Operator => {
  return value in applyOperation;
};

const rotateAnticlockwise = (matrix: string[][]): string[][] => {
  const height = matrix.length;
  const width = matrix[0].length;
  const rotatedArray = Array.from({ length: width }, (_, i) =>
    Array.from({ length: height }, (_, j) => matrix[j][width - i - 1])
  );
  return rotatedArray;
};

const splitByZero = (values: number[]) => {
  const result: number[][] = [];
  let line: number[] = [];
  for (let i = 0; i < values.length; i++) {
    let curValue = values[i];
    if (curValue === 0) {
      result.push(line);
      line = [];
    } else {
      line.push(curValue);
    }
  }
  result.push(line);
  return result;
};

const operatorLine = [...input.pop().trim().split(/\s+/)].reverse();

const inputDigits = input.map((line) => line.split(""));
const operandDigits = rotateAnticlockwise(inputDigits);

const operandValues = operandDigits.map((line) => Number(line.join("")));
const operandLines = splitByZero(operandValues);

const initialState = operatorLine.map((e) => {
  if (!isOperator(e)) {
    throw new Error(`Invalid operator ${e}`);
  }
  return { total: identity[e], operator: e };
});

const partTwoTotals = operandLines.map((line, index) => {
  return line.reduce((currentState, v) => {
    return {
      ...currentState,
      total: applyOperation[currentState.operator](currentState.total, v),
    };
  }, initialState[index]);
});

console.log(partTwoTotals.reduce((a, b) => a + b.total, 0));
