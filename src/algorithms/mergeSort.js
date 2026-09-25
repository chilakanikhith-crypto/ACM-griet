// Merge Sort Step Generator

export const MERGE_SORT_CODE = [
  { line: 1, text: "function mergeSort(arr, left, right):" },
  { line: 2, text: "  if left >= right: return" },
  { line: 3, text: "  mid = Math.floor((left + right) / 2)" },
  { line: 4, text: "  mergeSort(arr, left, mid)" },
  { line: 5, text: "  mergeSort(arr, mid + 1, right)" },
  { line: 6, text: "  merge(arr, left, mid, right)" },
  { line: 7, text: "" },
  { line: 8, text: "function merge(arr, left, mid, right):" },
  { line: 9, text: "  compare & write smaller to aux array" },
  { line: 10, text: "  copy aux back to original array" },
];

export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0; // writes
  const sortedIndices = new Set();

  steps.push({
    array: [...arr],
    activeRange: [0, arr.length - 1],
    comparing: [],
    writing: null,
    sorted: [],
    description: "Starting Merge Sort. Subarray range: [0, " + (arr.length - 1) + "]",
    line: 1,
    comparisons,
    swaps,
  });

  function merge(left, mid, right) {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    steps.push({
      array: [...arr],
      activeRange: [left, right],
      mid,
      comparing: [],
      writing: null,
      sorted: Array.from(sortedIndices),
      description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
      line: 6,
      comparisons,
      swaps,
    });

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      const actualLeftIdx = left + i;
      const actualRightIdx = mid + 1 + j;

      steps.push({
        array: [...arr],
        activeRange: [left, right],
        mid,
        comparing: [actualLeftIdx, actualRightIdx],
        writing: null,
        sorted: Array.from(sortedIndices),
        description: `Comparing left element ${leftPart[i]} with right element ${rightPart[j]}`,
        line: 9,
        comparisons,
        swaps,
      });

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        swaps++;
        steps.push({
          array: [...arr],
          activeRange: [left, right],
          mid,
          comparing: [],
          writing: k,
          sorted: Array.from(sortedIndices),
          description: `Placed ${leftPart[i]} into position ${k}`,
          line: 10,
          comparisons,
          swaps,
        });
        i++;
      } else {
        arr[k] = rightPart[j];
        swaps++;
        steps.push({
          array: [...arr],
          activeRange: [left, right],
          mid,
          comparing: [],
          writing: k,
          sorted: Array.from(sortedIndices),
          description: `Placed ${rightPart[j]} into position ${k}`,
          line: 10,
          comparisons,
          swaps,
        });
        j++;
      }
      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      swaps++;
      steps.push({
        array: [...arr],
        activeRange: [left, right],
        mid,
        comparing: [],
        writing: k,
        sorted: Array.from(sortedIndices),
        description: `Placed remaining left element ${leftPart[i]} into position ${k}`,
        line: 10,
        comparisons,
        swaps,
      });
      i++;
      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      swaps++;
      steps.push({
        array: [...arr],
        activeRange: [left, right],
        mid,
        comparing: [],
        writing: k,
        sorted: Array.from(sortedIndices),
        description: `Placed remaining right element ${rightPart[j]} into position ${k}`,
        line: 10,
        comparisons,
        swaps,
      });
      j++;
      k++;
    }

    // If whole array merged
    if (left === 0 && right === arr.length - 1) {
      for (let idx = 0; idx < arr.length; idx++) {
        sortedIndices.add(idx);
      }
    }
  }

  function divideAndConquer(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: [...arr],
      activeRange: [left, right],
      mid,
      comparing: [],
      writing: null,
      sorted: Array.from(sortedIndices),
      description: `Splitting array range [${left}..${right}] at mid index ${mid}`,
      line: 3,
      comparisons,
      swaps,
    });

    divideAndConquer(left, mid);
    divideAndConquer(mid + 1, right);
    merge(left, mid, right);
  }

  divideAndConquer(0, arr.length - 1);

  for (let idx = 0; idx < arr.length; idx++) {
    sortedIndices.add(idx);
  }

  steps.push({
    array: [...arr],
    activeRange: [0, arr.length - 1],
    mid: null,
    comparing: [],
    writing: null,
    sorted: Array.from(sortedIndices),
    description: "Merge Sort completed! Array is completely sorted.",
    line: 10,
    comparisons,
    swaps,
    isComplete: true,
  });

  return steps;
}
