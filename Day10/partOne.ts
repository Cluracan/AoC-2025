import { readFileSync } from "fs";

/*
Lights              [..##.]
convert to binary    00110
*but* since buttons act on index L-R, a button [0] currently hits the largest power
of the light rather than the smallest. So reverse the light (rather than adjust each
button)
reverse             01100  (=12)
*/

/*
Buttons             [1,3]
Convert to binary   [01010] (=10)
*/

/*
Method
Applying XOR will 'switch' a light state when needed:
1101 ^ 1010 = 0111
Initial state = 0
*/

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => {
    const lightRegex = /\[(.*?)\]/;
    const lights = line
      .match(lightRegex)[1]
      .replaceAll("#", "1")
      .replaceAll(".", "0")
      .split("")
      .reverse()
      .join("");

    const buttonRegex = /\(([\d\,]+)\)/g;
    const buttons = [...line.matchAll(buttonRegex)]
      .map((match) => match[1])
      .map((m) =>
        m
          .split(",")
          .map(Number)
          .reduce((acc, cur) => acc + 2 ** cur, 0)
      );
    return { lights: parseInt(lights, 2), buttons };
  });

const getMinimumPresses = (target: number, buttons: number[]) => {
  let minimumCount = Infinity;
  const start = { buttons: buttons.slice(), count: 0, value: 0 };
  const stack = [start];
  while (stack.length > 0) {
    const { buttons, count, value } = stack.pop();
    for (const nextButton of buttons) {
      const nextCount = count + 1;
      if (nextCount >= minimumCount) {
        continue;
      }
      const nextValue = value ^ nextButton;
      if (nextValue === target) {
        minimumCount = Math.min(minimumCount, nextCount);
        continue;
      }
      const nextButtons = buttons.filter((b) => b !== nextButton);
      stack.push({
        buttons: nextButtons,
        count: nextCount,
        value: nextValue,
      });
    }
  }
  return minimumCount;
};

let result = 0;
input.forEach(({ lights, buttons }) => {
  result += getMinimumPresses(lights, buttons);
});

console.log(result);
