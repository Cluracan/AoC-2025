import { readFileSync } from "fs";

interface State {
  locations: Map<number, number>;
  splitCount: number;
}

const input = readFileSync("input.txt", "utf-8").split(/\r\n/);
const startLocation = input[0].indexOf("S");

const initialState = {
  locations: new Map([[startLocation, 1]]),
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
  const nextLocations = new Map(state.locations);
  let nextSplitCount = state.splitCount;
  splitters.forEach((splitter) => {
    const i = splitter.index;
    if (nextLocations.has(i)) {
      const beamCount = nextLocations.get(i);
      nextLocations.delete(i);

      for (const j of [i - 1, i + 1]) {
        if (nextLocations.has(j)) {
          nextLocations.set(j, nextLocations.get(j) + beamCount);
        } else {
          nextLocations.set(j, beamCount);
        }
      }
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

let beamCount = 0;
finalState.locations.values().forEach((v) => (beamCount += v));
console.log(beamCount);
