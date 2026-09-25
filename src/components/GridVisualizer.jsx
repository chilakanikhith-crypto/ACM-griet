import React, { useState } from 'react';
import { Target, Flag, Wand2, ShieldAlert } from 'lucide-react';

export default function GridVisualizer({
  grid = [],
  onToggleWall,
  start = { r: 5, c: 4 },
  end = { r: 5, c: 18 },
  visitedCells = [],
  currentCell = null,
  path = [],
  activeAlgo = 'bfs',
  isComplete = false,
  success = false
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Set lookup for fast rendering
  const visitedSet = new Set(visitedCells.map(c => `${c.r},${c.c}`));
  const pathSet = new Set(path.map(c => `${c.r},${c.c}`));

  const handleCellClick = (r, c) => {
    if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
    onToggleWall(r, c);
  };

  const handleMouseEnter = (r, c) => {
    if (isMouseDown) {
      handleCellClick(r, c);
    }
  };

  return (
    <div 
      className="w-full flex flex-col items-center justify-between p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[380px] relative overflow-hidden select-none"
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {/* Top Header & Legend */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
            2D Grid Pathfinding ({activeAlgo.toUpperCase()})
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
            Interactive Maze
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-emerald-300">Start (🚀)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span className="text-rose-300">Target (🎯)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-700" />
            <span className="text-slate-400">Wall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/60" />
            <span className="text-cyan-300">Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            <span className="text-amber-300 font-bold">Path</span>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="w-full flex-1 flex items-center justify-center py-2 z-10 overflow-x-auto">
        <div className="inline-block p-2 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => {
                const key = `${rIdx},${cIdx}`;
                const isStart = rIdx === start.r && cIdx === start.c;
                const isEnd = rIdx === end.r && cIdx === end.c;
                const isCurrent = currentCell && currentCell.r === rIdx && currentCell.c === cIdx;
                const isVisited = visitedSet.has(key);
                const isPath = pathSet.has(key);
                const isWall = cell.isWall;

                let cellBg = 'bg-slate-950 border-slate-850 hover:bg-slate-800/80';
                let content = null;

                if (isStart) {
                  cellBg = 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/50 z-20';
                  content = <Flag className="w-3 h-3 text-slate-950" />;
                } else if (isEnd) {
                  cellBg = 'bg-rose-500 border-rose-400 shadow-md shadow-rose-500/50 z-20';
                  content = <Target className="w-3 h-3 text-white" />;
                } else if (isPath) {
                  cellBg = 'bg-amber-400 border-amber-300 shadow-md shadow-amber-400/70 z-10 animate-pulse';
                } else if (isCurrent) {
                  cellBg = 'bg-cyan-400 border-white shadow-md shadow-cyan-400/80 z-10 scale-105';
                } else if (isWall) {
                  cellBg = 'bg-slate-700 border-slate-600';
                } else if (isVisited) {
                  cellBg = activeAlgo === 'bfs' 
                    ? 'bg-cyan-900/70 border-cyan-700/60 transition-colors duration-200' 
                    : 'bg-purple-900/70 border-purple-700/60 transition-colors duration-200';
                }

                return (
                  <div
                    key={cIdx}
                    onMouseDown={() => handleCellClick(rIdx, cIdx)}
                    onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 border-[0.5px] rounded-[3px] m-[0.5px] flex items-center justify-center transition-all duration-75 cursor-pointer ${cellBg}`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Grid Footer Notes */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 z-10">
        <div>
          <span>Tip: </span>
          <span className="text-slate-300">Click or drag across cells to place or erase obstacles.</span>
        </div>
        <div>
          {path.length > 0 && (
            <span className="text-amber-400 font-bold font-mono">
              Shortest Path Length: {path.length} cells
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
