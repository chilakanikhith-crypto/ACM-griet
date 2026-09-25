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
  const maxVal = Math.max(...(array || [100]), 100);

  return (
    <div className="w-full flex flex-col items-center justify-between p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[380px] relative overflow-hidden">
      
      {/* Background Subtle Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Top Indicators / Subarray range markers for Merge Sort */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
            Array Visualization ({array?.length} Elements)
          </span>
          {activeRange && activeAlgo === 'merge_sort' && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              Active Subarray: [{activeRange[0]} ... {activeRange[1]}]
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
            <span className="text-slate-400">Default</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 animate-pulse" />
            <span className="text-amber-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 animate-bounce" />
            <span className="text-rose-400">Swap / Overwrite</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span className="text-emerald-300">Sorted</span>
          </div>
        </div>
      </div>

      {/* Main Bars Stage */}
      <div className="w-full flex-1 flex items-end justify-center gap-1 sm:gap-2 px-2 py-4 border-b border-slate-800/70 z-10 min-h-[260px]">
        {array && array.map((value, idx) => {
          const heightPercent = Math.max(10, Math.min(100, (value / maxVal) * 92));
          const isComparing = comparingIndices?.includes(idx);
          const isSwapping = swappingIndices?.includes(idx);
          const isWriting = writingIndex === idx;
          const isSorted = sortedIndices?.includes(idx);
          const isInActiveRange = activeRange && idx >= activeRange[0] && idx <= activeRange[1];
          const isMid = midIndex === idx;

          // Compute color styling
          let barBg = 'bg-gradient-to-t from-slate-800 via-indigo-900/60 to-indigo-700/80 text-indigo-200 border-indigo-500/30';
          let glowStyle = {};

          if (isSorted) {
            barBg = 'bg-gradient-to-t from-emerald-900 via-emerald-600 to-teal-400 text-slate-950 font-bold border-emerald-400';
            glowStyle = { boxShadow: '0 0 16px rgba(52, 211, 153, 0.4)' };
          } else if (isSwapping || isWriting) {
            barBg = 'bg-gradient-to-t from-rose-900 via-rose-600 to-pink-500 text-white font-bold border-rose-400 scale-[1.03] z-20';
            glowStyle = { boxShadow: '0 0 20px rgba(244, 63, 94, 0.7)' };
          } else if (isComparing) {
            barBg = 'bg-gradient-to-t from-amber-900 via-amber-500 to-yellow-300 text-slate-950 font-bold border-yellow-300 scale-[1.02] z-10';
            glowStyle = { boxShadow: '0 0 16px rgba(251, 191, 36, 0.6)' };
          } else if (isInActiveRange) {
            barBg = 'bg-gradient-to-t from-cyan-950 via-cyan-800/70 to-blue-600/70 text-cyan-200 border-cyan-400/40';
          }

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[48px] group transition-all duration-150"
            >
              {/* Midpoint Indicator */}
              {isMid && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-1 py-0.5 rounded border border-amber-500/40 mb-1">
                  mid
                </span>
              )}

              {/* Bar Value Label (always visible if array size <= 25, or on hover) */}
              <span className={`text-[10px] md:text-xs font-mono font-bold mb-1 transition-opacity ${
                array.length > 28 ? 'opacity-0 group-hover:opacity-100' : 'opacity-90'
              } ${isComparing ? 'text-amber-300 font-extrabold' : isSwapping ? 'text-rose-300 font-extrabold' : 'text-slate-300'}`}>
                {value}
              </span>

              {/* Bar Body */}
              <div
                style={{
                  height: `${heightPercent}%`,
                  ...glowStyle
                }}
                className={`w-full rounded-t-lg border-t border-x transition-all duration-150 flex items-center justify-center relative overflow-hidden ${barBg}`}
              >
                {/* Gloss Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Index Number Label */}
              <span className="text-[9px] md:text-[10px] font-mono text-slate-500 mt-1">
                {idx}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="w-full flex items-center justify-between pt-3 text-xs text-slate-400 z-10">
        <div>
          <span>Algorithm: </span>
          <span className="font-semibold text-white capitalize">{activeAlgo.replace('_', ' ')}</span>
        </div>
        <div className="font-mono text-slate-400">
          Range: [0 .. {array?.length - 1}]
        </div>
      </div>

    </div>
  );
}
