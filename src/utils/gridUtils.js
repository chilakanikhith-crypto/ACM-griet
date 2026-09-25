// 2D Grid utilities for BFS and DFS pathfinding

export const GRID_ROWS = 11;
export const GRID_COLS = 21;

export function createInitialGrid(rows = GRID_ROWS, cols = GRID_COLS) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        r,
        c,
        isWall: false,
      });
    }
  }
  return grid;
}

export function generateRandomMaze(rows = GRID_ROWS, cols = GRID_COLS, start, end) {
  const grid = createInitialGrid(rows, cols);

  // Add random walls with ~28% density, avoiding start and end
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) {
        continue;
      }
      // Keep border mostly open
      if (Math.random() < 0.28) {
        grid[r][c].isWall = true;
      }
    }
  }

  // Clear 3x3 surrounding start and end to guarantee breathability
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const sr = start.r + dr;
      const sc = start.c + dc;
      if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) {
        grid[sr][sc].isWall = false;
      }

      const er = end.r + dr;
      const ec = end.c + dc;
      if (er >= 0 && er < rows && ec >= 0 && ec < cols) {
        grid[er][ec].isWall = false;
      }
    }
  }

  return grid;
}
