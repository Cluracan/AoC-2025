import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf-8").split(/\r\n/);

const parseInstruction = (instruction: string) => {
  const direction = instruction[0];
  const distance = Number(instruction.slice(1));
  const displacement = direction === "L" ? -1 * distance : distance;
  const revolutionCount = Math.floor(distance / 100);
  return { displacement, revolutionCount };
};

const getModulus = (value: number, modulus: number) => {
  return ((value % modulus) + modulus) % modulus;
};

const hasCrossedZero = (
  startValue: number,
  endValue: number,
  displacement: number
) => {
  // Postive displacement should increase dial value, negative displacement should decrease it. If not, we've crossed zero
  if (displacement >= 0) {
    return endValue < startValue;
  } else {
    return endValue > startValue;
  }
};

const initialState = { dialValue: 50, zeroCount: 0 };
const finalState = input.reduce((state, instruction) => {
  const { displacement, revolutionCount } = parseInstruction(instruction);
  const nextDialValue = getModulus(state.dialValue + displacement, 100);

  let nextZeroCount =
    state.zeroCount + revolutionCount + (nextDialValue === 0 ? 1 : 0);

  if (
    hasCrossedZero(state.dialValue, nextDialValue, displacement) &&
    nextDialValue !== 0 &&
    state.dialValue !== 0
  ) {
    nextZeroCount++;
  }

  return { dialValue: nextDialValue, zeroCount: nextZeroCount };
}, initialState);

console.log(finalState);
