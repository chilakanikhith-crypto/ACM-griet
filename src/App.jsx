import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

import { generateBubbleSortSteps } from './algorithms/bubbleSort';
import { generateMergeSortSteps } from './algorithms/mergeSort';
import { generateBinarySearchSteps } from './algorithms/binarySearch';
import { generateGraphBFSSteps, generateGridBFSSteps } from './algorithms/bfs';
import { generateGraphDFSSteps, generateGridDFSSteps } from './algorithms/dfs';
import { GRAPH_PRESETS } from './algorithms/graphData';
import { ALGORITHMS } from './algorithms/algorithmMeta';
import { createInitialGrid, generateRandomMaze } from './utils/gridUtils';
import { sound } from './utils/sound';

export default function App() {
  // Navigation & Modal State
  const [activeAlgo, setActiveAlgo] = useState('bubble_sort');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInteractiveBg, setIsInteractiveBg] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1); // 0.25x to 4x

  // Sorting State
  const [arraySize, setArraySize] = useState(16);
  const [sortingArray, setSortingArray] = useState([
    45, 18, 72, 89, 31, 64, 12, 53, 95, 27, 40, 81, 6, 68, 50, 36
  ]);

  // Binary Search State
  const [searchArray, setSearchArray] = useState([
    8, 15, 22, 31, 40, 47, 55, 63, 71, 79, 88, 94
  ]);
  const [targetValue, setTargetValue] = useState(47);

  // Graph / Grid State
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'grid'
  const [graphPresetKey, setGraphPresetKey] = useState('tree');
  const [startNode, setStartNode] = useState('A');

  // Grid State
  const gridStart = { r: 5, c: 3 };
  const gridEnd = { r: 5, c: 17 };
  const [grid, setGrid] = useState(() => createInitialGrid());

  // Step Generation Cache
  const steps = useMemo(() => {
    switch (activeAlgo) {
      case 'bubble_sort':
        return generateBubbleSortSteps(sortingArray);
      case 'merge_sort':
        return generateMergeSortSteps(sortingArray);
      case 'binary_search':
        return generateBinarySearchSteps(searchArray, targetValue);
      case 'bfs':
        if (viewMode === 'graph') {
          return generateGraphBFSSteps(GRAPH_PRESETS[graphPresetKey], startNode);
        } else {
          return generateGridBFSSteps(grid, gridStart, gridEnd);
        }
      case 'dfs':
        if (viewMode === 'graph') {
          return generateGraphDFSSteps(GRAPH_PRESETS[graphPresetKey], startNode);
        } else {
          return generateGridDFSSteps(grid, gridStart, gridEnd);
        }
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

  // Current Step Snapshot
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || steps[0] || {};
  const isComplete = currentStepIndex >= totalSteps - 1;

  // Sound triggering on step change
  useEffect(() => {
    if (!isAudioOn || !currentStep) return;

    if (currentStep.swapping && currentStep.swapping.length > 0) {
      sound.playSwap(currentStep.array?.[currentStep.swapping[0]] || 50);
    } else if (currentStep.writing !== undefined && currentStep.writing !== null) {
      sound.playSwap(currentStep.array?.[currentStep.writing] || 50);
    } else if (currentStep.comparing && currentStep.comparing.length > 0) {
      sound.playCompare(currentStep.array?.[currentStep.comparing[0]] || 40);
    } else if (currentStep.currentNode) {
      const idx = currentStep.currentNode.charCodeAt(0) || 0;
      sound.playVisit(idx);
    } else if (currentStep.foundIndex !== null && currentStep.isComplete) {
      sound.playSuccess();
    }
  }, [currentStepIndex, isAudioOn, currentStep]);

  // Animation Playback Loop
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(25, Math.floor(380 / speed));

      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSteps, speed]);

  // Handlers
  const handlePlay = () => {
    if (currentStepIndex >= totalSteps - 1) {
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
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleScrub = (newStepIndex) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(newStepIndex, totalSteps - 1)));
  };

  // Switch Algorithm
  const handleSelectAlgo = (algoId) => {
    setIsPlaying(false);
    setActiveAlgo(algoId);
    setCurrentStepIndex(0);
  };

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextState = sound.toggle();
    setIsAudioOn(nextState);
  };

  // Sorting Data Generators
  const handleRandomizeArray = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (activeAlgo === 'binary_search') {
      const arr = [];
      let val = Math.floor(Math.random() * 8) + 4;
      for (let i = 0; i < 14; i++) {
        arr.push(val);
        val += Math.floor(Math.random() * 9) + 3;
      }
      setSearchArray(arr);
      // Pick random target from array or nearby
      const randomTarget = arr[Math.floor(Math.random() * arr.length)];
      setTargetValue(randomTarget);
    } else {
      const arr = [];
      for (let i = 0; i < arraySize; i++) {
        arr.push(Math.floor(Math.random() * 90) + 10);
      }
      setSortingArray(arr);
    }
  };

  const handleSetPresetArray = (preset) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    const arr = [];
    if (preset === 'reversed') {
      for (let i = arraySize; i >= 1; i--) {
        arr.push(Math.round((i / arraySize) * 95));
      }
    } else if (preset === 'nearly_sorted') {
      for (let i = 1; i <= arraySize; i++) {
        arr.push(Math.round((i / arraySize) * 95));
      }
      // swap a couple pairs
      if (arr.length > 5) {
        const tmp = arr[2];
        arr[2] = arr[4];
        arr[4] = tmp;
      }
    } else if (preset === 'few_unique') {
      const palette = [15, 35, 60, 85];
      for (let i = 0; i < arraySize; i++) {
        arr.push(palette[i % palette.length]);
      }
      arr.sort(() => Math.random() - 0.5);
    }
    setSortingArray(arr);
  };

  const handleArraySizeChange = (newSize) => {
    setArraySize(newSize);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    const arr = [];
    for (let i = 0; i < newSize; i++) {
      arr.push(Math.floor(Math.random() * 90) + 10);
    }
    setSortingArray(arr);
  };

  const handleCustomArraySubmit = (newArr) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setArraySize(newArr.length);
    setSortingArray(newArr);
  };

  // Graph Presets
  const handleGraphPresetChange = (presetKey) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setGraphPresetKey(presetKey);
    const defaultStart = GRAPH_PRESETS[presetKey]?.defaultStart || 'A';
    setStartNode(defaultStart);
  };

  const handleStartNodeChange = (nodeId) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setStartNode(nodeId);
  };

  // Grid Wall Toggle
  const handleToggleWall = (r, c) => {
    if (isPlaying) return;
    setGrid((prevGrid) => {
      const nextGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      nextGrid[r][c].isWall = !nextGrid[r][c].isWall;
      return nextGrid;
    });
    setCurrentStepIndex(0);
  };

  const handleClearGrid = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setGrid(createInitialGrid());
  };

  const handleGenerateGridMaze = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setGrid(generateRandomMaze(11, 21, gridStart, gridEnd));
  };

  // Available graph nodes for current preset
  const availableNodes = useMemo(() => {
    return GRAPH_PRESETS[graphPresetKey]?.nodes.map((n) => n.id) || [];
  }, [graphPresetKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Interactive Background Canvas */}
      {isInteractiveBg && <InteractiveBackground />}

      {/* Top Navbar */}
      <Header
        activeAlgo={activeAlgo}
        onSelectAlgo={handleSelectAlgo}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        isInteractiveBg={isInteractiveBg}
        onToggleInteractiveBg={() => setIsInteractiveBg((prev) => !prev)}
        onOpenInfoModal={() => setIsInfoOpen(true)}
      />

      {/* Main Control Bar */}
      <ControlBar
        isPlaying={isPlaying}
        isComplete={isComplete}
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onScrub={handleScrub}
        speed={speed}
        onSpeedChange={setSpeed}
        activeAlgo={activeAlgo}
        // Sorting props
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        onRandomizeArray={handleRandomizeArray}
        onSetPresetArray={handleSetPresetArray}
        onCustomArraySubmit={handleCustomArraySubmit}
        // Binary Search props
        targetValue={targetValue}
        onTargetValueChange={setTargetValue}
        searchArray={searchArray}
        // Graph / Grid props
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        graphPreset={graphPresetKey}
        onGraphPresetChange={handleGraphPresetChange}
        startNode={startNode}
        onStartNodeChange={handleStartNodeChange}
        availableNodes={availableNodes}
        onGenerateGridMaze={handleGenerateGridMaze}
        onClearGrid={handleClearGrid}
      />

      {/* Main Application Visualizer Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6 relative z-10">
        
        {/* Primary Interactive Visualizer Canvas */}
        <section aria-label="Visualizer Canvas" className="w-full">
          {activeAlgo === 'bubble_sort' && (
            <SortingVisualizer
              array={currentStep.array || sortingArray}
              comparingIndices={currentStep.comparing}
              swappingIndices={currentStep.swapping}
              sortedIndices={currentStep.sorted}
              activeAlgo="bubble_sort"
            />
          )}

          {activeAlgo === 'merge_sort' && (
            <SortingVisualizer
              array={currentStep.array || sortingArray}
              comparingIndices={currentStep.comparing}
              writingIndex={currentStep.writing}
              sortedIndices={currentStep.sorted}
              activeRange={currentStep.activeRange}
              midIndex={currentStep.mid}
              activeAlgo="merge_sort"
            />
          )}

          {activeAlgo === 'binary_search' && (
            <BinarySearchVisualizer
              array={currentStep.array || searchArray}
              left={currentStep.left !== undefined ? currentStep.left : 0}
              right={currentStep.right !== undefined ? currentStep.right : searchArray.length - 1}
              mid={currentStep.mid}
              target={currentStep.target !== undefined ? currentStep.target : targetValue}
              eliminated={currentStep.eliminated || []}
              foundIndex={currentStep.foundIndex}
              isComplete={currentStep.isComplete}
              success={currentStep.success}
            />
          )}

          {(activeAlgo === 'bfs' || activeAlgo === 'dfs') && viewMode === 'graph' && (
            <GraphVisualizer
              graphData={GRAPH_PRESETS[graphPresetKey]}
              activeAlgo={activeAlgo}
              currentNode={currentStep.currentNode}
              examiningNeighbor={currentStep.examiningNeighbor}
              visited={currentStep.visited || []}
              traversedEdges={currentStep.traversedEdges || []}
              queue={currentStep.queue || []}
              stack={currentStep.stack || []}
              levels={currentStep.levels || {}}
              backtracking={currentStep.backtracking}
              isComplete={currentStep.isComplete}
            />
          )}

          {(activeAlgo === 'bfs' || activeAlgo === 'dfs') && viewMode === 'grid' && (
            <GridVisualizer
              grid={grid}
              onToggleWall={handleToggleWall}
              start={gridStart}
              end={gridEnd}
              visitedCells={currentStep.visitedCells || []}
              currentCell={currentStep.currentCell}
              path={currentStep.path || []}
              activeAlgo={activeAlgo}
              isComplete={currentStep.isComplete}
              success={currentStep.success}
            />
          )}
        </section>

        {/* Analytical & Educational Split Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pseudocode & Step Explanation (Takes 2 Columns on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <PseudocodeViewer
              codeLines={ALGORITHMS[activeAlgo]?.code || []}
              activeLine={currentStep.line}
              currentDescription={currentStep.description}
            />

            <ComplexityCard activeAlgo={activeAlgo} />
          </div>

          {/* Real-time Telemetry & Metrics (Takes 1 Column on desktop) */}
          <div className="flex flex-col gap-6">
            <MetricsPanel
              comparisons={currentStep.comparisons || 0}
              swaps={currentStep.swaps || 0}
              visitedCount={currentStep.visited?.length || currentStep.visitedCells?.length || 0}
              queueOrStackDepth={
                currentStep.queue ? currentStep.queue.length : currentStep.stack ? currentStep.stack.length : currentStep.queueSize || currentStep.stackSize || 0
              }
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              activeAlgo={activeAlgo}
              isComplete={isComplete}
            />

            {/* Quick Tips Card */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                Interactive Controls Guide
              </h4>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Use <strong className="text-cyan-300">Play ▶️</strong> to watch the algorithm auto-execute.</li>
                <li>Use <strong className="text-cyan-300">Pause ⏸️</strong> and <strong className="text-cyan-300">Step Forward ⏭️</strong> for step-by-step code walkthrough.</li>
                <li>Drag the <strong className="text-indigo-400">Timeline slider</strong> to jump straight to any point in time.</li>
                <li>For BFS/DFS, toggle between <strong className="text-emerald-400">Network Graph</strong> and <strong className="text-emerald-400">2D Grid Maze</strong>!</li>
              </ul>
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          ACM GRIET Round 2 · Interactive Algorithm Visualizer · Built with React, Tailwind CSS & Web Audio
        </p>
      </footer>

      {/* Guide Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

    </div>
  );
}
