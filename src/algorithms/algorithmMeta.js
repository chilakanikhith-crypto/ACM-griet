import { BUBBLE_SORT_CODE } from './bubbleSort';
import { MERGE_SORT_CODE } from './mergeSort';
import { BINARY_SEARCH_CODE } from './binarySearch';
import { BFS_CODE } from './bfs';
import { DFS_CODE } from './dfs';

export const ALGORITHMS = {
  bubble_sort: {
    id: "bubble_sort",
    name: "Bubble Sort",
    category: "Sorting",
    icon: "ArrowUpDown",
    tagline: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    stable: "Yes",
    inPlace: "Yes",
    code: BUBBLE_SORT_CODE,
    pros: [
      "Extremely simple to understand and implement",
      "In-place algorithm (requires O(1) auxiliary memory)",
      "Stable sorting algorithm (preserves relative order of equal elements)"
    ],
    cons: [
      "Quadratic time complexity O(n²) makes it inefficient on large datasets",
      "Performs excessive swaps compared to Selection or Insertion sort"
    ]
  },
  merge_sort: {
    id: "merge_sort",
    name: "Merge Sort",
    category: "Sorting",
    icon: "GitMerge",
    tagline: "A divide-and-conquer algorithm that recursively splits arrays and merges them in sorted order.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
    stable: "Yes",
    inPlace: "No",
    code: MERGE_SORT_CODE,
    pros: [
      "Guaranteed O(n log n) runtime even in worst case",
      "Highly scalable for massive datasets and linked lists",
      "Stable sorting algorithm"
    ],
    cons: [
      "Requires O(n) auxiliary space for temporary merging",
      "Higher constant overhead for small arrays"
    ]
  },
  binary_search: {
    id: "binary_search",
    name: "Binary Search",
    category: "Searching",
    icon: "Search",
    tagline: "Efficiently locates a target value in a sorted array by repeatedly dividing the search interval in half.",
    timeComplexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    spaceComplexity: "O(1)",
    stable: "N/A",
    inPlace: "Yes",
    code: BINARY_SEARCH_CODE,
    pros: [
      "Logarithmic time complexity O(log n) eliminates 50% of candidates each step",
      "Searches 1,000,000 items in at most 20 comparisons",
      "Very low memory footprint O(1)"
    ],
    cons: [
      "Requires the underlying collection to be strictly sorted",
      "Needs random-access indexing (arrays, not singly-linked lists)"
    ]
  },
  bfs: {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "Graph / Grid",
    icon: "Network",
    tagline: "Explores vertices level-by-level in concentric rings using a FIFO Queue, guaranteeing the shortest path in unweighted graphs.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V)",
    dataStructure: "Queue (FIFO)",
    code: BFS_CODE,
    pros: [
      "Guarantees the shortest path in unweighted graphs or uniform-cost grids",
      "Never gets stuck in infinite loops/cycles if visited set is maintained",
      "Ideal for finding nearest neighbors and social degree-of-separation"
    ],
    cons: [
      "Requires more memory O(V) to store the entire frontier queue",
      "Not memory-optimal for very deep or wide branching graphs"
    ]
  },
  dfs: {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    category: "Graph / Grid",
    icon: "GitFork",
    tagline: "Explores as deep as possible along each branch before backtracking, utilizing a LIFO Stack or recursion.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V) (or O(H) tree height)",
    dataStructure: "Stack (LIFO)",
    code: DFS_CODE,
    pros: [
      "Memory efficient when searching deep solutions (proportional to tree height)",
      "Excellent for cycle detection, topological sorting, and maze solving",
      "Natural recursive implementation"
    ],
    cons: [
      "Does not guarantee the shortest path",
      "Can get stuck exploring very deep branches or infinite paths without depth limit"
    ]
  }
};
