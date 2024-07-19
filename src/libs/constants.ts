import { Cell, Difficulty } from "./types";

// TODO switch this to an array
// export const difficulties: Record<string, Difficulty> = {
//   easy: {
//     name: "easy",
//     rows: 10,
//     cellsPerRow: 10,
//     mineCount: 20,
//   },
//   medium: {
//     name: "medium",
//     rows: 20,
//     cellsPerRow: 20,
//     mineCount: 50,
//   },
// };

export const difficulties: Difficulty[] = [
  {
    name: "easy",
    rows: 10,
    cellsPerRow: 10,
    mineCount: 20,
  },
  {
    name: "medium",
    rows: 20,
    cellsPerRow: 20,
    mineCount: 100,
  },
];

export const defaultCell: Cell = {
  isMine: false,
  isFlagged: false,
  isClicked: false,
  neighbors: 0,
};
