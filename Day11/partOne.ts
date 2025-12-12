import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => {
    const [start, edgesString] = line.split(": ");
    const edges = edgesString.split(" ");
    return { start, edges };
  });

const edgeMap = new Map<string, string[]>();
input.forEach((node) => edgeMap.set(node.start, node.edges));

const hashMap = new Map<string, number>();

const countRoutesOut = (startNode: string) => {
  if (hashMap.has(startNode)) {
    return hashMap.get(startNode);
  }
  const edges = edgeMap.get(startNode);
  let routes = 0;
  edges.forEach((nextNode) => {
    if (nextNode === "out") {
      routes++;
    } else {
      routes += countRoutesOut(nextNode);
    }
  });
  hashMap.set(startNode, routes);
  return routes;
};

console.log(countRoutesOut("you"));
