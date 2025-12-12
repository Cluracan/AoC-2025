import { readFileSync } from "fs";
import { startupSnapshot } from "v8";

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

const countRoutesWithExclusions = (
  startNode: string,
  endNode: string,
  exclusion: string
) => {
  if (hashMap.has(`${startNode}-${endNode}`)) {
    return hashMap.get(`${startNode}-${endNode}`);
  }
  if (startNode === endNode) {
    return 0;
  }

  const edges = edgeMap.get(startNode);
  if (!edges) {
    return 0;
  }
  let routes = 0;
  edges.forEach((nextNode) => {
    if (nextNode === endNode) {
      routes++;
    } else if (nextNode !== exclusion) {
      routes += countRoutesWithExclusions(nextNode, endNode, exclusion);
    }
  });
  hashMap.set(`${startNode}-${endNode}`, routes);
  return routes;
};

const svrFftDacOut =
  countRoutesWithExclusions("svr", "fft", "dac") *
  countRoutesWithExclusions("fft", "dac", "svr") *
  countRoutesWithExclusions("dac", "out", "fft");
const svrDacFftOut =
  countRoutesWithExclusions("svr", "dac", "fft") *
  countRoutesWithExclusions("dac", "fft", "svr") *
  countRoutesWithExclusions("fft", "out", "dac");

console.log(svrDacFftOut + svrFftDacOut);
