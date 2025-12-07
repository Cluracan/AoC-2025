import { readFileSync } from "fs";

interface State {
  locations: Set<number>;
  splitCount: number;
}

const input = readFileSync("input.txt", "utf-8").split(/\r\n/);
const startLocation = input[0].indexOf("S");

const initialState: State = {
  locations: new Set([startLocation]),
  splitCount: 0,
};

const regExp = /\^/g;
const getSplitterLocations = (line: string) => {
  return line.matchAll(regExp);
};

const updateState = (
  state: State,
  splitters: RegExpStringIterator<RegExpExecArray>
) => {
  const nextLocations = new Set(state.locations);
  let nextSplitCount = state.splitCount;
  splitters.forEach((splitter) => {
    const i = splitter.index;
    if (nextLocations.has(i)) {
      nextLocations.delete(i);
      nextLocations.add(i + 1);
      nextLocations.add(i - 1);
      nextSplitCount++;
    }
  });
  return { locations: nextLocations, splitCount: nextSplitCount };
};

const finalState = input.reduce((state, line) => {
  const splitters = getSplitterLocations(line);
  const nextState = updateState(state, splitters);
  return nextState;
}, initialState);

console.log(finalState.splitCount);
