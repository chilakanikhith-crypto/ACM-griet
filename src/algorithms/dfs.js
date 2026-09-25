// Depth-First Search (DFS) Step Generator for Graph and Grid

export const DFS_CODE = [
  { line: 1, text: "function DFS(graph, start):" },
  { line: 2, text: "  stack = new Stack([start])" },
  { line: 3, text: "  visited = new Set()" },
  { line: 4, text: "  while stack is not empty:" },
  { line: 5, text: "    curr = stack.pop()" },
  { line: 6, text: "    if curr not in visited:" },
  { line: 7, text: "      visited.add(curr)" },
  { line: 8, text: "      for neighbor in graph[curr]:" },
  { line: 9, text: "        if neighbor not in visited:" },
  { line: 10, text: "          stack.push(neighbor)" },
  { line: 11, text: "  return visited" },
];

export function generateGraphDFSSteps(graphData, startNodeId) {
  const steps = [];
  const adj = graphData.adj;
  const stack = [startNodeId];
  const visited = [];
  const visitedSet = new Set();
  const traversedEdges = new Set();
  const parentMap = {};

  steps.push({
    stack: [...stack],
    currentNode: null,
    examiningNeighbor: null,
    visited: [...visited],
    traversedEdges: Array.from(traversedEdges),
    backtracking: false,
    description: `Initialized DFS. Pushed start node "${startNodeId}" onto Stack.`,
    line: 2,
  });

  while (stack.length > 0) {
    const curr = stack.pop();

    if (!visitedSet.has(curr)) {
      visitedSet.add(curr);
      visited.push(curr);

      if (parentMap[curr]) {
        const edgeKey = [parentMap[curr], curr].sort().join("-");
        traversedEdges.add(edgeKey);
      }

      steps.push({
        stack: [...stack],
        currentNode: curr,
        examiningNeighbor: null,
        visited: [...visited],
        traversedEdges: Array.from(traversedEdges),
        backtracking: false,
        description: `Popped "${curr}" from top of Stack. Marked "${curr}" as visited.`,
        line: 7,
      });

      const neighbors = adj[curr] || [];
      // Push neighbors in reverse order so first neighbor is popped first
      const unvisitedNeighbors = [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visitedSet.has(neighbor)) {
          parentMap[neighbor] = curr;
          stack.push(neighbor);
          unvisitedNeighbors.push(neighbor);
        }
      }

      if (unvisitedNeighbors.length > 0) {
        steps.push({
          stack: [...stack],
          currentNode: curr,
          examiningNeighbor: unvisitedNeighbors[unvisitedNeighbors.length - 1],
          visited: [...visited],
          traversedEdges: Array.from(traversedEdges),
          backtracking: false,
          description: `Discovered unvisited neighbor(s) [${unvisitedNeighbors.reverse().join(", ")}]. Pushed to Stack.`,
          line: 10,
        });
      } else {
        steps.push({
          stack: [...stack],
          currentNode: curr,
          examiningNeighbor: null,
          visited: [...visited],
          traversedEdges: Array.from(traversedEdges),
          backtracking: true,
          description: `No unvisited neighbors for "${curr}". Backtracking up the call stack...`,
          line: 5,
        });
      }
    } else {
      steps.push({
        stack: [...stack],
        currentNode: curr,
        examiningNeighbor: null,
        visited: [...visited],
        traversedEdges: Array.from(traversedEdges),
        backtracking: true,
        description: `Node "${curr}" popped from Stack was already visited. Discarding.`,
        line: 6,
      });
    }
  }

  steps.push({
    stack: [],
    currentNode: null,
    examiningNeighbor: null,
    visited: [...visited],
    traversedEdges: Array.from(traversedEdges),
    backtracking: false,
    description: `DFS traversal complete! All reachable branches explored. Order: ${visited.join(" → ")}`,
    line: 11,
    isComplete: true,
  });

  return steps;
}

// 2D Grid DFS for pathfinding
export function generateGridDFSSteps(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const steps = [];
  const stack = [{ r: start.r, c: start.c }];
  const visited = new Set([`${start.r},${start.c}`]);
  const parent = {};
  const visitedCells = [];

  steps.push({
    visitedCells: [],
    currentCell: start,
    stackSize: 1,
    path: [],
    description: `Starting DFS on grid from (${start.r}, ${start.c}) to (${end.r}, ${end.c})`,
    line: 2,
  });

  const dirs = [
    [-1, 0], // Up
    [0, 1],  // Right
    [1, 0],  // Down
    [0, -1], // Left
  ];

  let found = false;

  while (stack.length > 0) {
    const curr = stack.pop();
    visitedCells.push(curr);

    if (curr.r === end.r && curr.c === end.c) {
      found = true;
      break;
    }

    for (const [dr, dc] of dirs) {
      const nr = curr.r + dr;
      const nc = curr.c + dc;
      const key = `${nr},${nc}`;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !grid[nr][nc].isWall &&
        !visited.has(key)
      ) {
        visited.add(key);
        parent[key] = curr;
        stack.push({ r: nr, c: nc });
      }
    }

    if (visitedCells.length % 2 === 0 || stack.length === 0) {
      steps.push({
        visitedCells: [...visitedCells],
        currentCell: curr,
        stackSize: stack.length,
        path: [],
        description: `DFS diving deep into branch. Visited ${visitedCells.length} cells. Stack depth: ${stack.length}`,
        line: 5,
      });
    }
  }

  // Path reconstruction
  const path = [];
  if (found) {
    let currKey = `${end.r},${end.c}`;
    while (currKey && parent[currKey]) {
      const p = parent[currKey];
      path.unshift(p);
      currKey = `${p.r},${p.c}`;
    }
    path.push(end);

    steps.push({
      visitedCells: [...visitedCells],
      currentCell: end,
      stackSize: stack.length,
      path: [...path],
      description: `Target reached via DFS exploration! Path length: ${path.length} steps.`,
      line: 11,
      isComplete: true,
      success: true,
    });
  } else {
    steps.push({
      visitedCells: [...visitedCells],
      currentCell: null,
      stackSize: 0,
      path: [],
      description: `Target could not be reached. All accessible branches explored.`,
      line: 11,
      isComplete: true,
      success: false,
    });
  }

  return steps;
}
