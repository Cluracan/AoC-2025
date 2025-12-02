import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf-8").split(/\r\n/);

const getDisplacement = (instruction: string) => {
  const direction = instruction[0];
  const distance = Number(instruction.slice(1));
  const displacement = direction === "L" ? -1 * distance : distance;
  return displacement;
};

const getModulus = (value: number, modulus: number) => {
  return ((value % modulus) + modulus) % modulus;
};

const initialValue = { dialValue: 50, zeroCount: 0 };

const finalState = input.reduce((state, instruction) => {
  const displacement = getDisplacement(instruction);
  const nextDialValue = getModulus(state.dialValue + displacement, 100);
  const nextZeroCount =
    nextDialValue === 0 ? state.zeroCount : state.zeroCount + 1;
  return { dialValue: nextDialValue, zeroCount: nextZeroCount };
}, initialValue);

console.log(finalState);
