import React, { useState } from 'react';

import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge,
  Shuffle,
  Sliders,
  PlusCircle,
  Grid as GridIcon,
  Network as NetworkIcon,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

export default function ControlBar({
  isPlaying,
  isComplete,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onScrub,
  speed,
  onSpeedChange,
  activeAlgo,

  // Sorting props
  arraySize,
  onArraySizeChange,
  onRandomizeArray,
  onSetPresetArray,
  onCustomArraySubmit,

  // Binary Search props
  targetValue,
  onTargetValueChange,
  searchArray,

  // Graph / Grid props
  viewMode,
  onViewModeChange,
  graphPreset,
  onGraphPresetChange,
  startNode,
  onStartNodeChange,
  availableNodes,
  onGenerateGridMaze,
  onClearGrid
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const isSorting =
    activeAlgo === 'bubble_sort' ||
    activeAlgo === 'merge_sort';

  const isSearch = activeAlgo === 'binary_search';

  const isGraphAlgo =
    activeAlgo === 'bfs' ||
    activeAlgo === 'dfs';

  const maxStep = Math.max(0, totalSteps - 1);

  const progress =
    totalSteps > 1
      ? Math.round((currentStep / maxStep) * 100)
      : 0;

  const handleCustomSubmit = (e) => {
    e.preventDefault();

    if (!customInputText.trim()) {
      return;
    }

    const parsed = customInputText
      .split(/[\s,]+/)
      .map((num) => parseInt(num.trim(), 10))
      .filter(
        (num) =>
          !isNaN(num) &&
          num > 0 &&
          num <= 100
      );

    if (parsed.length >= 3) {
      onCustomArraySubmit(parsed.slice(0, 30));

      setShowCustomModal(false);
      setCustomInputText('');
    } else {
      alert(
        'Please enter at least 3 valid positive numbers between 1 and 100 (comma or space separated).'
      );
    }
  };

  return (
    <div className="bg-slate-900/90 border-y border-slate-800 p-4 backdrop-blur-md shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">

        {/* ========================================================= */}
        {/* TOP ROW */}
        {/* ========================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* ======================================================= */}
          {/* PLAYBACK CONTROLS */}
          {/* ======================================================= */}

          <div className="flex items-center gap-2 flex-wrap">

            {/* Reset */}
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 hover:border-slate-600 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Reset visualizer to step 0"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Reset</span>
            </button>

            {/* Step Backward */}
            <button
              onClick={onStepBackward}
              disabled={
                isPlaying ||
                currentStep <= 0
              }
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-semibold text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer"
              title="Step backward one step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            {isPlaying ? (
              <button
                onClick={onPause}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                title="Pause execution"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={onPlay}
                disabled={
                  isComplete &&
                  currentStep >= maxStep
                }
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                title="Play algorithm step-by-step"
              >
                <Play className="w-4 h-4 fill-white" />

                <span>
                  {currentStep > 0 && !isComplete
                    ? 'Resume'
                    : 'Play'}
                </span>
              </button>
            )}

            {/* Step Forward */}
            <button
              onClick={onStepForward}
              disabled={
                isPlaying ||
                (isComplete &&
                  currentStep >= maxStep)
              }
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-semibold text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer"
              title="Step forward one step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed */}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-800">
              <Gauge className="w-4 h-4 text-slate-400" />

              <span className="text-xs font-medium text-slate-400">
                Speed:
              </span>

              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={speed}
                onChange={(e) =>
                  onSpeedChange(
                    parseFloat(e.target.value)
                  )
                }
                className="w-20 md:w-28 accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />

              <span className="text-xs font-mono font-semibold text-cyan-300 w-8">
                {speed}x
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* TIMELINE */}
          {/* ======================================================= */}

          <div className="flex flex-col gap-2 flex-1 lg:max-w-md bg-slate-950/60 px-3.5 py-2.5 rounded-xl border border-slate-800/80">

            {/* Timeline Header */}
            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />

                <span className="text-xs font-semibold text-slate-300">
                  Execution Progress
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-cyan-300">
                {progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">

              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-200"
                style={{
                  width: `${progress}%`
                }}
              />

              {/* Moving glow */}
              {isPlaying && (
                <div
                  className="absolute top-0 h-full w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                  style={{
                    left: `calc(${Math.max(
                      progress - 5,
                      0
                    )}% )`
                  }}
                />
              )}
            </div>

            {/* Timeline Slider */}
            <div className="flex items-center gap-3">

              <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                Timeline
              </span>

              <input
                type="range"
                min="0"
                max={maxStep}
                value={Math.min(
                  currentStep,
                  maxStep
                )}
                onChange={(e) =>
                  onScrub(
                    parseInt(
                      e.target.value,
                      10
                    )
                  )
                }
                disabled={isPlaying}
                className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-50"
              />

              <div className="text-xs font-mono whitespace-nowrap bg-slate-800 px-2 py-0.5 rounded">

                <span className="text-cyan-400 font-semibold">
                  {currentStep}
                </span>

                <span className="text-slate-500">
                  {' '}
                  /{' '}
                </span>

                <span className="text-slate-300">
                  {maxStep}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ROW */}
        {/* ========================================================= */}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/50">

          {/* ======================================================= */}
          {/* SORTING CONTROLS */}
          {/* ======================================================= */}

          {isSorting && (
            <div className="flex items-center gap-2.5 flex-wrap">

              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />

                Array:
              </span>

              {/* Randomize */}
              <button
                onClick={onRandomizeArray}
                disabled={isPlaying}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Randomize</span>
              </button>

              {/* Reversed */}
              <button
                onClick={() =>
                  onSetPresetArray('reversed')
                }
                disabled={isPlaying}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Reversed
              </button>

              {/* Nearly Sorted */}
              <button
                onClick={() =>
                  onSetPresetArray(
                    'nearly_sorted'
                  )
                }
                disabled={isPlaying}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Nearly Sorted
              </button>

              {/* Duplicates */}
              <button
                onClick={() =>
                  onSetPresetArray(
                    'few_unique'
                  )
                }
                disabled={isPlaying}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Duplicates
              </button>

              {/* Array Size */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">

                <span className="text-xs text-slate-400">
                  Size:
                </span>

                <input
                  type="range"
                  min="4"
                  max="20"
                  value={arraySize}
                  onChange={(e) =>
                    onArraySizeChange(
                      parseInt(
                        e.target.value,
                        10
                      )
                    )
                  }
                  disabled={isPlaying}
                  className="w-20 accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-50"
                />

                <span className="text-xs font-mono text-cyan-300">
                  {arraySize}
                </span>
              </div>

              {/* Custom */}
              <button
                onClick={() =>
                  setShowCustomModal(true)
                }
                disabled={isPlaying}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />

                <span>Custom</span>
              </button>
            </div>
          )}

          {/* ======================================================= */}
          {/* BINARY SEARCH */}
          {/* ======================================================= */}

          {isSearch && (
            <div className="flex items-center gap-3 flex-wrap">

              <div className="flex items-center gap-2">

                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />

                  Target Value:
                </span>

                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) =>
                    onTargetValueChange(
                      parseInt(
                        e.target.value,
                        10
                      ) || 0
                    )
                  }
                  disabled={isPlaying}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs font-bold text-center focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Quick Pick */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">

                <span className="text-[11px] text-slate-500">
                  Pick:
                </span>

                {searchArray &&
                  searchArray
                    .slice(0, 7)
                    .map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          onTargetValueChange(
                            val
                          )
                        }
                        disabled={isPlaying}
                        className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer transition ${
                          targetValue === val
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
              </div>

              {/* Not Found Test */}
              <button
                onClick={() =>
                  onTargetValueChange(999)
                }
                disabled={isPlaying}
                className="px-2 py-0.5 rounded text-xs font-mono bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 cursor-pointer"
              >
                999 (Not In Arr)
              </button>

              {/* New Search Array */}
              <button
                onClick={onRandomizeArray}
                disabled={isPlaying}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                <Shuffle className="w-3 h-3 text-cyan-400" />
                <span>New Array</span>
              </button>
            </div>
          )}

          {/* ======================================================= */}
          {/* BFS / DFS */}
          {/* ======================================================= */}

          {isGraphAlgo && (
            <div className="flex items-center gap-3 flex-wrap">

              {/* Graph / Grid */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">

                <button
                  onClick={() =>
                    onViewModeChange('graph')
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition ${
                    viewMode === 'graph'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <NetworkIcon className="w-3.5 h-3.5" />
                  <span>Interactive Graph</span>
                </button>

                <button
                  onClick={() =>
                    onViewModeChange('grid')
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GridIcon className="w-3.5 h-3.5" />
                  <span>2D Grid Maze</span>
                </button>
              </div>

              {viewMode === 'graph' ? (
                <>
                  {/* Graph Presets */}
                  <div className="flex items-center gap-1.5">

                    <span className="text-xs text-slate-400">
                      Topology:
                    </span>

                    <select
                      value={graphPreset}
                      onChange={(e) =>
                        onGraphPresetChange(
                          e.target.value
                        )
                      }
                      disabled={isPlaying}
                      className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="tree">
                        Binary Tree
                      </option>

                      <option value="cyclic">
                        Network with Cycles
                      </option>

                      <option value="dag">
                        Complex Web (8 Nodes)
                      </option>
                    </select>
                  </div>

                  {/* Start Node */}
                  <div className="flex items-center gap-1.5">

                    <span className="text-xs text-slate-400">
                      Start Node:
                    </span>

                    <select
                      value={startNode}
                      onChange={(e) =>
                        onStartNodeChange(
                          e.target.value
                        )
                      }
                      disabled={isPlaying}
                      className="bg-slate-800 text-cyan-300 font-bold border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      {availableNodes?.map(
                        (nodeId) => (
                          <option
                            key={nodeId}
                            value={nodeId}
                          >
                            Node {nodeId}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Generate Maze */}
                  <button
                    onClick={onGenerateGridMaze}
                    disabled={isPlaying}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate Maze</span>
                  </button>

                  {/* Clear Walls */}
                  <button
                    onClick={onClearGrid}
                    disabled={isPlaying}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    Clear Walls
                  </button>

                  <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                    💡 Click & drag cells on grid to draw/erase walls!
                  </span>
                </>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* STATUS */}
          {/* ======================================================= */}

          <div className="flex items-center gap-2 ml-auto">

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                isComplete
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isPlaying
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isComplete
                    ? 'bg-emerald-400'
                    : isPlaying
                    ? 'bg-cyan-400 animate-ping'
                    : 'bg-slate-500'
                }`}
              />

              {isComplete
                ? 'Completed'
                : isPlaying
                ? 'Executing'
                : currentStep > 0
                ? 'Paused'
                : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CUSTOM ARRAY MODAL */}
      {/* ========================================================= */}

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">

            <h3 className="text-lg font-bold text-white mb-2">
              Input Custom Array
            </h3>

            <p className="text-xs text-slate-400 mb-4">
              Enter numbers between 1 and 100 separated by commas or spaces (3 to 30 numbers):
            </p>

            <form onSubmit={handleCustomSubmit}>

              <textarea
                value={customInputText}
                onChange={(e) =>
                  setCustomInputText(
                    e.target.value
                  )
                }
                placeholder="e.g. 45, 12, 89, 34, 23, 76, 5"
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500 mb-4"
                autoFocus
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowCustomModal(false)
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold"
                >
                  Set Array
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}