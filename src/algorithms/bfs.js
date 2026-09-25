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

export function generateGraphBFSSteps(graphData, startNodeId) {
  const steps = [];
  const adj = graphData.adj;
  const queue = [startNodeId];
  const visited = [startNodeId];
  const visitedSet = new Set([startNodeId]);
  const traversedEdges = new Set();
  const parentMap = {};
  const levels = { [startNodeId]: 0 };

  steps.push({
    queue: [...queue],
    currentNode: null,
    examiningNeighbor: null,
    visited: [...visited],
    traversedEdges: Array.from(traversedEdges),
    levels: { ...levels },
    description: `Initialized BFS. Enqueued starting node "${startNodeId}" into Queue.`,
    line: 2,
  });

  while (queue.length > 0) {
    const curr = queue.shift();

    steps.push({
      queue: [...queue],
      currentNode: curr,
      examiningNeighbor: null,
      visited: [...visited],
      traversedEdges: Array.from(traversedEdges),
      levels: { ...levels },
      description: `Dequeued node "${curr}" from front of Queue. Exploring its neighbors.`,
      line: 5,
    });

    const neighbors = adj[curr] || [];
    for (const neighbor of neighbors) {
      const edgeKey = [curr, neighbor].sort().join("-");

      steps.push({
        queue: [...queue],
        currentNode: curr,
        examiningNeighbor: neighbor,
        visited: [...visited],
        traversedEdges: Array.from(traversedEdges),
        levels: { ...levels },
        description: `Inspecting neighbor "${neighbor}" of node "${curr}".`,
        line: 6,
      });

      if (!visitedSet.has(neighbor)) {
        visitedSet.add(neighbor);
        visited.push(neighbor);
        queue.push(neighbor);
        traversedEdges.add(edgeKey);
        parentMap[neighbor] = curr;
        levels[neighbor] = (levels[curr] || 0) + 1;

        steps.push({
          queue: [...queue],
          currentNode: curr,
          examiningNeighbor: neighbor,
          visited: [...visited],
          traversedEdges: Array.from(traversedEdges),
          levels: { ...levels },
          description: `Neighbor "${neighbor}" is unvisited. Added to visited set and ENQUEUED into Queue (level ${levels[neighbor]}).`,
          line: 8,
        });
      } else {
        steps.push({
          queue: [...queue],
          currentNode: curr,
          examiningNeighbor: neighbor,
          visited: [...visited],
          traversedEdges: Array.from(traversedEdges),
          levels: { ...levels },
          description: `Neighbor "${neighbor}" is already visited. Skipping.`,
          line: 7,
        });
      }
    }
  }

  steps.push({
    queue: [],
    currentNode: null,
    examiningNeighbor: null,
    visited: [...visited],
    traversedEdges: Array.from(traversedEdges),
    levels: { ...levels },
    description: `BFS traversal completed! All reachable nodes visited in level order: ${visited.join(" → ")}`,
    line: 10,
    isComplete: true,
  });

  return steps;
}

// 2D Grid BFS for pathfinding
export function generateGridBFSSteps(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const steps = [];
  const queue = [{ r: start.r, c: start.c }];
  const visited = new Set([`${start.r},${start.c}`]);
  const parent = {};
  const visitedCells = [];

  steps.push({
    visitedCells: [],
    currentCell: start,
    queueSize: 1,
    path: [],
    description: `Starting BFS on grid from (${start.r}, ${start.c}) to (${end.r}, ${end.c})`,
    line: 2,
  });

  const dirs = [
    [-1, 0], // Up
    [0, 1],  // Right
    [1, 0],  // Down
    [0, -1], // Left
  ];

  let found = false;

  while (queue.length > 0) {
    const curr = queue.shift();
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
        queue.push({ r: nr, c: nc });
      }
    }

    if (visitedCells.length % 2 === 0 || queue.length === 0) {
      steps.push({
        visitedCells: [...visitedCells],
        currentCell: curr,
        queueSize: queue.length,
        path: [],
        description: `BFS wave expanding. Visited ${visitedCells.length} cells. Queue size: ${queue.length}`,
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
      queueSize: queue.length,
      path: [...path],
      description: `Target reached! Shortest path found with length ${path.length} steps.`,
      line: 10,
      isComplete: true,
      success: true,
    });
  } else {
    steps.push({
      visitedCells: [...visitedCells],
      currentCell: null,
      queueSize: 0,
      path: [],
      description: `Target could not be reached. All accessible cells explored.`,
      line: 10,
      isComplete: true,
      success: false,
    });
  }

  return steps;
}
