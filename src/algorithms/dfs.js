export const DFS_CODE = [
  "function DFS(node) {",
  "    visited.add(node);",
  "    stack.push(node);",
  "",
  "    while (stack.length > 0) {",
  "        current = stack.pop();",
  "        visit(current);",
  "",
  "        for (neighbor of current.neighbors) {",
  "            if (!visited.has(neighbor)) {",
  "                visited.add(neighbor);",
  "                stack.push(neighbor);",
  "            }",
  "        }",
  "    }",
  "}",
];

/*
 * DFS for Graph
 */
export function generateGraphDFSSteps(graphData, startNodeId) {
  const steps = [];

  if (
    !graphData ||
    !Array.isArray(graphData.nodes) ||
    !Array.isArray(graphData.edges) ||
    graphData.nodes.length === 0
  ) {
    return [
      {
        visited: [],
        currentNode: null,
        stack: [],
        description: "Graph is empty. Cannot start DFS.",
        line: 1,
        isComplete: true,
        success: false,
      },
    ];
  }

  const adjacency = {};

  graphData.nodes.forEach((node) => {
    adjacency[node.id] = [];
  });

  graphData.edges.forEach((edge) => {
    if (adjacency[edge.source] && adjacency[edge.target]) {
      adjacency[edge.source].push(edge.target);
      adjacency[edge.target].push(edge.source);
    }
  });

  if (!adjacency[startNodeId]) {
    return [
      {
        visited: [],
        currentNode: null,
        stack: [],
        description: `Start node "${startNodeId}" was not found.`,
        line: 1,
        isComplete: true,
        success: false,
      },
    ];
  }

  const stack = [startNodeId];
  const visited = new Set();

  steps.push({
    visited: [],
    currentNode: null,
    stack: [...stack],
    description: `Starting DFS from node ${startNodeId}.`,
    line: 1,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    steps.push({
      visited: [...visited],
      currentNode: current,
      stack: [...stack],
      description: `DFS visits node ${current}.`,
      line: 5,
    });

    const neighbors = adjacency[current] || [];

    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];

      if (!visited.has(neighbor)) {
        stack.push(neighbor);

        steps.push({
          visited: [...visited],
          currentNode: current,
          stack: [...stack],
          description: `Found unvisited neighbor ${neighbor} and pushed it onto the stack.`,
          line: 10,
        });
      }
    }
  }

  steps.push({
    visited: [...visited],
    currentNode: null,
    stack: [],
    description: `DFS complete. Visited ${visited.size} node${
      visited.size === 1 ? "" : "s"
    }.`,
    line: 15,
    isComplete: true,
    success: true,
  });

  return steps;
}

/*
 * DFS for 2D Grid Pathfinding
 */
export function generateGridDFSSteps(grid, start, end) {
  const steps = [];

  /*
   * Validate grid
   */
  if (!Array.isArray(grid) || grid.length === 0) {
    return [
      {
        visitedCells: [],
        currentCell: null,
        stackSize: 0,
        path: [],
        description: "Grid is empty. Cannot start DFS.",
        line: 11,
        isComplete: true,
        success: false,
      },
    ];
  }

  const rows = grid.length;

  const cols =
    Array.isArray(grid[0]) && grid[0].length > 0
      ? grid[0].length
      : 0;

  if (cols === 0) {
    return [
      {
        visitedCells: [],
        currentCell: null,
        stackSize: 0,
        path: [],
        description: "Grid has no columns. Cannot start DFS.",
        line: 11,
        isComplete: true,
        success: false,
      },
    ];
  }

  /*
   * Check whether a cell is valid
   */
  const isValidCell = (r, c) => {
    return (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      Array.isArray(grid[r]) &&
      grid[r][c] &&
      !grid[r][c].isWall
    );
  };

  /*
   * Validate start and end
   */
  if (
    !start ||
    !end ||
    !isValidCell(start.r, start.c) ||
    !isValidCell(end.r, end.c)
  ) {
    return [
      {
        visitedCells: [],
        currentCell: null,
        stackSize: 0,
        path: [],
        description:
          "Start or target cell is invalid or blocked.",
        line: 11,
        isComplete: true,
        success: false,
      },
    ];
  }

  /*
   * DFS uses a Stack
   */
  const stack = [
    {
      r: start.r,
      c: start.c,
    },
  ];

  /*
   * Store visited cells
   */
  const visited = new Set([
    `${start.r},${start.c}`,
  ]);

  /*
   * Store parent of every visited cell.
   * This is used later to reconstruct the path.
   */
  const parent = {};

  const visitedCells = [];

  /*
   * Initial step
   */
  steps.push({
    visitedCells: [],
    currentCell: {
      r: start.r,
      c: start.c,
    },
    stackSize: 1,
    path: [],
    description: `Starting DFS from (${start.r}, ${start.c}). Start cell pushed onto Stack.`,
    line: 2,
  });

  /*
   * Directions:
   *
   * Up
   * Right
   * Down
   * Left
   */
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  let found = false;

  /*
   * DFS main loop
   */
  while (stack.length > 0) {
    /*
     * Remove the top element from stack
     */
    const curr = stack.pop();

    /*
     * Mark current cell as visited
     */
    visitedCells.push({
      r: curr.r,
      c: curr.c,
    });

    steps.push({
      visitedCells: [...visitedCells],
      currentCell: {
        r: curr.r,
        c: curr.c,
      },
      stackSize: stack.length,
      path: [],
      description: `DFS visits cell (${curr.r}, ${curr.c}). Exploring its neighbors.`,
      line: 5,
    });

    /*
     * Check whether target is reached
     */
    if (
      curr.r === end.r &&
      curr.c === end.c
    ) {
      found = true;
      break;
    }

    /*
     * Add neighbors to stack
     *
     * Reverse order is used because Stack follows
     * Last-In-First-Out (LIFO).
     */
    for (let i = dirs.length - 1; i >= 0; i--) {
      const [dr, dc] = dirs[i];

      const nr = curr.r + dr;
      const nc = curr.c + dc;

      const key = `${nr},${nc}`;

      /*
       * Check:
       * 1. Cell is inside grid
       * 2. Cell is not a wall
       * 3. Cell is not already visited
       */
      if (
        isValidCell(nr, nc) &&
        !visited.has(key)
      ) {
        /*
         * Mark as visited when pushing
         * to avoid adding the same cell multiple times.
         */
        visited.add(key);

        /*
         * Store parent
         */
        parent[key] = {
          r: curr.r,
          c: curr.c,
        };

        /*
         * Push neighbor into stack
         */
        stack.push({
          r: nr,
          c: nc,
        });

        /*
         * Add visualization step
         */
        steps.push({
          visitedCells: [...visitedCells],
          currentCell: {
            r: curr.r,
            c: curr.c,
          },
          stackSize: stack.length,
          path: [],
          description: `Found unvisited neighbor (${nr}, ${nc}) and pushed it onto the Stack.`,
          line: 10,
        });
      }
    }
  }

  /*
   * Reconstruct path if target was found
   */
  const path = [];

  if (found) {
    let current = {
      r: end.r,
      c: end.c,
    };

    path.unshift({
      r: current.r,
      c: current.c,
    });

    /*
     * Move backwards using parent references
     * until we reach the start cell.
     */
    while (
      current.r !== start.r ||
      current.c !== start.c
    ) {
      const key = `${current.r},${current.c}`;

      const previous = parent[key];

      /*
       * Safety check
       */
      if (!previous) {
        break;
      }

      current = previous;

      path.unshift({
        r: current.r,
        c: current.c,
      });
    }

    /*
     * Final successful step
     */
    steps.push({
      visitedCells: [...visitedCells],
      currentCell: {
        r: end.r,
        c: end.c,
      },
      stackSize: stack.length,
      path: [...path],
      description: `Target reached! DFS found a path of ${path.length} cells.`,
      line: 11,
      isComplete: true,
      success: true,
    });
  } else {
    /*
     * Target was not found
     */
    steps.push({
      visitedCells: [...visitedCells],
      currentCell: null,
      stackSize: 0,
      path: [],
      description:
        "Target could not be reached. All accessible branches were explored.",
      line: 11,
      isComplete: true,
      success: false,
    });
  }

  return steps;
}