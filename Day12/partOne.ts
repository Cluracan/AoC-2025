import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => {
    const [sizeString, shapeString] = line.split(": ");
    const size = sizeString.split("x").map(Number);
    const shapeCount = shapeString.split(" ").map(Number);
    return { size, shapeCount };
  });

const shapes = readFileSync("shapes.txt", "utf-8")
  .split(/\r\n\r\n/)
  .map((shape) => {
    const shapeHolder = shape.split(/\r\n/);
    shapeHolder.shift();
    return shapeHolder;
  });

console.log(input.length);

// Filter impossible shapes
const possibleInput = input.filter((region) => {
  const regionArea = region.size[0] * region.size[1];
  const shapeRequirements = region.shapeCount;
  const simpleAreaCount = shapeRequirements.reduce(
    (acc, cur) => acc + 9 * cur,
    0
  );
  return regionArea >= simpleAreaCount;
});

console.log(possibleInput.length);
