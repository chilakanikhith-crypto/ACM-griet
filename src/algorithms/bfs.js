// Breadth-First Search (BFS) Step Generator for Graph and Grid

export const BFS_CODE = [
  { line: 1, text: "function BFS(graph, start):" },
  { line: 2, text: "  queue = new Queue([start])" },
  { line: 3, text: "  visited = new Set([start])" },
  { line: 4, text: "  while queue is not empty:" },
  { line: 5, text: "    curr = queue.dequeue()" },
  { line: 6, text: "    for neighbor in graph[curr]:" },
  { line: 7, text: "      if neighbor not in visited:" },
  { line: 8, text: "        visited.add(neighbor)" },
  { line: 9, text: "        queue.enqueue(neighbor)" },
  { line: 10, text: "  return visited" },
];


// ============================================================
// GRAPH BFS
// ============================================================

export function generateGraphBFSSteps(graphData, startNodeId) {
  const steps = [];

  const adj = graphData?.adj || {};

  if (!startNodeId || !adj[startNodeId]) {
    return [
      {
        queue: [],
        currentNode: null,
        examiningNeighbor: null,
        visited: [],
        traversedEdges: [],
        levels: {},
        description: "Invalid BFS starting node.",
        line: 1,
        isComplete: true,
        success: false,
      },
    ];
  }

  const queue = [startNodeId];

  const visited = [startNodeId];

  const visitedSet = new Set([startNodeId]);

  const traversedEdges = new Set();

  const parentMap = {};

  const levels = {
    [startNodeId]: 0,
  };


  // Initial step
  steps.push({
    queue: [...queue],
    currentNode: null,
    examiningNeighbor: null,
    visited: [...visited],
    traversedEdges: Array.from(traversedEdges),
    levels: { ...levels },

    description:
      `Initialized BFS. Enqueued starting node "${startNodeId}" into Queue.`,

    line: 2,
  });


  // BFS traversal
  while (queue.length > 0) {
    const curr = queue.shift();


    // Dequeue step
    steps.push({
      queue: [...queue],

      currentNode: curr,

      examiningNeighbor: null,

      visited: [...visited],

      traversedEdges: Array.from(traversedEdges),

      levels: { ...levels },

      description:
        `Dequeued node "${curr}" from front of Queue. Exploring its neighbors.`,

      line: 5,
    });


    const neighbors = adj[curr] || [];


    // Explore neighbors
    for (const neighbor of neighbors) {
      const edgeKey = [curr, neighbor].sort().join("-");


      // Examine neighbor
      steps.push({
        queue: [...queue],

        currentNode: curr,

        examiningNeighbor: neighbor,

        visited: [...visited],

        traversedEdges: Array.from(traversedEdges),

        levels: { ...levels },

        description:
          `Inspecting neighbor "${neighbor}" of node "${curr}".`,

        line: 6,
      });


      // If not visited
      if (!visitedSet.has(neighbor)) {
        visitedSet.add(neighbor);

        visited.push(neighbor);

        queue.push(neighbor);

        traversedEdges.add(edgeKey);

        parentMap[neighbor] = curr;

        levels[neighbor] =
          (levels[curr] || 0) + 1;


        // Enqueue step
        steps.push({
          queue: [...queue],

          currentNode: curr,

          examiningNeighbor: neighbor,

          visited: [...visited],

          traversedEdges: Array.from(traversedEdges),

          levels: { ...levels },

          description:
            `Neighbor "${neighbor}" is unvisited. Added to visited set and ENQUEUED into Queue (level ${levels[neighbor]}).`,

          line: 8,
        });
      } else {

        // Already visited
        steps.push({
          queue: [...queue],

          currentNode: curr,

          examiningNeighbor: neighbor,

          visited: [...visited],

          traversedEdges: Array.from(traversedEdges),

          levels: { ...levels },

          description:
            `Neighbor "${neighbor}" is already visited. Skipping.`,

          line: 7,
        });
      }
    }
  }


  // BFS complete
  steps.push({
    queue: [],

    currentNode: null,

    examiningNeighbor: null,

    visited: [...visited],

    traversedEdges: Array.from(traversedEdges),

    levels: { ...levels },

    description:
      `BFS traversal completed! All reachable nodes visited in level order: ${visited.join(
        " → "
      )}`,

    line: 10,

    isComplete: true,

    success: true,
  });


  return steps;
}


// ============================================================
// 2D GRID BFS FOR PATHFINDING
// ============================================================

export function generateGridBFSSteps(grid, start, end) {
  const steps = [];


  // ----------------------------------------------------------
  // Validate grid
  // ----------------------------------------------------------

  if (!Array.isArray(grid) || grid.length === 0) {
    return [
      {
        visitedCells: [],

        currentCell: null,

        queue: [],

        queueSize: 0,

        path: [],

        description:
          "Grid is empty. Cannot start BFS.",

        line: 11,

        isComplete: true,

        success: false,
      },
    ];
  }


  const rows = grid.length;


  const cols =
    Array.isArray(grid[0])
      ? grid[0].length
      : 0;


  if (cols === 0) {
    return [
      {
        visitedCells: [],

        currentCell: null,

        queue: [],

        queueSize: 0,

        path: [],

        description:
          "Grid has no columns. Cannot start BFS.",

        line: 11,

        isComplete: true,

        success: false,
      },
    ];
  }


  // ----------------------------------------------------------
  // Check whether a cell can be visited
  // ----------------------------------------------------------

  const isValidCell = (r, c) => {
    return (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      grid[r] &&
      grid[r][c] &&
      !grid[r][c].isWall
    );
  };


  // ----------------------------------------------------------
  // Validate start and end
  // ----------------------------------------------------------

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

        queue: [],

        queueSize: 0,

        path: [],

        description:
          "Start or target cell is invalid or blocked.",

        line: 11,

        isComplete: true,

        success: false,
      },
    ];
  }


  // ----------------------------------------------------------
  // Queue
  // ----------------------------------------------------------

  const queue = [
    {
      r: start.r,
      c: start.c,
    },
  ];


  // ----------------------------------------------------------
  // Visited set
  // ----------------------------------------------------------

  const visited = new Set([
    `${start.r},${start.c}`,
  ]);


  // ----------------------------------------------------------
  // Parent map for shortest path
  // ----------------------------------------------------------

  const parent = {};


  // ----------------------------------------------------------
  // Cells visited in BFS order
  // ----------------------------------------------------------

  const visitedCells = [];


  // ----------------------------------------------------------
  // Initial BFS step
  // ----------------------------------------------------------

  steps.push({
    visitedCells: [],

    currentCell: {
      r: start.r,
      c: start.c,
    },

    queue: [...queue],

    queueSize: queue.length,

    path: [],

    description:
      `Starting BFS from (${start.r}, ${start.c}). Start cell added to Queue.`,

    line: 2,
  });


  // ----------------------------------------------------------
  // Directions
  //
  // Up
  // Right
  // Down
  // Left
  // ----------------------------------------------------------

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];


  let found = false;


  // ----------------------------------------------------------
  // BFS MAIN LOOP
  // ----------------------------------------------------------

  while (queue.length > 0) {

    // Remove first element
    const curr = queue.shift();


    // Add to visited cells
    visitedCells.push({
      r: curr.r,
      c: curr.c,
    });


    // --------------------------------------------------------
    // Current cell step
    // --------------------------------------------------------

    steps.push({
      visitedCells: [...visitedCells],

      currentCell: {
        r: curr.r,
        c: curr.c,
      },

      queue: [...queue],

      queueSize: queue.length,

      path: [],

      description:
        `BFS visits cell (${curr.r}, ${curr.c}) and explores its neighbors.`,

      line: 5,
    });


    // --------------------------------------------------------
    // Check target
    // --------------------------------------------------------

    if (
      curr.r === end.r &&
      curr.c === end.c
    ) {
      found = true;
      break;
    }


    // --------------------------------------------------------
    // Explore neighbors
    // --------------------------------------------------------

    for (const [dr, dc] of dirs) {

      const nr = curr.r + dr;

      const nc = curr.c + dc;

      const key = `${nr},${nc}`;


      // ------------------------------------------------------
      // Check valid and unvisited
      // ------------------------------------------------------

      if (
        isValidCell(nr, nc) &&
        !visited.has(key)
      ) {

        // Mark visited immediately
        visited.add(key);


        // Save parent
        parent[key] = {
          r: curr.r,
          c: curr.c,
        };


        // Add to queue
        queue.push({
          r: nr,
          c: nc,
        });


        // ----------------------------------------------------
        // Enqueue visualization step
        // ----------------------------------------------------

        steps.push({
          visitedCells: [...visitedCells],

          currentCell: {
            r: curr.r,
            c: curr.c,
          },

          queue: [...queue],

          queueSize: queue.length,

          path: [],

          description:
            `Found unvisited neighbor (${nr}, ${nc}) and added it to the Queue.`,

          line: 9,
        });
      }
    }
  }


  // ==========================================================
  // PATH RECONSTRUCTION
  // ==========================================================

  const path = [];


  if (found) {

    let current = {
      r: end.r,
      c: end.c,
    };


    // Start from target
    path.unshift({
      r: current.r,
      c: current.c,
    });


    // Move backwards using parent map
    while (
      current.r !== start.r ||
      current.c !== start.c
    ) {

      const key =
        `${current.r},${current.c}`;


      const previous = parent[key];


      // Safety check
      if (!previous) {
        break;
      }


      current = previous;


      path.unshift({
        r: current.r,
        c: current.c,
      });
    }


    // --------------------------------------------------------
    // Target reached
    // --------------------------------------------------------

    steps.push({
      visitedCells: [...visitedCells],

      currentCell: {
        r: end.r,
        c: end.c,
      },

      queue: [...queue],

      queueSize: queue.length,

      path: [...path],

      description:
        `Target reached! BFS found the shortest path of ${path.length} cells.`,

      line: 10,

      isComplete: true,

      success: true,
    });

  } else {

    // --------------------------------------------------------
    // Target not reachable
    // --------------------------------------------------------

    steps.push({
      visitedCells: [...visitedCells],

      currentCell: null,

      queue: [],

      queueSize: 0,

      path: [],

      description:
        "Target could not be reached. BFS explored all accessible cells.",

      line: 10,

      isComplete: true,

      success: false,
    });
  }


  return steps;
}