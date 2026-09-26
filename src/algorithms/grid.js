
export function createInitialGrid(rows = 11, cols = 21) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      isWall: false,
    }))
  );
}

export function generateRandomMaze(
  rows = 11,
  cols = 21,
  start = { r: 5, c: 3 },
  end = { r: 5, c: 17 }
) {
  const grid = createInitialGrid(rows, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isStart =
        r === start.r && c === start.c;

      const isEnd =
        r === end.r && c === end.c;

      if (!isStart && !isEnd) {
        grid[r][c].isWall = Math.random() < 0.25;
      }
    }
  }

  // Keep a route open between the start and target.
  // This ensures the generated maze is solvable.
  let r = start.r;
  let c = start.c;

  while (c !== end.c) {
    grid[r][c].isWall = false;
    c += c < end.c ? 1 : -1;
  }

  while (r !== end.r) {
    grid[r][c].isWall = false;
    r += r < end.r ? 1 : -1;
  }

  grid[end.r][end.c].isWall = false;

  return grid;
}