import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowDown, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function BinarySearchVisualizer({
  array = [],
  left = 0,
  right = 0,
  mid = null,
  target = null,
  eliminated = [],
  foundIndex = null,
  isComplete = false,
  success = false
}) {

  // Trigger confetti when target is found!
  useEffect(() => {
    if (foundIndex !== null && isComplete && success) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [foundIndex, isComplete, success]);

  return (
    <div className="w-full flex flex-col items-center justify-between p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[380px] relative overflow-hidden">
      
      {/* Background Subtle Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Target Status Header Banner */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider block">
              Binary Search on Sorted Array
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-200">Searching for Target:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-base border border-cyan-500/40">
                {target}
              </span>
            </div>
          </div>
        </div>

        {/* Status Callout */}
        <div className="flex items-center gap-2">
          {foundIndex !== null ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Target Found at Index {foundIndex}!</span>
            </div>
          ) : isComplete && !success ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Target {target} Not Found in Array</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span>Window:</span>
              <span className="text-blue-400 font-bold">L={left}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">M={mid !== null ? mid : '-'}</span>
              <span>·</span>
              <span className="text-purple-400 font-bold">R={right}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Array Display with Pointer Flags */}
      <div className="w-full flex-1 flex flex-col justify-center items-center py-6 overflow-x-auto z-10">
        
        {/* Pointers Row (L, M, R) */}
        <div className="flex items-center justify-center gap-2 min-w-max px-4 mb-2">
          {array.map((_, idx) => {
            const isLeft = idx === left;
            const isMid = idx === mid;
            const isRight = idx === right;

            return (
              <div key={idx} className="w-12 sm:w-14 flex flex-col items-center h-12 justify-end">
                {/* Pointer Badges */}
                <div className="flex items-center gap-0.5">
                  {isLeft && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white shadow-md shadow-blue-500/40 animate-pulse">
                      L
                    </span>
                  )}
                  {isMid && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 animate-bounce">
                      MID
                    </span>
                  )}
                  {isRight && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white shadow-md shadow-purple-500/40 animate-pulse">
                      R
                    </span>
                  )}
                </div>

                {/* Arrow Pointer */}
                {(isLeft || isMid || isRight) && (
                  <ArrowDown className={`w-3.5 h-3.5 mt-0.5 ${
                    isMid ? 'text-amber-400' : isLeft ? 'text-blue-400' : 'text-purple-400'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div className="flex items-center justify-center gap-2 min-w-max px-4">
          {array.map((value, idx) => {
            const isEliminated = eliminated?.includes(idx);
            const isFound = foundIndex === idx;
            const isMid = mid === idx;
            const isInWindow = idx >= left && idx <= right && !isEliminated;

            let cellBg = 'bg-slate-900 border-slate-700 text-slate-200';
            let glow = {};

            if (isFound) {
              cellBg = 'bg-gradient-to-tr from-emerald-600 to-teal-400 border-emerald-300 text-slate-950 font-extrabold scale-110 z-20';
              glow = { boxShadow: '0 0 25px rgba(52, 211, 153, 0.8)' };
            } else if (isMid) {
              cellBg = 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-yellow-300 text-slate-950 font-extrabold scale-105 z-10';
              glow = { boxShadow: '0 0 20px rgba(251, 191, 36, 0.7)' };
            } else if (isInWindow) {
              cellBg = 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-800 border-cyan-500/60 text-cyan-200';
            } else if (isEliminated) {
              cellBg = 'bg-slate-950/80 border-slate-850 text-slate-600 opacity-35 line-through';
            }

            return (
              <div
                key={idx}
                style={glow}
                className={`w-12 sm:w-14 h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 relative ${cellBg}`}
              >
                {/* Cell Value */}
                <span className="text-base sm:text-lg font-bold font-mono">
                  {value}
                </span>

                {/* Index Subscript */}
                <span className={`text-[10px] font-mono mt-0.5 ${
                  isFound || isMid ? 'text-slate-900/80' : 'text-slate-500'
                }`}>
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Comparison Detail Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Pointers Guide:</span>
          <span className="text-blue-400 font-bold">L = Left Index</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">MID = Math.floor((L+R)/2)</span>
          <span>•</span>
          <span className="text-purple-400 font-bold">R = Right Index</span>
        </div>

        <div className="font-mono text-cyan-300">
          Search space reduced by ~50% each step
        </div>
      </div>

    </div>
  );
}
