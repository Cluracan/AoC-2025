import { readFileSync } from "fs";
const input = readFileSync("test.txt", "utf-8").split(/\r\n/);

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

const operatorLine = input.pop().trim().split(/\s+/);
const operandLines = input.map((line) => line.trim().split(/\s+/).map(Number));

const initialState = operatorLine.map((e) => {
  if (!isOperator(e)) {
    throw new Error(`Invalid operator ${e}`);
  }
  return { total: identity[e], operator: e };
});

const partOneTotals = operandLines.reduce((state, line) => {
  return state.map((currentState, i) => ({
    ...currentState,
    total: applyOperation[currentState.operator](currentState.total, line[i]),
  }));
}, initialState);

console.log(partOneTotals.reduce((a, b) => a + b.total, 0));
