import React, { useState } from 'react';
import { Target, Flag } from 'lucide-react';

export default function GridVisualizer({
  grid = [],
  onToggleWall,
  start = { r: 5, c: 4 },
  end = { r: 5, c: 18 },
  visitedCells = [],
  currentCell = null,
  path = [],
  activeAlgo = 'bfs',
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const visitedSet = new Set(
    visitedCells.map((cell) => `${cell.r},${cell.c}`)
  );

  const pathSet = new Set(
    path.map((cell) => `${cell.r},${cell.c}`)
  );

  const handleCellClick = (r, c) => {
    if (
      (r === start.r && c === start.c) ||
      (r === end.r && c === end.c)
    ) {
      return;
    }

    if (onToggleWall) {
      onToggleWall(r, c);
    }
  };

  const handleMouseEnter = (r, c) => {
    if (isMouseDown) {
      handleCellClick(r, c);
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center p-4 md:p-6 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-2xl min-h-[420px] relative overflow-hidden select-none"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {/* Header */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase font-mono text-cyan-300 font-bold tracking-wider">
            2D Grid Pathfinding
          </span>

          <span className="text-[11px] font-mono px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            {activeAlgo.toUpperCase()}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-emerald-300">Start</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span className="text-rose-300">Target</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-700" />
            <span className="text-slate-400">Wall</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={
                activeAlgo === 'bfs'
                  ? 'w-3 h-3 rounded-sm bg-cyan-500'
                  : 'w-3 h-3 rounded-sm bg-purple-500'
              }
            />
            <span className="text-slate-300">Visited</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            <span className="text-amber-300">Path</span>
          </div>
        </div>
      </div>

      {/* Empty grid protection */}
      {grid.length === 0 ? (
        <div className="flex-1 min-h-[280px] w-full flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">🧩</div>

          <h3 className="text-lg font-bold text-white mb-2">
            2D Grid is Empty
          </h3>

          <p className="text-sm text-slate-400 max-w-md">
            The grid data has not been generated yet.
            Switch to Interactive Graph and back to 2D Grid,
            or reset the algorithm.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="w-full flex-1 flex items-center justify-center overflow-auto py-4">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-inner">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex">
                {row.map((cell, cIdx) => {
                  const key = `${rIdx},${cIdx}`;

                  const isStart =
                    rIdx === start.r &&
                    cIdx === start.c;

                  const isEnd =
                    rIdx === end.r &&
                    cIdx === end.c;

                  const isCurrent =
                    currentCell &&
                    currentCell.r === rIdx &&
                    currentCell.c === cIdx;

                  const isVisited =
                    visitedSet.has(key);

                  const isPath =
                    pathSet.has(key);

                  const isWall =
                    cell?.isWall === true;

                  let cellClass =
                    'bg-slate-950 border-slate-800 hover:bg-slate-800';

                  let content = null;

                  if (isStart) {
                    cellClass =
                      'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/50';

                    content = (
                      <Flag className="w-4 h-4 text-slate-950" />
                    );
                  } else if (isEnd) {
                    cellClass =
                      'bg-rose-500 border-rose-300 shadow-lg shadow-rose-500/50';

                    content = (
                      <Target className="w-4 h-4 text-white" />
                    );
                  } else if (isPath) {
                    cellClass =
                      'bg-amber-400 border-amber-200 shadow-lg shadow-amber-400/60';
                  } else if (isCurrent) {
                    cellClass =
                      'bg-white border-cyan-300 shadow-lg shadow-cyan-400/80 scale-110 z-10';

                    content = (
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    );
                  } else if (isWall) {
                    cellClass =
                      'bg-slate-600 border-slate-500 shadow-inner';
                  } else if (isVisited) {
                    cellClass =
                      activeAlgo === 'bfs'
                        ? 'bg-cyan-900 border-cyan-700'
                        : 'bg-purple-900 border-purple-700';
                  }

                  return (
                    <div
                      key={cIdx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsMouseDown(true);
                        handleCellClick(rIdx, cIdx);
                      }}
                      onMouseEnter={() =>
                        handleMouseEnter(rIdx, cIdx)
                      }
                      className={`
                        w-6 h-6
                        sm:w-7 sm:h-7
                        md:w-8 md:h-8
                        border
                        rounded-[3px]
                        m-[1px]
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-100
                        cursor-pointer
                        ${cellClass}
                      `}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-800 text-xs">
        <div className="text-slate-400">
          🖱️ Click or drag cells to create/remove walls
        </div>

        {path.length > 0 && (
          <div className="text-amber-400 font-bold font-mono">
            Path: {path.length} cells
          </div>
        )}
      </div>
    </div>
  );
}