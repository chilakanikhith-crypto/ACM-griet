import React from 'react';

export default function SortingVisualizer({
  array,
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = [],
  activeRange = null,
  midIndex = null,
  writingIndex = null,
  activeAlgo
}) {
  const values = array || [];
  const maxVal = Math.max(...values, 100);

  const isMergeSort = activeAlgo === 'merge_sort';

  const leftIndex = comparingIndices?.[0];
  const rightIndex = comparingIndices?.[1];

  const leftValue =
    leftIndex !== undefined
      ? values[leftIndex]
      : null;

  const rightValue =
    rightIndex !== undefined
      ? values[rightIndex]
      : null;

  let mergeMessage = '';

  if (isMergeSort) {
    if (
      leftValue !== null &&
      rightValue !== null
    ) {
      if (leftValue < rightValue) {
        mergeMessage = `${leftValue} is smaller than ${rightValue} → place ${leftValue} first`;
      } else if (rightValue < leftValue) {
        mergeMessage = `${rightValue} is smaller than ${leftValue} → place ${rightValue} first`;
      } else {
        mergeMessage = `${leftValue} and ${rightValue} are equal`;
      }
    } else if (activeRange) {
      mergeMessage = `Working on positions ${activeRange[0]} to ${activeRange[1]}`;
    } else {
      mergeMessage = 'Divide the array into smaller parts, then merge them in sorted order.';
    }
  }

  return (
    <div className="w-full flex flex-col p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 z-10">

        <div>
          <div className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
            Array Visualization
          </div>

          <div className="text-sm text-slate-500 mt-1">
            {values.length} Elements
          </div>
        </div>

        {/* Merge Sort Phase */}
        {isMergeSort && (
          <div className="flex items-center gap-2">

            {comparingIndices?.length >= 2 ? (
              <span className="px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                🔍 Comparing
              </span>
            ) : activeRange ? (
              <span className="px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                🔄 Processing
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
                ✂️ Divide & Merge
              </span>
            )}

          </div>
        )}

        {/* Legend */}
        {!isMergeSort && (
          <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
              <span className="text-slate-400">
                Default
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span className="text-amber-300">
                Comparing
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-rose-400">
                Swap
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-emerald-300">
                Sorted
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Merge Sort Explanation */}
      {isMergeSort && (
        <div className="w-full mb-5 z-10">

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">

            <div className="flex items-center gap-2 mb-3">

              <span className="text-lg">
                🧠
              </span>

              <span className="text-sm font-bold text-white">
                How Merge Sort is working
              </span>

            </div>

            {/* Three Simple Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

              <div className="rounded-lg bg-indigo-950/50 border border-indigo-500/20 p-3">

                <div className="text-xs text-indigo-300 font-bold mb-1">
                  1. SPLIT
                </div>

                <div className="text-xs text-slate-400">
                  Divide the array into smaller parts.
                </div>

              </div>

              <div className="rounded-lg bg-amber-950/50 border border-amber-500/20 p-3">

                <div className="text-xs text-amber-300 font-bold mb-1">
                  2. COMPARE
                </div>

                <div className="text-xs text-slate-400">
                  Compare the first elements of two parts.
                </div>

              </div>

              <div className="rounded-lg bg-emerald-950/50 border border-emerald-500/20 p-3">

                <div className="text-xs text-emerald-300 font-bold mb-1">
                  3. MERGE
                </div>

                <div className="text-xs text-slate-400">
                  Put the smaller element into the sorted result.
                </div>

              </div>

            </div>

            {/* Current Explanation */}
            <div className="rounded-lg bg-slate-950/80 border border-slate-700/70 px-4 py-3">

              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                Current Step
              </div>

              <div className="text-sm text-white font-medium">
                {mergeMessage}
              </div>

              {leftValue !== null &&
                rightValue !== null && (
                  <div className="flex items-center gap-3 mt-3">

                    <div className="px-4 py-2 rounded-lg bg-amber-950/60 border border-amber-500/30">
                      <div className="text-[10px] text-amber-400 uppercase">
                        Left
                      </div>

                      <div className="text-xl font-bold text-amber-200">
                        {leftValue}
                      </div>
                    </div>

                    <div className="text-slate-500 font-bold">
                      VS
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                      <div className="text-[10px] text-cyan-400 uppercase">
                        Right
                      </div>

                      <div className="text-xl font-bold text-cyan-200">
                        {rightValue}
                      </div>
                    </div>

                  </div>
                )}

            </div>

          </div>

        </div>
      )}

      {/* Main Bars */}
      <div className="w-full flex-1 flex items-end justify-center gap-1 sm:gap-2 px-2 py-5 border-b border-slate-800/70 z-10 min-h-[260px]">

        {values.map((value, idx) => {

          const heightPercent = Math.max(
            10,
            Math.min(
              100,
              (value / maxVal) * 92
            )
          );

          const isComparing =
            comparingIndices?.includes(idx);

          const isSwapping =
            swappingIndices?.includes(idx);

          const isWriting =
            writingIndex === idx;

          const isSorted =
            sortedIndices?.includes(idx);

          const isInActiveRange =
            activeRange &&
            idx >= activeRange[0] &&
            idx <= activeRange[1];

          const isMid =
            midIndex === idx;

          let barBg =
            'bg-gradient-to-t from-slate-800 via-indigo-900/60 to-indigo-700/80 text-indigo-200 border-indigo-500/30';

          let glowStyle = {};

          if (isSorted) {

            barBg =
              'bg-gradient-to-t from-emerald-900 via-emerald-600 to-teal-400 text-slate-950 font-bold border-emerald-400';

            glowStyle = {
              boxShadow:
                '0 0 16px rgba(52, 211, 153, 0.4)'
            };

          } else if (
            isSwapping ||
            isWriting
          ) {

            barBg =
              'bg-gradient-to-t from-rose-900 via-rose-600 to-pink-500 text-white font-bold border-rose-400 scale-[1.03] z-20';

            glowStyle = {
              boxShadow:
                '0 0 20px rgba(244, 63, 94, 0.7)'
            };

          } else if (isComparing) {

            barBg =
              'bg-gradient-to-t from-amber-900 via-amber-500 to-yellow-300 text-slate-950 font-bold border-yellow-300 scale-[1.05] z-10';

            glowStyle = {
              boxShadow:
                '0 0 18px rgba(251, 191, 36, 0.65)'
            };

          } else if (isInActiveRange) {

            barBg =
              'bg-gradient-to-t from-cyan-950 via-cyan-800/70 to-blue-600/70 text-cyan-200 border-cyan-400/40';

          }

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[48px] group transition-all duration-200"
            >

              {/* Midpoint */}
              {isMid && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 mb-1">
                  mid
                </span>
              )}

              {/* Value */}
              <span
                className={`
                  text-[10px] md:text-xs
                  font-mono font-bold mb-1
                  transition-opacity
                  ${
                    values.length > 28
                      ? 'opacity-0 group-hover:opacity-100'
                      : 'opacity-90'
                  }
                  ${
                    isComparing
                      ? 'text-amber-300 font-extrabold'
                      : isSwapping
                      ? 'text-rose-300 font-extrabold'
                      : 'text-slate-300'
                  }
                `}
              >
                {value}
              </span>

              {/* Bar */}
              <div
                style={{
                  height: `${heightPercent}%`,
                  ...glowStyle
                }}
                className={`
                  w-full rounded-t-lg
                  border-t border-x
                  transition-all duration-200
                  flex items-center justify-center
                  relative overflow-hidden
                  ${barBg}
                `}
              >

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              </div>

              {/* Index */}
              <span className="text-[9px] md:text-[10px] font-mono text-slate-500 mt-1">
                {idx}
              </span>

            </div>
          );
        })}

      </div>

      {/* Merge Sort Simple Status */}
      {isMergeSort && (
        <div className="w-full mt-4 z-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div className="text-xs text-slate-400">

              <span className="text-slate-500">
                Algorithm:
              </span>

              <span className="font-semibold text-white ml-1">
                Merge Sort
              </span>

            </div>

            {activeRange && (
              <div className="text-xs font-mono">

                <span className="text-slate-500">
                  Current part:
                </span>

                <span className="ml-2 text-cyan-300">
                  [{activeRange[0]} ... {activeRange[1]}]
                </span>

              </div>
            )}

          </div>

        </div>
      )}

      {/* Normal Algorithm Footer */}
      {!isMergeSort && (
        <div className="w-full flex items-center justify-between pt-3 text-xs text-slate-400 z-10">

          <div>
            <span>
              Algorithm:
            </span>

            <span className="font-semibold text-white ml-1 capitalize">
              {activeAlgo?.replace('_', ' ')}
            </span>
          </div>

          <div className="font-mono text-slate-400">
            Range: [0 .. {(values.length || 1) - 1}]
          </div>

        </div>
      )}

    </div>
  );
}