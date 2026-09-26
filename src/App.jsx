import React, {
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react';

import Header from './components/Header';
import ControlBar from './components/ControlBar';
import SortingVisualizer from './components/SortingVisualizer';
import BinarySearchVisualizer from './components/BinarySearchVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import GridVisualizer from './components/GridVisualizer';
import PseudocodeViewer from './components/PseudocodeViewer';
import MetricsPanel from './components/MetricsPanel';
import ComplexityCard from './components/ComplexityCard';
import InfoModal from './components/InfoModal';
import InteractiveBackground from './components/InteractiveBackground';
import ChallengePanel from './components/ChallengePanel';
import ProgressPanel from './components/ProgressPanel';

import { generateBubbleSortSteps } from './algorithms/bubbleSort';
import { generateMergeSortSteps } from './algorithms/mergeSort';
import { generateBinarySearchSteps } from './algorithms/binarySearch';

import {
  generateGraphBFSSteps,
  generateGridBFSSteps
} from './algorithms/bfs';

import {
  generateGraphDFSSteps,
  generateGridDFSSteps
} from './algorithms/dfs';

import { GRAPH_PRESETS } from './algorithms/graphData';
import { ALGORITHMS } from './algorithms/algorithmMeta';

import {
  createInitialGrid,
  generateRandomMaze
} from './utils/gridUtils';

import { sound } from './utils/sound';

import {
  createChallenge
} from './utils/challengeUtils';

import {
  loadProgress,
  saveProgress,
  addChallengeResult,
  resetProgress
} from './utils/progressUtils';


export default function App() {

  /* =========================================================
     BASIC APP STATE
  ========================================================= */

  const [activeAlgo, setActiveAlgo] =
    useState('bubble_sort');

  const [isAudioOn, setIsAudioOn] =
    useState(true);

  const [isInfoOpen, setIsInfoOpen] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  const [speed, setSpeed] =
    useState(0.25);

  const [arraySize, setArraySize] =
    useState(16);


  /* =========================================================
     SORTING DATA
  ========================================================= */

  const [sortingArray, setSortingArray] =
    useState([
      45, 18, 72, 89,
      31, 64, 12, 53,
      95, 27, 40, 81,
      6, 68, 50, 36
    ]);


  /* =========================================================
     BINARY SEARCH DATA
  ========================================================= */

  const [searchArray, setSearchArray] =
    useState([
      8, 15, 22, 31,
      40, 47, 55, 63,
      71, 79, 88, 94
    ]);

  const [targetValue, setTargetValue] =
    useState(47);


  /* =========================================================
     GRAPH / GRID STATE
  ========================================================= */

  const [viewMode, setViewMode] =
    useState('graph');

  const [graphPresetKey, setGraphPresetKey] =
    useState('tree');

  const [startNode, setStartNode] =
    useState('A');

  const gridStart = {
    r: 5,
    c: 3
  };

  const gridEnd = {
    r: 5,
    c: 17
  };

  const [grid, setGrid] = useState(() =>
    createInitialGrid()
  );


  /* =========================================================
     CHALLENGE MODE STATE
  ========================================================= */

  const [challengeScore, setChallengeScore] =
    useState(0);

  const [challengeStreak, setChallengeStreak] =
    useState(0);

  const [challengeKey, setChallengeKey] =
    useState(0);


  /* =========================================================
     XP / PROGRESS STATE
  ========================================================= */

  const [progress, setProgress] = useState(
    () => loadProgress()
  );


  /* =========================================================
     GENERATE ALGORITHM STEPS
  ========================================================= */

  const steps = useMemo(() => {

    switch (activeAlgo) {

      case 'bubble_sort':
        return generateBubbleSortSteps(
          sortingArray
        );

      case 'merge_sort':
        return generateMergeSortSteps(
          sortingArray
        );

      case 'binary_search':
        return generateBinarySearchSteps(
          searchArray,
          targetValue
        );

      case 'bfs':

        if (viewMode === 'graph') {

          return generateGraphBFSSteps(
            GRAPH_PRESETS[graphPresetKey],
            startNode
          );

        }

        return generateGridBFSSteps(
          grid,
          gridStart,
          gridEnd
        );

      case 'dfs':

        if (viewMode === 'graph') {

          return generateGraphDFSSteps(
            GRAPH_PRESETS[graphPresetKey],
            startNode
          );

        }

        return generateGridDFSSteps(
          grid,
          gridStart,
          gridEnd
        );

      default:
        return [];
    }

  }, [
    activeAlgo,
    sortingArray,
    searchArray,
    targetValue,
    viewMode,
    graphPresetKey,
    startNode,
    grid
  ]);


  /* =========================================================
     STEP INFORMATION
  ========================================================= */

  const totalSteps = steps.length;

  const currentStep =
    steps[currentStepIndex] ||
    steps[0] ||
    {};

  const isComplete =
    totalSteps > 0 &&
    currentStepIndex >=
      totalSteps - 1;


  /* =========================================================
     LIVE METRICS
  ========================================================= */

  const metrics = useMemo(() => {

    let comparisons = 0;
    let swaps = 0;
    let visitedCount = 0;
    let queueOrStackDepth = 0;

    const stepsUntilNow =
      steps.slice(
        0,
        currentStepIndex + 1
      );

    for (const step of stepsUntilNow) {

      if (
        typeof step.comparisons ===
        'number'
      ) {
        comparisons =
          step.comparisons;
      }

      if (
        typeof step.swaps ===
        'number'
      ) {
        swaps =
          step.swaps;
      }

      if (
        typeof step.comparisons !==
          'number' &&
        (
          step.comparing?.length > 0 ||
          step.type === 'compare' ||
          step.action === 'compare'
        )
      ) {
        comparisons++;
      }

      if (
        typeof step.swaps !==
          'number' &&
        (
          step.swapping?.length > 0 ||
          step.type === 'swap' ||
          step.action === 'swap'
        )
      ) {
        swaps++;
      }

      if (
        activeAlgo === 'merge_sort' &&
        typeof step.swaps !==
          'number' &&
        step.writing !== undefined &&
        step.writing !== null
      ) {
        swaps++;
      }

      if (
        Array.isArray(step.visited)
      ) {
        visitedCount =
          step.visited.length;
      }

      if (
        Array.isArray(
          step.visitedCells
        )
      ) {
        visitedCount =
          step.visitedCells.length;
      }

      if (
        Array.isArray(step.queue)
      ) {
        queueOrStackDepth =
          step.queue.length;
      }

      if (
        Array.isArray(step.stack)
      ) {
        queueOrStackDepth =
          step.stack.length;
      }

      if (
        typeof step.queueSize ===
        'number'
      ) {
        queueOrStackDepth =
          step.queueSize;
      }

      if (
        typeof step.stackSize ===
        'number'
      ) {
        queueOrStackDepth =
          step.stackSize;
      }
    }

    if (
      typeof currentStep.comparisons ===
      'number'
    ) {
      comparisons =
        currentStep.comparisons;
    }

    if (
      typeof currentStep.swaps ===
      'number'
    ) {
      swaps =
        currentStep.swaps;
    }

    if (
      Array.isArray(
        currentStep.visited
      )
    ) {
      visitedCount =
        currentStep.visited.length;
    }

    if (
      Array.isArray(
        currentStep.visitedCells
      )
    ) {
      visitedCount =
        currentStep.visitedCells.length;
    }

    if (
      Array.isArray(
        currentStep.queue
      )
    ) {
      queueOrStackDepth =
        currentStep.queue.length;
    }

    if (
      Array.isArray(
        currentStep.stack
      )
    ) {
      queueOrStackDepth =
        currentStep.stack.length;
    }

    return {
      comparisons,
      swaps,
      visitedCount,
      queueOrStackDepth
    };

  }, [
    steps,
    currentStepIndex,
    currentStep,
    activeAlgo
  ]);


  /* =========================================================
     CHALLENGE GENERATION
  ========================================================= */

  const challenge = useMemo(() => {

    return createChallenge(
      activeAlgo,
      steps,
      currentStepIndex
    );

  }, [
    activeAlgo,
    steps,
    currentStepIndex,
    challengeKey
  ]);


  /* =========================================================
     AUDIO
  ========================================================= */

  useEffect(() => {

    if (
      !isAudioOn ||
      !currentStep
    ) {
      return;
    }

    if (
      currentStep.swapping &&
      currentStep.swapping.length > 0
    ) {

      sound.playSwap(
        currentStep.array?.[
          currentStep.swapping[0]
        ] || 50
      );

    }

    else if (
      currentStep.writing !==
        undefined &&
      currentStep.writing !==
        null
    ) {

      sound.playSwap(
        currentStep.array?.[
          currentStep.writing
        ] || 50
      );

    }

    else if (
      currentStep.comparing &&
      currentStep.comparing.length > 0
    ) {

      sound.playCompare(
        currentStep.array?.[
          currentStep.comparing[0]
        ] || 40
      );

    }

    else if (
      currentStep.currentNode
    ) {

      const idx =
        currentStep.currentNode
          .toString()
          .charCodeAt(0) || 0;

      sound.playVisit(idx);

    }

    else if (
      currentStep.foundIndex !==
        null &&
      currentStep.foundIndex !==
        undefined &&
      currentStep.isComplete
    ) {

      sound.playSuccess();

    }

  }, [
    currentStepIndex,
    isAudioOn,
    currentStep
  ]);


  /* =========================================================
     ANIMATION TIMER
  ========================================================= */

  const timerRef =
    useRef(null);

  useEffect(() => {

    if (isPlaying) {

      const delay =
        Math.max(
          25,
          Math.floor(
            380 / speed
          )
        );

      timerRef.current =
        setInterval(() => {

          setCurrentStepIndex(
            (prev) => {

              if (
                prev >=
                totalSteps - 1
              ) {

                setIsPlaying(
                  false
                );

                return prev;
              }

              return prev + 1;
            }
          );

        }, delay);

    }
    else {

      if (timerRef.current) {

        clearInterval(
          timerRef.current
        );

      }

    }

    return () => {

      if (timerRef.current) {

        clearInterval(
          timerRef.current
        );

      }

    };

  }, [
    isPlaying,
    totalSteps,
    speed
  ]);


  /* =========================================================
     PLAYBACK CONTROLS
  ========================================================= */

  const handlePlay = () => {

    if (
      currentStepIndex >=
      totalSteps - 1
    ) {

      setCurrentStepIndex(0);

    }

    setIsPlaying(true);
  };


  const handlePause = () => {

    setIsPlaying(false);

  };


  const handleReset = () => {

    setIsPlaying(false);
    setCurrentStepIndex(0);

  };


  const handleStepForward = () => {

    if (
      currentStepIndex <
      totalSteps - 1
    ) {

      setCurrentStepIndex(
        (prev) => prev + 1
      );

    }

  };


  const handleStepBackward = () => {

    if (
      currentStepIndex > 0
    ) {

      setCurrentStepIndex(
        (prev) => prev - 1
      );

    }

  };


  const handleScrub = (
    newStepIndex
  ) => {

    setIsPlaying(false);

    setCurrentStepIndex(
      Math.max(
        0,
        Math.min(
          newStepIndex,
          Math.max(
            totalSteps - 1,
            0
          )
        )
      )
    );

  };


  /* =========================================================
     ALGORITHM SELECTION
  ========================================================= */

  const handleSelectAlgo = (
    algoId
  ) => {

    setIsPlaying(false);

    setActiveAlgo(algoId);

    setCurrentStepIndex(0);

    setChallengeKey(
      (prev) => prev + 1
    );

  };


  /* =========================================================
     AUDIO TOGGLE
  ========================================================= */

  const handleToggleAudio = () => {

    const nextState =
      sound.toggle();

    setIsAudioOn(
      nextState
    );

  };


  /* =========================================================
     RANDOMIZE ARRAY
  ========================================================= */

  const handleRandomizeArray = () => {

    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (
      activeAlgo ===
      'binary_search'
    ) {

      const arr = [];

      let value =
        Math.floor(
          Math.random() * 8
        ) + 4;

      for (
        let i = 0;
        i < 14;
        i++
      ) {

        arr.push(value);

        value +=
          Math.floor(
            Math.random() * 9
          ) + 3;

      }

      setSearchArray(arr);

      const randomTarget =
        arr[
          Math.floor(
            Math.random() *
              arr.length
          )
        ];

      setTargetValue(
        randomTarget
      );

    }

    else {

      const arr = [];

      for (
        let i = 0;
        i < arraySize;
        i++
      ) {

        arr.push(
          Math.floor(
            Math.random() * 90
          ) + 10
        );

      }

      setSortingArray(arr);

    }

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     SORTING PRESETS
  ========================================================= */

  const handleSetPresetArray = (
    preset
  ) => {

    setIsPlaying(false);
    setCurrentStepIndex(0);

    const arr = [];

    if (
      preset === 'reversed'
    ) {

      for (
        let i = arraySize;
        i >= 1;
        i--
      ) {

        arr.push(
          Math.round(
            (i / arraySize) * 95
          )
        );

      }

    }

    else if (
      preset ===
      'nearly_sorted'
    ) {

      for (
        let i = 1;
        i <= arraySize;
        i++
      ) {

        arr.push(
          Math.round(
            (i / arraySize) * 95
          )
        );

      }

      if (arr.length > 5) {

        const temp =
          arr[2];

        arr[2] =
          arr[4];

        arr[4] =
          temp;

      }

    }

    else if (
      preset ===
      'few_unique'
    ) {

      const palette = [
        15,
        35,
        60,
        85
      ];

      for (
        let i = 0;
        i < arraySize;
        i++
      ) {

        arr.push(
          palette[
            i % palette.length
          ]
        );

      }

      arr.sort(
        () =>
          Math.random() -
          0.5
      );

    }

    setSortingArray(arr);

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     ARRAY SIZE
  ========================================================= */

  const handleArraySizeChange = (
    newSize
  ) => {

    setArraySize(newSize);

    setIsPlaying(false);

    setCurrentStepIndex(0);

    const arr = [];

    for (
      let i = 0;
      i < newSize;
      i++
    ) {

      arr.push(
        Math.floor(
          Math.random() * 90
        ) + 10
      );

    }

    setSortingArray(arr);

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     CUSTOM ARRAY
  ========================================================= */

  const handleCustomArraySubmit = (
    newArr
  ) => {

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setArraySize(
      newArr.length
    );

    setSortingArray(
      newArr
    );

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     INTERACTIVE ARRAY EDITOR
  ========================================================= */

  const handleArrayValueChange = (
    index,
    value
  ) => {

    const numericValue =
      Number(value);

    if (
      Number.isNaN(
        numericValue
      )
    ) {
      return;
    }

    const nextArray = [
      ...sortingArray
    ];

    nextArray[index] =
      Math.max(
        1,
        Math.min(
          99,
          numericValue
        )
      );

    setSortingArray(
      nextArray
    );

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     GRAPH PRESET
  ========================================================= */

  const handleGraphPresetChange = (
    presetKey
  ) => {

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setGraphPresetKey(
      presetKey
    );

    const defaultStart =
      GRAPH_PRESETS[
        presetKey
      ]?.defaultStart ||
      'A';

    setStartNode(
      defaultStart
    );

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     GRAPH START NODE
  ========================================================= */

  const handleStartNodeChange = (
    nodeId
  ) => {

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setStartNode(
      nodeId
    );

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     GRID WALL
  ========================================================= */

  const handleToggleWall = (
    r,
    c
  ) => {

    if (isPlaying) {
      return;
    }

    setGrid(
      (prevGrid) => {

        const nextGrid =
          prevGrid.map(
            (row) =>
              row.map(
                (cell) => ({
                  ...cell
                })
              )
          );

        nextGrid[r][c].isWall =
          !nextGrid[r][c]
            .isWall;

        return nextGrid;
      }
    );

    setCurrentStepIndex(0);

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     CLEAR GRID
  ========================================================= */

  const handleClearGrid = () => {

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setGrid(
      createInitialGrid()
    );

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     GENERATE MAZE
  ========================================================= */

  const handleGenerateGridMaze = () => {

    setIsPlaying(false);

    setCurrentStepIndex(0);

    setGrid(
      generateRandomMaze(
        11,
        21,
        gridStart,
        gridEnd
      )
    );

    setChallengeKey(
      (prev) => prev + 1
    );
  };


  /* =========================================================
     AVAILABLE GRAPH NODES
  ========================================================= */

  const availableNodes =
    useMemo(() => {

      return (
        GRAPH_PRESETS[
          graphPresetKey
        ]?.nodes.map(
          (node) => node.id
        ) || []
      );

    }, [
      graphPresetKey
    ]);


  /* =========================================================
     CHALLENGE ANSWER
  ========================================================= */

  const handleChallengeAnswer = (
    answer,
    correct
  ) => {

    if (correct) {

      const basePoints =
        challenge?.points ||
        10;

      /*
       * Streak bonus:
       *
       * 1st correct = +0 bonus
       * 2nd correct = +2 bonus
       * 3rd correct = +4 bonus
       * 4th correct = +6 bonus
       * ...
       */

      const streakBonus =
        Math.max(
          0,
          challengeStreak * 2
        );

      const earnedXP =
        basePoints +
        streakBonus;

      const newStreak =
        challengeStreak + 1;

      setChallengeScore(
        (prev) =>
          prev + earnedXP
      );

      setChallengeStreak(
        newStreak
      );

      setProgress(
        (prev) => {

          const updated =
            addChallengeResult(
              prev,
              true,
              earnedXP,
              newStreak
            );

          saveProgress(
            updated
          );

          return updated;
        }
      );

    }

    else {

      setChallengeStreak(0);

      setProgress(
        (prev) => {

          const updated =
            addChallengeResult(
              prev,
              false,
              0,
              0
            );

          saveProgress(
            updated
          );

          return updated;
        }
      );

    }

  };


  /* =========================================================
     NEXT CHALLENGE
  ========================================================= */

  const handleNextChallenge = () => {

    setChallengeKey(
      (prev) => prev + 1
    );

    setIsPlaying(false);

    if (
      currentStepIndex <
      totalSteps - 1
    ) {

      setCurrentStepIndex(
        (prev) => prev + 1
      );

    }

  };


  /* =========================================================
     RESET CHALLENGE SESSION
  ========================================================= */

  const handleResetChallenge = () => {

    setChallengeScore(0);

    setChallengeStreak(0);

    setChallengeKey(
      (prev) => prev + 1
    );

    setIsPlaying(false);

    setCurrentStepIndex(0);

  };


  /* =========================================================
     RESET ALL XP / PROGRESS
  ========================================================= */

  const handleResetProgress = () => {

    const freshProgress =
      resetProgress();

    setProgress(
      freshProgress
    );

    setChallengeScore(0);

    setChallengeStreak(0);

    setChallengeKey(
      (prev) => prev + 1
    );

  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="min-h-screen bg-slate-950/90 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">

      {/* =====================================================
          INTERACTIVE BACKGROUND
      ===================================================== */}

      <InteractiveBackground />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-20">

        <Header
          activeAlgo={
            activeAlgo
          }

          onSelectAlgo={
            handleSelectAlgo
          }

          isAudioOn={
            isAudioOn
          }

          onToggleAudio={
            handleToggleAudio
          }

          onOpenInfoModal={() =>
            setIsInfoOpen(true)
          }
        />

      </div>


      {/* =====================================================
          CONTROL BAR
      ===================================================== */}

      <div className="relative z-20">

        <ControlBar

          isPlaying={
            isPlaying
          }

          isComplete={
            isComplete
          }

          currentStep={
            currentStepIndex
          }

          totalSteps={
            totalSteps
          }

          onPlay={
            handlePlay
          }

          onPause={
            handlePause
          }

          onReset={
            handleReset
          }

          onStepForward={
            handleStepForward
          }

          onStepBackward={
            handleStepBackward
          }

          onScrub={
            handleScrub
          }

          speed={
            speed
          }

          onSpeedChange={
            setSpeed
          }

          activeAlgo={
            activeAlgo
          }

          arraySize={
            arraySize
          }

          onArraySizeChange={
            handleArraySizeChange
          }

          onRandomizeArray={
            handleRandomizeArray
          }

          onSetPresetArray={
            handleSetPresetArray
          }

          onCustomArraySubmit={
            handleCustomArraySubmit
          }

          targetValue={
            targetValue
          }

          onTargetValueChange={
            setTargetValue
          }

          searchArray={
            searchArray
          }

          viewMode={
            viewMode
          }

          onViewModeChange={
            setViewMode
          }

          graphPreset={
            graphPresetKey
          }

          onGraphPresetChange={
            handleGraphPresetChange
          }

          startNode={
            startNode
          }

          onStartNodeChange={
            handleStartNodeChange
          }

          availableNodes={
            availableNodes
          }

          onGenerateGridMaze={
            handleGenerateGridMaze
          }

          onClearGrid={
            handleClearGrid
          }

        />

      </div>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6 relative z-10">


        {/* ===================================================
            INTERACTIVE ARRAY EDITOR
        =================================================== */}

        {(activeAlgo === 'bubble_sort' ||
          activeAlgo === 'merge_sort') && (

          <section className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:p-5 shadow-xl backdrop-blur-md">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

              <div>

                <h2 className="text-sm font-bold text-white">
                  Interactive Array Editor
                </h2>

                <p className="text-[11px] text-slate-500 mt-1">
                  Change values before running the algorithm.
                </p>

              </div>


              <div className="flex flex-wrap gap-2">

                <button
                  onClick={
                    handleRandomizeArray
                  }

                  disabled={
                    isPlaying
                  }

                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 disabled:opacity-40"
                >
                  🎲 Randomize
                </button>


                <button
                  onClick={() => {

                    setIsPlaying(
                      false
                    );

                    setCurrentStepIndex(
                      0
                    );

                    setChallengeKey(
                      (prev) =>
                        prev + 1
                    );

                  }}

                  disabled={
                    isPlaying
                  }

                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 disabled:opacity-40"
                >
                  ↻ Regenerate
                </button>

              </div>

            </div>


            <div className="mb-4">

              <div className="flex justify-between text-[11px] text-slate-500 mb-1">

                <span>
                  Array Size
                </span>

                <span className="font-mono text-cyan-400">
                  {
                    sortingArray.length
                  }
                </span>

              </div>


              <input
                type="range"
                min="4"
                max="20"
                value={
                  sortingArray.length
                }
                disabled={
                  isPlaying
                }

                onChange={(e) =>
                  handleArraySizeChange(
                    Number(
                      e.target.value
                    )
                  )
                }

                className="w-full accent-cyan-500"
              />

            </div>


            <div className="flex flex-wrap gap-2">

              {sortingArray.map(
                (value, index) => (

                  <div
                    key={index}
                    className="flex flex-col items-center gap-1"
                  >

                    <span className="text-[9px] text-slate-600 font-mono">
                      {index}
                    </span>


                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={
                        value
                      }

                      disabled={
                        isPlaying
                      }

                      onChange={(e) =>
                        handleArrayValueChange(
                          index,
                          e.target.value
                        )
                      }

                      className="w-12 h-9 rounded-lg border border-slate-700 bg-slate-900 text-center text-xs font-mono text-white outline-none focus:border-cyan-500 disabled:opacity-40"
                    />

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* ===================================================
            LIVE ALGORITHM EXPLANATION
        =================================================== */}

        <section className="w-full rounded-2xl border border-cyan-500/10 bg-slate-950/70 p-4 md:p-5 shadow-xl backdrop-blur-md">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <h2 className="text-sm font-bold text-white">
                Live Algorithm Explanation
              </h2>

              <p className="text-[11px] text-slate-500 mt-1">
                Understand what the algorithm is doing right now.
              </p>

            </div>


            <div className="text-[11px] font-mono text-cyan-400">

              Step{' '}

              {Math.min(
                currentStepIndex + 1,
                Math.max(
                  totalSteps,
                  1
                )
              )}

              {' / '}

              {totalSteps}

            </div>

          </div>


          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-sm font-semibold text-cyan-300">

              {
                currentStep.description ||
                'Ready to visualize the algorithm.'
              }

            </p>


            {currentStep.comparing?.length > 0 && (

              <p className="mt-2 text-xs text-slate-400">

                Comparing indices:{' '}

                <span className="text-amber-300 font-mono">

                  {
                    currentStep.comparing.join(
                      ' and '
                    )
                  }

                </span>

              </p>

            )}


            {currentStep.swapping?.length > 0 && (

              <p className="mt-2 text-xs text-slate-400">

                Swapping indices:{' '}

                <span className="text-rose-300 font-mono">

                  {
                    currentStep.swapping.join(
                      ' and '
                    )
                  }

                </span>

              </p>

            )}


            {currentStep.writing !== undefined &&
              currentStep.writing !== null && (

                <p className="mt-2 text-xs text-slate-400">

                  Writing at index:{' '}

                  <span className="text-purple-300 font-mono">

                    {
                      currentStep.writing
                    }

                  </span>

                </p>

            )}


            {currentStep.left !== undefined &&
              currentStep.right !== undefined && (

                <p className="mt-2 text-xs text-slate-400">

                  Search range:{' '}

                  <span className="text-cyan-300 font-mono">

                    [
                    {currentStep.left},
                    {', '}
                    {currentStep.right}
                    ]

                  </span>

                </p>

            )}


            {currentStep.mid !== undefined &&
              currentStep.mid !== null && (

                <p className="mt-2 text-xs text-slate-400">

                  Midpoint:{' '}

                  <span className="text-purple-300 font-mono">

                    {
                      currentStep.mid
                    }

                  </span>

                </p>

            )}


            {currentStep.currentNode && (

              <p className="mt-2 text-xs text-slate-400">

                Current node:{' '}

                <span className="text-emerald-300 font-mono">

                  {
                    currentStep.currentNode
                  }

                </span>

              </p>

            )}


            {currentStep.currentCell && (

              <p className="mt-2 text-xs text-slate-400">

                Current cell:{' '}

                <span className="text-emerald-300 font-mono">

                  {
                    JSON.stringify(
                      currentStep.currentCell
                    )
                  }

                </span>

              </p>

            )}

          </div>

        </section>


        {/* ===================================================
            VISUALIZER
        =================================================== */}

        <section
          aria-label="Visualizer Canvas"
          className="w-full"
        >

          {/* Bubble Sort */}

          {activeAlgo ===
            'bubble_sort' && (

            <SortingVisualizer

              array={
                currentStep.array ||
                sortingArray
              }

              comparingIndices={
                currentStep.comparing
              }

              swappingIndices={
                currentStep.swapping
              }

              sortedIndices={
                currentStep.sorted
              }

              activeAlgo="bubble_sort"

            />

          )}


          {/* Merge Sort */}

          {activeAlgo ===
            'merge_sort' && (

            <SortingVisualizer

              array={
                currentStep.array ||
                sortingArray
              }

              comparingIndices={
                currentStep.comparing
              }

              swappingIndices={
                currentStep.swapping
              }

              writingIndex={
                currentStep.writing
              }

              sortedIndices={
                currentStep.sorted
              }

              activeRange={
                currentStep.activeRange
              }

              midIndex={
                currentStep.mid
              }

              activeAlgo="merge_sort"

            />

          )}


          {/* Binary Search */}

          {activeAlgo ===
            'binary_search' && (

            <BinarySearchVisualizer

              array={
                currentStep.array ||
                searchArray
              }

              left={
                currentStep.left !==
                undefined
                  ? currentStep.left
                  : 0
              }

              right={
                currentStep.right !==
                undefined
                  ? currentStep.right
                  : searchArray.length - 1
              }

              mid={
                currentStep.mid
              }

              target={
                currentStep.target !==
                undefined
                  ? currentStep.target
                  : targetValue
              }

              eliminated={
                currentStep.eliminated ||
                []
              }

              foundIndex={
                currentStep.foundIndex
              }

              isComplete={
                currentStep.isComplete
              }

              success={
                currentStep.success
              }

            />

          )}


          {/* BFS / DFS Graph */}

          {(activeAlgo === 'bfs' ||
            activeAlgo === 'dfs') &&
            viewMode === 'graph' && (

            <GraphVisualizer

              graphData={
                GRAPH_PRESETS[
                  graphPresetKey
                ]
              }

              activeAlgo={
                activeAlgo
              }

              currentNode={
                currentStep.currentNode
              }

              examiningNeighbor={
                currentStep.examiningNeighbor
              }

              visited={
                currentStep.visited ||
                []
              }

              traversedEdges={
                currentStep.traversedEdges ||
                []
              }

              queue={
                currentStep.queue ||
                []
              }

              stack={
                currentStep.stack ||
                []
              }

              levels={
                currentStep.levels ||
                {}
              }

              backtracking={
                currentStep.backtracking
              }

              isComplete={
                currentStep.isComplete
              }

            />

          )}


          {/* BFS / DFS Grid */}

          {(activeAlgo === 'bfs' ||
            activeAlgo === 'dfs') &&
            viewMode === 'grid' && (

            <GridVisualizer

              grid={
                grid
              }

              onToggleWall={
                handleToggleWall
              }

              start={
                gridStart
              }

              end={
                gridEnd
              }

              visitedCells={
                currentStep.visitedCells ||
                []
              }

              currentCell={
                currentStep.currentCell
              }

              path={
                currentStep.path ||
                []
              }

              activeAlgo={
                activeAlgo
              }

              isComplete={
                currentStep.isComplete
              }

              success={
                currentStep.success
              }

            />

          )}

        </section>


        {/* ===================================================
            CHALLENGE MODE
        =================================================== */}

        <ChallengePanel

          challenge={
            challenge
          }

          score={
            challengeScore
          }

          streak={
            challengeStreak
          }

          onAnswer={
            handleChallengeAnswer
          }

          onNextChallenge={
            handleNextChallenge
          }

          onReset={
            handleResetChallenge
          }

          disabled={
            isPlaying
          }

        />


        {/* ===================================================
            LEARNING PROGRESS
        =================================================== */}

        <ProgressPanel

          progress={
            progress
          }

          onReset={
            handleResetProgress
          }

        />


        {/* ===================================================
            ANALYTICS
        =================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Pseudocode */}

            <PseudocodeViewer

              codeLines={
                ALGORITHMS[
                  activeAlgo
                ]?.code || []
              }

              activeLine={
                currentStep.line
              }

              currentDescription={
                currentStep.description
              }

            />


            {/* Complexity */}

            <ComplexityCard
              activeAlgo={
                activeAlgo
              }
            />

          </div>


          <div className="flex flex-col gap-6">

            {/* Metrics */}

            <MetricsPanel

              comparisons={
                metrics.comparisons
              }

              swaps={
                metrics.swaps
              }

              visitedCount={
                metrics.visitedCount
              }

              queueOrStackDepth={
                metrics.queueOrStackDepth
              }

              currentStep={
                currentStepIndex
              }

              totalSteps={
                totalSteps
              }

              activeAlgo={
                activeAlgo
              }

              isComplete={
                isComplete
              }

            />


            {/* Controls Guide */}

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">

              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                Interactive Controls Guide
              </h4>


              <ul className="space-y-1.5 list-disc list-inside">

                <li>

                  Use{' '}

                  <strong className="text-cyan-300">
                    Play ▶️
                  </strong>

                  {' '}to watch the algorithm auto-execute.

                </li>


                <li>

                  Use{' '}

                  <strong className="text-cyan-300">
                    Pause ⏸️
                  </strong>

                  {' '}and{' '}

                  <strong className="text-cyan-300">
                    Step Forward ⏭️
                  </strong>

                  {' '}for step-by-step code walkthrough.

                </li>


                <li>

                  Drag the{' '}

                  <strong className="text-indigo-400">
                    Timeline slider
                  </strong>

                  {' '}to jump straight to any point in time.

                </li>


                <li>

                  For BFS/DFS, toggle between{' '}

                  <strong className="text-emerald-400">
                    Network Graph
                  </strong>

                  {' '}and{' '}

                  <strong className="text-emerald-400">
                    2D Grid Maze
                  </strong>

                  !

                </li>

              </ul>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-20 border-t border-slate-800/80 bg-slate-950/70 py-4 px-4 text-center text-xs text-slate-500">

        <p>
          ACM GRIET · Interactive Algorithm Visualizer · Built with React, Tailwind CSS & Web Audio
        </p>

      </footer>


      {/* =====================================================
          INFO MODAL
      ===================================================== */}

      <InfoModal

        isOpen={
          isInfoOpen
        }

        onClose={() =>
          setIsInfoOpen(false)
        }

      />

    </div>
  );
}