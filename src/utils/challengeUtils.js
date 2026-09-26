const getStep = (steps, index) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  const safeIndex = Math.max(
    0,
    Math.min(index, steps.length - 1)
  );

  return steps[safeIndex] || null;
};

const getNextStep = (steps, index) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  return steps[index + 1] || null;
};

const makeChallenge = ({
  id,
  title,
  description,
  question,
  options,
  correctAnswer,
  explanation,
  points = 10,
  difficulty = "Easy",
}) => ({
  id,
  title,
  description,
  question,
  options,
  correctAnswer,
  explanation,
  points,
  difficulty,
});

const formatCell = (cell) => {
  if (!cell) {
    return "this cell";
  }

  if (
    Array.isArray(cell) &&
    cell.length >= 2
  ) {
    return `(${cell[0]}, ${cell[1]})`;
  }

  if (
    typeof cell === "object" &&
    cell.row !== undefined &&
    cell.col !== undefined
  ) {
    return `(${cell.row}, ${cell.col})`;
  }

  return String(cell);
};

const getBinarySearchResult = (
  step
) => {
  if (!step) {
    return null;
  }

  const array = Array.isArray(step.array)
    ? step.array
    : [];

  const left = Number.isInteger(step.left)
    ? step.left
    : 0;

  const right = Number.isInteger(step.right)
    ? step.right
    : array.length - 1;

  const mid = Number.isInteger(step.mid)
    ? step.mid
    : Math.floor((left + right) / 2);

  const target = step.target;

  if (
    mid < 0 ||
    mid >= array.length
  ) {
    return null;
  }

  const value = array[mid];

  if (value === target) {
    return {
      answer: "Found the target",
      explanation:
        `The middle element is ${value}, which equals the target ${target}. ` +
        `Therefore, the target has been found.`,
    };
  }

  if (value < target) {
    return {
      answer: "Search the right half",
      explanation:
        `The middle element ${value} is smaller than the target ${target}. ` +
        `Because the array is sorted, the target can only be in the right half.`,
    };
  }

  return {
    answer: "Search the left half",
    explanation:
      `The middle element ${value} is greater than the target ${target}. ` +
      `Because the array is sorted, the target can only be in the left half.`,
  };
};

const createBubbleSortChallenge = (
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  const comparing =
    current.comparing ||
    next?.comparing;

  if (
    Array.isArray(comparing) &&
    comparing.length >= 2
  ) {
    const first = comparing[0];
    const second = comparing[1];

    const firstValue =
      current.array?.[first] ??
      next?.array?.[first];

    const secondValue =
      current.array?.[second] ??
      next?.array?.[second];

    let correctAnswer = "Keep the order";

    if (
      next?.swapping ||
      next?.swapped ||
      current.swapping
    ) {
      correctAnswer = "Swap the elements";
    }

    return makeChallenge({
      id: `bubble-${currentStepIndex}`,
      title: "Bubble Sort Challenge",
      description:
        "Predict what Bubble Sort will do next.",
      question:
        `The algorithm is comparing ${firstValue} and ${secondValue}. ` +
        `What should happen next?`,
      options: [
        "Swap the elements",
        "Keep the order",
        "Move to the next array",
        "Stop the algorithm",
      ],
      correctAnswer,
      explanation:
        correctAnswer === "Swap the elements"
          ? `${firstValue} and ${secondValue} are out of order, so Bubble Sort swaps them.`
          : `${firstValue} and ${secondValue} are already in the correct order, so no swap is needed.`,
      points: 10,
      difficulty: "Easy",
    });
  }

  if (
    current.swapping ||
    next?.swapping
  ) {
    return makeChallenge({
      id: `bubble-swap-${currentStepIndex}`,
      title: "Bubble Sort Challenge",
      description:
        "Identify the operation taking place.",
      question:
        "What operation is Bubble Sort performing now?",
      options: [
        "Swap two elements",
        "Delete an element",
        "Search for a target",
        "Create a graph",
      ],
      correctAnswer: "Swap two elements",
      explanation:
        "Bubble Sort swaps adjacent elements when they are in the wrong order.",
      points: 10,
      difficulty: "Easy",
    });
  }

  return makeChallenge({
    id: `bubble-general-${currentStepIndex}`,
    title: "Bubble Sort Challenge",
    description:
      "Test your understanding of Bubble Sort.",
    question:
      "What is the main idea behind Bubble Sort?",
    options: [
      "Repeatedly compare adjacent elements",
      "Divide the array into two trees",
      "Use a binary search tree",
      "Visit graph nodes using a stack",
    ],
    correctAnswer:
      "Repeatedly compare adjacent elements",
    explanation:
      "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
    points: 10,
    difficulty: "Easy",
  });
};

const createMergeSortChallenge = (
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  if (
    next?.writing ||
    current.writing
  ) {
    const writing =
      next?.writing ||
      current.writing;

    return makeChallenge({
      id: `merge-write-${currentStepIndex}`,
      title: "Merge Sort Challenge",
      description:
        "Predict the next merge operation.",
      question:
        "What is happening during this step?",
      options: [
        "Write the selected value into the array",
        "Search for a target",
        "Visit a graph node",
        "Swap adjacent elements",
      ],
      correctAnswer:
        "Write the selected value into the array",
      explanation:
        writing
          ? "Merge Sort is writing a selected value back into the correct position of the array."
          : "During merging, selected values are written back into the array in sorted order.",
      points: 15,
      difficulty: "Medium",
    });
  }

  if (
    Array.isArray(
      current.comparing
    ) ||
    Array.isArray(
      next?.comparing
    )
  ) {
    const comparing =
      current.comparing ||
      next.comparing;

    return makeChallenge({
      id: `merge-compare-${currentStepIndex}`,
      title: "Merge Sort Challenge",
      description:
        "Understand the merge step.",
      question:
        "What does Merge Sort do while merging two sorted portions?",
      options: [
        "Compare elements from the two portions",
        "Randomly shuffle the array",
        "Search for a graph node",
        "Delete the larger value",
      ],
      correctAnswer:
        "Compare elements from the two portions",
      explanation:
        "Merge Sort compares elements from the two sorted portions and places the smaller value into the merged result.",
      points: 15,
      difficulty: "Medium",
    });
  }

  return makeChallenge({
    id: `merge-general-${currentStepIndex}`,
    title: "Merge Sort Challenge",
    description:
      "Test your understanding of Merge Sort.",
    question:
      "Which strategy does Merge Sort use?",
    options: [
      "Divide and conquer",
      "Breadth-first search",
      "Hashing",
      "Greedy selection only",
    ],
    correctAnswer: "Divide and conquer",
    explanation:
      "Merge Sort divides the array into smaller parts, recursively sorts them, and then merges the sorted parts.",
    points: 10,
    difficulty: "Easy",
  });
};

const createBinarySearchChallenge = (
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  const result =
    getBinarySearchResult(
      current
    ) ||
    getBinarySearchResult(
      next
    );

  if (!result) {
    return makeChallenge({
      id: `binary-general-${currentStepIndex}`,
      title: "Binary Search Challenge",
      description:
        "Test your understanding of Binary Search.",
      question:
        "What requirement does Binary Search normally need?",
      options: [
        "The array must be sorted",
        "The array must contain only zeros",
        "The array must be a graph",
        "The array must have exactly 10 elements",
      ],
      correctAnswer:
        "The array must be sorted",
      explanation:
        "Binary Search works by repeatedly eliminating half of a sorted search space.",
      points: 10,
      difficulty: "Easy",
    });
  }

  return makeChallenge({
    id: `binary-${currentStepIndex}`,
    title: "Binary Search Challenge",
    description:
      "Predict which part of the array will be searched next.",
    question:
      "What should Binary Search do next?",
    options: [
      "Found the target",
      "Search the left half",
      "Search the right half",
      "Restart from the beginning",
    ],
    correctAnswer:
      result.answer,
    explanation:
      result.explanation,
    points: 15,
    difficulty: "Medium",
  });
};

const createBFSChallenge = (
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  const neighbor =
    current.examiningNeighbor ??
    next?.examiningNeighbor;

  if (
    neighbor !== undefined &&
    neighbor !== null
  ) {
    const visited =
      current.visited ||
      next?.visited ||
      [];

    const alreadyVisited =
      Array.isArray(visited) &&
      visited.includes(neighbor);

    const correctAnswer =
      alreadyVisited
        ? "Skip the neighbor"
        : "Visit and enqueue the neighbor";

    return makeChallenge({
      id: `bfs-neighbor-${currentStepIndex}`,
      title: "BFS Challenge",
      description:
        "Predict how Breadth-First Search handles the neighbor.",
      question:
        `BFS is examining neighbor ${neighbor}. What should happen next?`,
      options: [
        "Visit and enqueue the neighbor",
        "Skip the neighbor",
        "Delete the current node",
        "Sort the graph",
      ],
      correctAnswer,
      explanation:
        alreadyVisited
          ? `Node ${neighbor} has already been visited, so BFS should not visit it again.`
          : `Node ${neighbor} has not been visited yet, so BFS should visit it and add it to the queue.`,
      points: 15,
      difficulty: "Medium",
    });
  }

  if (
    current.currentNode !== undefined ||
    next?.currentNode !== undefined
  ) {
    const node =
      next?.currentNode ??
      current.currentNode;

    return makeChallenge({
      id: `bfs-node-${currentStepIndex}`,
      title: "BFS Challenge",
      description:
        "Follow the next node in the BFS traversal.",
      question:
        `Which node is BFS currently processing?`,
      options: [
        String(node),
        "The previous node",
        "The deepest node",
        "No node",
      ],
      correctAnswer: String(node),
      explanation:
        `BFS processes node ${node} and explores its neighbors level by level.`,
      points: 10,
      difficulty: "Easy",
    });
  }

  return makeChallenge({
    id: `bfs-general-${currentStepIndex}`,
    title: "BFS Challenge",
    description:
      "Test your understanding of Breadth-First Search.",
    question:
      "Which data structure is commonly used by BFS?",
    options: [
      "Queue",
      "Stack",
      "Heap",
      "Hash table",
    ],
    correctAnswer: "Queue",
    explanation:
      "BFS uses a queue so that nodes are processed level by level.",
    points: 10,
    difficulty: "Easy",
  });
};

const createDFSChallenge = (
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  if (
    current.backtracking ||
    next?.backtracking
  ) {
    return makeChallenge({
      id: `dfs-backtrack-${currentStepIndex}`,
      title: "DFS Challenge",
      description:
        "Identify the DFS backtracking operation.",
      question:
        "What is DFS doing during this step?",
      options: [
        "Backtracking",
        "Starting BFS",
        "Sorting the graph",
        "Merging two arrays",
      ],
      correctAnswer: "Backtracking",
      explanation:
        "DFS backtracks when it reaches a node where there are no more unvisited neighbors to explore.",
      points: 15,
      difficulty: "Medium",
    });
  }

  const neighbor =
    current.examiningNeighbor ??
    next?.examiningNeighbor;

  if (
    neighbor !== undefined &&
    neighbor !== null
  ) {
    const visited =
      current.visited ||
      next?.visited ||
      [];

    const alreadyVisited =
      Array.isArray(visited) &&
      visited.includes(neighbor);

    const correctAnswer =
      alreadyVisited
        ? "Skip the neighbor"
        : "Visit and push the neighbor";

    return makeChallenge({
      id: `dfs-neighbor-${currentStepIndex}`,
      title: "DFS Challenge",
      description:
        "Predict how Depth-First Search handles the neighbor.",
      question:
        `DFS is examining neighbor ${neighbor}. What should happen next?`,
      options: [
        "Visit and push the neighbor",
        "Skip the neighbor",
        "Delete the neighbor",
        "Restart the traversal",
      ],
      correctAnswer,
      explanation:
        alreadyVisited
          ? `Node ${neighbor} was already visited, so DFS skips it.`
          : `Node ${neighbor} is unvisited, so DFS can visit it and continue deeper.`,
      points: 15,
      difficulty: "Medium",
    });
  }

  if (
    current.currentNode !== undefined ||
    next?.currentNode !== undefined
  ) {
    const node =
      next?.currentNode ??
      current.currentNode;

    return makeChallenge({
      id: `dfs-node-${currentStepIndex}`,
      title: "DFS Challenge",
      description:
        "Follow the next node in the DFS traversal.",
      question:
        `Which node is DFS processing?`,
      options: [
        String(node),
        "The widest-level node",
        "The previous node",
        "No node",
      ],
      correctAnswer: String(node),
      explanation:
        `DFS is processing node ${node} and attempts to explore as deeply as possible before backtracking.`,
      points: 10,
      difficulty: "Easy",
    });
  }

  return makeChallenge({
    id: `dfs-general-${currentStepIndex}`,
    title: "DFS Challenge",
    description:
      "Test your understanding of Depth-First Search.",
    question:
      "Which data structure is commonly associated with DFS?",
    options: [
      "Stack",
      "Queue",
      "Priority queue",
      "Hash table",
    ],
    correctAnswer: "Stack",
    explanation:
      "DFS uses a stack concept, either explicitly or through recursion.",
    points: 10,
    difficulty: "Easy",
  });
};

const createGridChallenge = (
  activeAlgo,
  steps,
  currentStepIndex
) => {
  const current = getStep(
    steps,
    currentStepIndex
  );

  const next = getNextStep(
    steps,
    currentStepIndex
  );

  if (!current) {
    return null;
  }

  const currentCell =
    current.currentCell ??
    next?.currentCell;

  if (currentCell) {
    const label =
      formatCell(currentCell);

    const isBFS =
      activeAlgo === "bfs";

    return makeChallenge({
      id: `grid-${activeAlgo}-${currentStepIndex}`,
      title:
        isBFS
          ? "BFS Grid Challenge"
          : "DFS Grid Challenge",
      description:
        "Predict what happens to the current grid cell.",
      question:
        `The algorithm is processing cell ${label}. What is the main action?`,
      options: [
        "Explore the cell's neighbors",
        "Sort the entire grid",
        "Delete the cell",
        "Restart the search",
      ],
      correctAnswer:
        "Explore the cell's neighbors",
      explanation:
        isBFS
          ? "Grid BFS explores reachable neighboring cells level by level."
          : "Grid DFS explores a path deeply before backtracking.",
      points: 15,
      difficulty: "Medium",
    });
  }

  return null;
};

export function createChallenge(
  activeAlgo,
  steps = [],
  currentStepIndex = 0
) {
  if (
    !Array.isArray(steps) ||
    steps.length === 0
  ) {
    return makeChallenge({
      id: "empty-challenge",
      title: "Algorithm Challenge",
      description:
        "Run an algorithm to generate a challenge.",
      question:
        "What should you do first?",
      options: [
        "Run the algorithm",
        "Close the visualizer",
        "Delete the array",
        "Stop immediately",
      ],
      correctAnswer:
        "Run the algorithm",
      explanation:
        "Start an algorithm so the visualizer can generate step-by-step challenges.",
      points: 10,
      difficulty: "Easy",
    });
  }

  const algo =
    String(activeAlgo || "")
      .toLowerCase();

  if (
    algo.includes("bubble")
  ) {
    return createBubbleSortChallenge(
      steps,
      currentStepIndex
    );
  }

  if (
    algo.includes("merge")
  ) {
    return createMergeSortChallenge(
      steps,
      currentStepIndex
    );
  }

  if (
    algo.includes("binary")
  ) {
    return createBinarySearchChallenge(
      steps,
      currentStepIndex
    );
  }

  if (
    algo.includes("bfs") &&
    (
      steps.some(
        (step) =>
          step?.currentCell
      ) ||
      steps.some(
        (step) =>
          step?.visitedCells
      )
    )
  ) {
    return (
      createGridChallenge(
        "bfs",
        steps,
        currentStepIndex
      ) ||
      createBFSChallenge(
        steps,
        currentStepIndex
      )
    );
  }

  if (
    algo.includes("dfs") &&
    (
      steps.some(
        (step) =>
          step?.currentCell
      ) ||
      steps.some(
        (step) =>
          step?.visitedCells
      )
    )
  ) {
    return (
      createGridChallenge(
        "dfs",
        steps,
        currentStepIndex
      ) ||
      createDFSChallenge(
        steps,
        currentStepIndex
      )
    );
  }

  if (algo.includes("bfs")) {
    return createBFSChallenge(
      steps,
      currentStepIndex
    );
  }

  if (algo.includes("dfs")) {
    return createDFSChallenge(
      steps,
      currentStepIndex
    );
  }

  return makeChallenge({
    id: `general-${currentStepIndex}`,
    title: "Algorithm Challenge",
    description:
      "Test your algorithm knowledge.",
    question:
      "What is the purpose of an algorithm visualizer?",
    options: [
      "To understand how an algorithm executes step by step",
      "To replace programming completely",
      "To remove all data structures",
      "To make every algorithm O(1)",
    ],
    correctAnswer:
      "To understand how an algorithm executes step by step",
    explanation:
      "An algorithm visualizer makes the execution process easier to understand by showing each step.",
    points: 10,
    difficulty: "Easy",
  });
}