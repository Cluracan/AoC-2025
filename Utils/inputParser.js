/*------------------
    InputParser
------------------*/

/*
toArray() rows of string -> 1d Array

toGrid()  rows of string -> 2d Array

toBorderedGrid(borderWidth = 1, borderSymbol = '#')    rows of string -> Bordered 2d Array


*/

export class InputParser {
  input;
  constructor(input) {
    this.input = input;
  }

  toArray() {
    let result = this.input
      .split(/\r\n/)
      .map((e) => (/\d/.test(e) ? Number(e) : e));
    return result;
  }

  toGrid() {
    let result = this.input
      .split(/\r\n/)
      .map((line) => line.split("").map((e) => (/\d/.test(e) ? Number(e) : e)));
    return result;
  }

  toBorderedGrid(borderWidth = 1, borderSymbol = "#") {
    let curGrid = this.toGrid();

    let result = curGrid.map((row) => {
      let borderedRow = row.slice();
      for (let i = 0; i < borderWidth; i++) {
        borderedRow.push(borderSymbol);
        borderedRow.unshift(borderSymbol);
      }
      return borderedRow;
    });
    for (let i = 0; i < borderWidth; i++) {
      let borderRow = Array(curGrid[0].length + borderWidth * 2).fill(
        borderSymbol
      );
      result.push(borderRow.slice());
      result.unshift(borderRow.slice());
    }

    return result;
  }
}
