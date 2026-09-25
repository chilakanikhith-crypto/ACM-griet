// Bubble Sort Step Generator

export const BUBBLE_SORT_CODE = [
  { line: 1, text: "function bubbleSort(arr):" },
  { line: 2, text: "  n = arr.length" },
  { line: 3, text: "  for i = 0 to n - 1:" },
  { line: 4, text: "    for j = 0 to n - i - 2:" },
  { line: 5, text: "      if arr[j] > arr[j + 1]:" },
  { line: 6, text: "        swap(arr[j], arr[j + 1])" },
  { line: 7, text: "    mark arr[n - 1 - i] as sorted" },
  { line: 8, text: "  return arr" },
];

export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Starting Bubble Sort. Array initialized.",
    line: 2,
    comparisons,
    swaps,
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from(sortedIndices),
        description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
        line: 5,
        comparisons,
        swaps,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from(sortedIndices),
          description: `Swapped ${arr[j + 1]} and ${arr[j]} because ${temp} > ${arr[j]}`,
          line: 6,
          comparisons,
          swaps,
        });
      }
    }

    sortedIndices.add(n - 1 - i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from(sortedIndices),
      description: `Element ${arr[n - 1 - i]} at index ${n - 1 - i} is now in its sorted position`,
      line: 7,
      comparisons,
      swaps,
    });
  }

  // Mark all as sorted
  for (let i = 0; i < n; i++) {
    sortedIndices.add(i);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from(sortedIndices),
    description: "Bubble Sort completed! Array is fully sorted.",
    line: 8,
    comparisons,
    swaps,
    isComplete: true,
  });

  return steps;
}
