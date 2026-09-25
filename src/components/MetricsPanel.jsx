import React from 'react';
import { Activity, BarChart3, CheckSquare, Layers, Clock } from 'lucide-react';

export default function MetricsPanel({
  comparisons = 0,
  swaps = 0,
  visitedCount = 0,
  queueOrStackDepth = 0,
  currentStep = 0,
  totalSteps = 1,
  activeAlgo = 'bubble_sort',
  isComplete = false
}) {
  const isSorting = activeAlgo === 'bubble_sort' || activeAlgo === 'merge_sort';
  const isSearch = activeAlgo === 'binary_search';
  const isGraph = activeAlgo === 'bfs' || activeAlgo === 'dfs';

  const progressPercent = totalSteps > 1 
    ? Math.round((currentStep / (totalSteps - 1)) * 100) 
    : (isComplete ? 100 : 0);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Execution Metrics & Analytics
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          Live Telemetry
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[11px] text-slate-400 font-medium mb-1">
          <span>Overall Algorithm Progress</span>
          <span className="text-cyan-400 font-mono font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-150 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Step Index */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step Counter</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {currentStep}
            <span className="text-xs text-slate-500 font-normal"> / {Math.max(0, totalSteps - 1)}</span>
          </div>
        </div>

        {/* Comparisons / Visits */}
        {isSorting || isSearch ? (
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Comparisons</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-300">
              {comparisons}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nodes Visited</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-300">
              {visitedCount}
            </div>
          </div>
        )}

        {/* Swaps / Writes for Sorting */}
        {isSorting && (
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              <span>{activeAlgo === 'bubble_sort' ? 'Swaps Performed' : 'Array Writes'}</span>
            </div>
            <div className="text-lg font-bold font-mono text-rose-300">
              {swaps}
            </div>
          </div>
        )}

        {/* Data Structure Depth for Graph */}
        {isGraph && (
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeAlgo === 'bfs' ? 'Active Queue' : 'Active Stack'}</span>
            </div>
            <div className="text-lg font-bold font-mono text-indigo-300">
              {queueOrStackDepth}
            </div>
          </div>
        )}

        {/* Efficiency status */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>State</span>
          </div>
          <div className="text-sm font-semibold font-mono text-purple-300 truncate">
            {isComplete ? 'Execution Complete' : currentStep > 0 ? 'In Progress' : 'Idle'}
          </div>
        </div>

      </div>

    </div>
  );
}
