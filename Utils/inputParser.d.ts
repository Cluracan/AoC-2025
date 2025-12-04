export class InputParser {
  input: string;
  constructor(input: string);
  toArray(): (string | number)[];
  toGrid(): (string | number)[][];
  toBorderedGrid(
    borderWidth?: number,
    borderSymbol?: string
  ): (string | number)[][];
}
