import { defaultCell } from "./constants";
import { Cell, Difficulty } from "./types";

export const generateRows = (rows: number, cellsPerRow: number, cell: Cell) => {
  const r: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    r[i] = [];
    for (let j = 0; j < cellsPerRow; j++) {
      r[i].push({ ...cell });
    }
  }
  return r;
};

export const getRandNotInArr: (
  min: number,
  max: number,
  arr: number[],
) => number = (min, max, arr) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  if (Array.isArray(arr) && arr.includes(num)) {
    return getRandNotInArr(min, max, arr);
  }
  return num;
};

export const scatterMines = (
  rows: Cell[][],
  mineCount: number,
  excludeCell?: [rowIndex: number, cellIndex: number],
) => {
  const rowCount = rows.length;
  const cellsPerRow = rows[0].length;
  const copyRows = [...rows];
  const forbidden: number[][] = [];
  if (excludeCell) {
    const [r, c] = excludeCell;
    forbidden[r] = [c];
  }
  for (let i = 0; i < mineCount; i++) {
    const rowIndex = getRandNotInArr(0, rowCount - 1, []);
    const cellIndex = getRandNotInArr(0, cellsPerRow - 1, forbidden[rowIndex]);
    copyRows[rowIndex][cellIndex].isMine = true;
    if (forbidden[rowIndex]) {
      forbidden[rowIndex].push(cellIndex);
      continue;
    }
    forbidden[rowIndex] = [cellIndex];
  }
  return copyRows;
};

export const calculateNeighbors = (rows: Cell[][]) => {
  const copyRows = [...rows];
  copyRows.forEach((row, ri) => {
    const prevRow = rows[ri - 1] ?? [];
    const nextRow = rows[ri + 1] ?? [];
    row.forEach((cell, ci) => {
      if (cell.isMine) return;
      let neighborCount = 0;
      const neighborCells = {
        left: row[ci - 1],
        right: row[ci + 1],
        tLeft: prevRow[ci - 1],
        tMiddle: prevRow[ci],
        tRight: prevRow[ci + 1],
        bLeft: nextRow[ci - 1],
        bMiddle: nextRow[ci],
        bRight: nextRow[ci + 1],
      };

      Object.entries(neighborCells).forEach(([_, neighbor]) => {
        if (!neighbor) return;
        if (!neighbor.isMine) return;
        neighborCount += 1;
      });

      copyRows[ri][ci].neighbors = neighborCount;
    });
  });

  return copyRows;
};

export const doZeroOpen = (
  rows: Cell[][],
  startRowIndex: number,
  startCellIndex: number,
) => {
  //   const copyRows = [...rows];
  const copyRows = rows;

  const row = copyRows[startRowIndex];
  const cell = row[startCellIndex];
  // because this can be recursive we need to ensure the target cell is clicked
  cell.isClicked = true;
  const isZero = cell.neighbors === 0;

  //   const prevRow = copyRows[startRowIndex - 1];
  //   const nextRow = copyRows[startRowIndex + 1];
  const prevRow = startRowIndex - 1;
  const nextRow = startRowIndex + 1;

  const neighbors: Record<string, [ri: number, ci: number]> = {
    left: [startRowIndex, startCellIndex - 1],
    right: [startRowIndex, startCellIndex + 1],
    tLeft: [prevRow, startCellIndex - 1],
    tMiddle: [prevRow, startCellIndex],
    tRight: [prevRow, startCellIndex + 1],
    bLeft: [nextRow, startCellIndex - 1],
    bMiddle: [nextRow, startCellIndex],
    bRight: [nextRow, startCellIndex + 1],
  };

  Object.values(neighbors).forEach(([ri, ci]) => {
    const r = copyRows[ri];
    if (!r) return;
    const c = r[ci];
    if (!c) return;
    if (c.isMine || c.isClicked || c.isFlagged) return;
    if (isZero) {
      c.isClicked = true;
    }

    if (c.neighbors === 0) {
      doZeroOpen(copyRows, ri, ci);
    }
  });

  //   console.log(copyRows);

  return copyRows;
};

export const initRows = ({ rows, cellsPerRow, mineCount }: Difficulty) => {
  const gen = generateRows(rows, cellsPerRow, defaultCell);
  const withMines = scatterMines(gen, mineCount);
  return calculateNeighbors(withMines);
};

export const paddZeroes = (num: number, zeroes: number) => {
  const str = num.toString();
  if (str.length > zeroes) return str;
  let z = "";
  for (let i = 0; i < zeroes - str.length; i++) {
    z += "0";
  }
  return z + str;
};
