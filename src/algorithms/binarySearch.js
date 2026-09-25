// Binary Search Step Generator

export const BINARY_SEARCH_CODE = [
  { line: 1, text: "function binarySearch(arr, target):" },
  { line: 2, text: "  left = 0, right = arr.length - 1" },
  { line: 3, text: "  while left <= right:" },
  { line: 4, text: "    mid = Math.floor((left + right) / 2)" },
  { line: 5, text: "    if arr[mid] === target: return mid" },
  { line: 6, text: "    else if arr[mid] < target: left = mid + 1" },
  { line: 7, text: "    else: right = mid - 1" },
  { line: 8, text: "  return -1 // not found" },
];

export function generateBinarySearchSteps(sortedArray, target) {
  const steps = [];
  const arr = [...sortedArray];
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;

  steps.push({
    array: [...arr],
    left,
    right,
    mid: null,
    target,
    eliminated: [],
    foundIndex: null,
    description: `Target is ${target}. Initialized search window [${left}..${right}].`,
    line: 2,
    comparisons,
  });

  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    // Calculate eliminated indices so far
    const eliminated = [];
    for (let i = 0; i < arr.length; i++) {
      if (i < left || i > right) eliminated.push(i);
    }

    steps.push({
      array: [...arr],
      left,
      right,
      mid,
      target,
      eliminated,
      foundIndex: null,
      description: `Calculated mid index: ${mid} (value: ${arr[mid]}). Comparing arr[${mid}] with target ${target}`,
      line: 4,
      comparisons,
    });

    if (arr[mid] === target) {
      found = true;
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        eliminated,
        foundIndex: mid,
        description: `MATCH FOUND! Target ${target} found at index ${mid}.`,
        line: 5,
        comparisons,
        isComplete: true,
        success: true,
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        eliminated: [...eliminated, mid],
        foundIndex: null,
        description: `${arr[mid]} < ${target}. Target must be in the right half. Updating left = mid + 1 (${mid + 1}).`,
        line: 6,
        comparisons,
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        target,
        eliminated: [...eliminated, mid],
        foundIndex: null,
        description: `${arr[mid]} > ${target}. Target must be in the left half. Updating right = mid - 1 (${mid - 1}).`,
        line: 7,
        comparisons,
      });
      right = mid - 1;
    }
  }

  if (!found) {
    const eliminated = arr.map((_, i) => i);
    steps.push({
      array: [...arr],
      left,
      right,
      mid: null,
      target,
      eliminated,
      foundIndex: null,
      description: `Target ${target} was not found in the array (search range exhausted: left > right).`,
      line: 8,
      comparisons,
      isComplete: true,
      success: false,
    });
  }

  return steps;
}
