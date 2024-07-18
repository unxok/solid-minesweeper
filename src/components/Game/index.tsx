import {
  createSignal,
  createEffect,
  Index,
  onMount,
  onCleanup,
} from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
import { createStore, produce } from "solid-js/store";

const gameWidth = 450;
const gameHeight = 450;

let isFirstClick = true;

export const Game = () => {
  const diff = difficulties.medium;
  const rowHeight = gameHeight / diff.rows;
  const cellWidth = gameWidth / diff.cellsPerRow;
  const initialRows = generateRows(diff.rows, diff.cellsPerRow, defaultCell);
  const withMines = scatterMines(initialRows, diff.mineCount);
  const withNeighbors = calculateNeighbors(withMines);

  const [rows, setRows] = createStore(withNeighbors);
  const [scale, setScale] = createSignal(1);
  //   const [transform, setTransform] = createSignal([0, 0]);
  //   const [transform, setTransform] = createStore([0, 0]);
  const [translateX, setTranslateX] = createSignal(0);
  const [translateY, setTranslateY] = createSignal(0);
  let mousePosition = [0, 0];
  //   let isMouseDown = false;
  const [isMouseDown, setMouseDown] = createSignal(false);
  const [isPanning, setPanning] = createSignal(false);

  createEffect(() => {
    console.log(translateX(), translateY());
  });

  const onWheel = (e: Event) => {
    const s = (e as WheelEvent).deltaY;
    const sign = s / Math.abs(s);
    setScale((prev) => {
      const n = prev - sign * 0.1;
      if (prev < 0) return 0;
      if (prev > 3) return 3;
      return n;
    });
  };

  onMount(() => {
    window.addEventListener("wheel", onWheel);
  });

  onCleanup(() => {
    window.removeEventListener("wheel", onWheel);
  });

  /**
   * Update row store. Mutate the previous state, no need to return.
   * @param cb Callback function to mutate the state
   */
  const updateRows = (cb: (previous: Cell[][]) => void) => {
    setRows(produce(cb));
  };

  const handleFirstClickMine = (cellIndex: number, rowIndex: number) => {
    const newRows = generateRows(diff.rows, diff.cellsPerRow, defaultCell);
    const withMines = scatterMines(newRows, diff.mineCount, [
      rowIndex,
      cellIndex,
    ]);
    const withNeighbors = calculateNeighbors(withMines);
    withNeighbors[rowIndex][cellIndex].isClicked = true;
    setRows(withNeighbors);
    isFirstClick = false;
    return;
  };

  const onClick = (cell: Cell, cellIndex: number, rowIndex: number) => {
    if (isFirstClick && cell.isMine) {
      handleFirstClickMine(cellIndex, rowIndex);
    }
    if (isFirstClick) {
      isFirstClick = false;
    }
    updateRows((prev) => doZeroOpen(prev, rowIndex, cellIndex));
  };

  return (
    <div>
      game div
      <br />
      <div
        class="overflow-hidden"
        style={{
          width: gameWidth + "px",
          height: gameHeight + "px",
        }}
        onMouseDown={(e) => {
          mousePosition = [e.clientX, e.clientY];
          setMouseDown(true);
        }}
        onMouseMove={({ clientX, clientY }) => {
          if (!isMouseDown()) return;
          setPanning(true);
          //   console.log("move");
          const dx = clientX - mousePosition[0];
          const dy = clientY - mousePosition[1];
          //   console.log("dx: ", dx, " dy: ", dy);
          //   setTransform(([x, y]) => [x + dx, y + dy]);
          //   setTranslateX((prev) => prev + dx * 0.5);
          //   setTranslateY((prev) => prev + dy * 0.5);
          setTranslateX((prev) => prev + dx);
          setTranslateY((prev) => prev + dy);
          mousePosition = [clientX, clientY];
        }}
        onMouseUp={(e) => {
          setMouseDown(false);
          setPanning(false);
          e.preventDefault();
        }}
      >
        <div
          class=""
          style={{
            width: gameWidth + "px",
            height: gameHeight + "px",
            scale: scale(),
            translate: translateX() + "px " + translateY() + "px",
          }}
        >
          <Index each={rows}>
            {(row, rowIndex) => (
              <div
                class=""
                style={{ width: gameWidth + "px", height: rowHeight + "px" }}
              >
                <Index each={row()}>
                  {(cell, cellIndex) => (
                    <span
                      class={`inline-flex select-none items-center justify-center border-[.5px] transition-colors hover:bg-accent ${cell().isMine && cell().isClicked ? "bg-destructive" : cell().isClicked ? "bg-secondary" : "bg-background"}`}
                      style={{
                        width: cellWidth + "px",
                        height: rowHeight + "px",
                        "font-size": "80%",
                        "pointer-events": isPanning() ? "none" : "auto",
                      }}
                      onClick={() =>
                        !cell().isFlagged &&
                        onClick(cell(), cellIndex, rowIndex)
                      }
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateRows(
                          (prev) =>
                            (prev[rowIndex][cellIndex].isFlagged =
                              !cell().isFlagged),
                        );
                      }}
                    >
                      {cell().isClicked || true ? (
                        cell().isFlagged ? (
                          "#"
                        ) : cell().isMine ? (
                          "!"
                        ) : (
                          cell().neighbors || <>&nbsp;</>
                        )
                      ) : (
                        <>&nbsp;</>
                      )}
                    </span>
                  )}
                </Index>
              </div>
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};

type Difficulty = {
  rows: number;
  cellsPerRow: number;
  mineCount: number;
};

const difficulties: Record<string, Difficulty> = {
  easy: {
    rows: 10,
    cellsPerRow: 10,
    mineCount: 20,
  },
  medium: {
    rows: 20,
    cellsPerRow: 20,
    mineCount: 50,
  },
};

type Cell = {
  isMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
  neighbors: number;
};

const defaultCell: Cell = {
  isMine: false,
  isFlagged: false,
  isClicked: false,
  neighbors: 0,
};

const generateRows = (rows: number, cellsPerRow: number, cell: Cell) => {
  const r: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    r[i] = [];
    for (let j = 0; j < cellsPerRow; j++) {
      r[i].push({ ...cell });
    }
  }
  return r;
};

const getRandNotInArr: (min: number, max: number, arr: number[]) => number = (
  min,
  max,
  arr,
) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  if (Array.isArray(arr) && arr.includes(num)) {
    return getRandNotInArr(min, max, arr);
  }
  return num;
};

const scatterMines = (
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

const calculateNeighbors = (rows: Cell[][]) => {
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

const doZeroOpen = (
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
