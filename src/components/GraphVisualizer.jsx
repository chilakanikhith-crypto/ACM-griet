import React from 'react';
import {
  ArrowRight,
  Layers,
  ListOrdered,
  Sparkles,
  CheckCircle2,
  Activity,
  CircleDot,
  ArrowDown,
  RotateCcw
} from 'lucide-react';

export default function GraphVisualizer({
  graphData,
  activeAlgo,
  currentNode = null,
  examiningNeighbor = null,
  visited = [],
  traversedEdges = [],
  queue = [],
  stack = [],
  levels = {},
  backtracking = false,
  isComplete = false
}) {
  const isBFS = activeAlgo === 'bfs';

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  const currentNodeData = nodes.find(
    (node) => node.id === currentNode
  );

  const examiningNodeData = nodes.find(
    (node) => node.id === examiningNeighbor
  );

  const currentLevel =
    currentNode !== null && levels[currentNode] !== undefined
      ? levels[currentNode]
      : null;

  const currentPosition =
    currentNode !== null ? visited.indexOf(currentNode) : -1;

  const operationText = isComplete
    ? 'Traversal completed'
    : backtracking && !isBFS
      ? `Backtracking from ${currentNode ?? 'current node'}`
      : examiningNeighbor !== null
        ? `Checking edge ${currentNode} → ${examiningNeighbor}`
        : currentNode !== null
          ? `Processing node ${currentNode}`
          : 'Waiting to start';

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-6 p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[460px] relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* ========================================================= */}
      {/* LEFT COLUMN */}
      {/* ========================================================= */}

      <div className="flex-1 flex flex-col items-center justify-between z-10">

        {/* Header */}
        <div className="w-full flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 mb-3">

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>

            <div>
              <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider block">
                {isBFS
                  ? 'BFS (Breadth-First)'
                  : 'DFS (Depth-First)'}{' '}
                Graph Traversal
              </span>

              <span className="text-[11px] text-slate-500 font-mono">
                {graphData?.name || 'Graph'}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-slate-400">
                Unvisited
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300">
                {isBFS ? 'Queue' : 'Stack'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-amber-300">
                Active
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300">
                Visited
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* LIVE OPERATION PANEL */}
        {/* ========================================================= */}

        <div className="w-full mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">

          {/* Current Operation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Live Operation
              </span>
            </div>

            <p className="text-xs font-semibold text-cyan-300 leading-relaxed">
              {operationText}
            </p>

            {currentNode !== null && (
              <div className="flex items-center gap-2 mt-2 text-[10px]">

                <span className="text-slate-500">
                  Current:
                </span>

                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold">
                  {currentNode}
                </span>

                {examiningNeighbor !== null && (
                  <>
                    <ArrowRight className="w-3 h-3 text-slate-600" />

                    <span className="px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/30 text-pink-300 font-mono font-bold">
                      {examiningNeighbor}
                    </span>
                  </>
                )}

              </div>
            )}

          </div>

          {/* Traversal Statistics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center gap-2 mb-2">
              <CircleDot className="w-3.5 h-3.5 text-emerald-400" />

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Traversal State
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">

              <div>
                <p className="text-[9px] uppercase text-slate-500">
                  Visited
                </p>

                <p className="text-sm font-bold font-mono text-emerald-300">
                  {visited.length}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase text-slate-500">
                  {isBFS ? 'Level' : 'Position'}
                </p>

                <p className="text-sm font-bold font-mono text-cyan-300">
                  {isBFS
                    ? currentLevel !== null
                      ? currentLevel
                      : '-'
                    : currentPosition >= 0
                      ? currentPosition + 1
                      : '-'}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase text-slate-500">
                  Edges
                </p>

                <p className="text-sm font-bold font-mono text-purple-300">
                  {traversedEdges.length}
                </p>
              </div>

            </div>

          </div>

          {/* Data Structure */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {isBFS ? 'Queue' : 'Stack'}
              </span>

              <span className="ml-auto text-[9px] text-slate-500">
                {isBFS ? 'FIFO' : 'LIFO'}
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto min-h-[28px]">

              {(isBFS ? queue : stack).length === 0 ? (

                <span className="text-[10px] text-slate-600 italic">
                  Empty
                </span>

              ) : (

                (isBFS ? queue : stack).map((item, index) => {

                  const data =
                    isBFS ? queue : stack;

                  const isActiveItem = isBFS
                    ? index === 0
                    : index === data.length - 1;

                  return (
                    <React.Fragment key={`${item}-${index}`}>

                      <span
                        className={`px-2 py-1 rounded-md border text-[10px] font-mono font-bold whitespace-nowrap ${
                          isActiveItem
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : isBFS
                              ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
                              : 'bg-purple-950/60 border-purple-800/60 text-purple-300'
                        }`}
                      >
                        {item}
                      </span>

                      {index < data.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                      )}

                    </React.Fragment>
                  );
                })

              )}

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* SVG GRAPH */}
        {/* ========================================================= */}

        <div className="w-full flex-1 flex items-center justify-center p-2">

          <svg
            viewBox="0 0 600 370"
            className="w-full max-w-[620px] h-[320px] select-none"
          >

            <defs>

              <filter
                id="glow-amber"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="6"
                  result="blur"
                />

                <feComposite
                  in="SourceGraphic"
                  in2="blur"
                  operator="over"
                />
              </filter>

              <filter
                id="glow-cyan"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />

                <feComposite
                  in="SourceGraphic"
                  in2="blur"
                  operator="over"
                />
              </filter>

              <filter
                id="glow-emerald"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="4"
                  result="blur"
                />

                <feComposite
                  in="SourceGraphic"
                  in2="blur"
                  operator="over"
                />
              </filter>

            </defs>

            {/* ===================================================== */}
            {/* EDGES */}
            {/* ===================================================== */}

            {edges.map((edge, idx) => {

              const fromNode = nodes.find(
                (n) => n.id === edge.from
              );

              const toNode = nodes.find(
                (n) => n.id === edge.to
              );

              if (!fromNode || !toNode) {
                return null;
              }

              const edgeKey = [edge.from, edge.to]
                .sort()
                .join('-');

              const isTraversed =
                traversedEdges.includes(edgeKey);

              const isExamining =
                (currentNode === edge.from &&
                  examiningNeighbor === edge.to) ||
                (currentNode === edge.to &&
                  examiningNeighbor === edge.from);

              let strokeColor = '#334155';
              let strokeWidth = 2;
              let strokeDasharray = undefined;

              if (isTraversed) {

                strokeColor = '#10b981';
                strokeWidth = 4;

              } else if (isExamining) {

                strokeColor = '#f59e0b';
                strokeWidth = 3.5;
                strokeDasharray = '7,5';

              }

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              );

            })}

            {/* ===================================================== */}
            {/* NODES */}
            {/* ===================================================== */}

            {nodes.map((node) => {

              const isCurrent =
                currentNode === node.id;

              const isNeighbor =
                examiningNeighbor === node.id;

              const isVisited =
                visited.includes(node.id);

              const inQueue =
                isBFS &&
                queue.includes(node.id);

              const inStack =
                !isBFS &&
                stack.includes(node.id);

              let fillColor = '#0f172a';
              let strokeColor = '#475569';
              let strokeWidth = 2.5;
              let filter = undefined;

              if (isCurrent) {

                fillColor = '#f59e0b';
                strokeColor = '#fef08a';
                strokeWidth = 4;
                filter = 'url(#glow-amber)';

              } else if (isNeighbor) {

                fillColor = '#db2777';
                strokeColor = '#f472b6';
                strokeWidth = 3.5;

              } else if (isVisited) {

                fillColor = '#059669';
                strokeColor = '#6ee7b7';
                strokeWidth = 3;
                filter = 'url(#glow-emerald)';

              } else if (inQueue || inStack) {

                fillColor = '#0284c7';
                strokeColor = '#38bdf8';
                strokeWidth = 3;
                filter = 'url(#glow-cyan)';

              }

              return (
                <g
                  key={node.id}
                  className="transition-all duration-300"
                >

                  {/* Active Ring */}

                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Neighbor Ring */}

                  {isNeighbor && !isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="27"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      className="animate-spin"
                    />
                  )}

                  {/* Node */}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={filter}
                    className="transition-all duration-200"
                  />

                  {/* Node Label */}

                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill={
                      isCurrent
                        ? '#0f172a'
                        : '#ffffff'
                    }
                    fontWeight="bold"
                    fontSize="15"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>

                  {/* BFS Level */}

                  {isBFS &&
                    levels[node.id] !== undefined &&
                    isVisited && (
                      <g
                        transform={`translate(${node.x + 12}, ${
                          node.y - 20
                        })`}
                      >

                        <circle
                          cx="8"
                          cy="8"
                          r="8"
                          fill="#1e293b"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />

                        <text
                          x="8"
                          y="11"
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {levels[node.id]}
                        </text>

                      </g>
                    )}

                </g>
              );

            })}

          </svg>

        </div>

        {/* ========================================================= */}
        {/* VISITED ORDER */}
        {/* ========================================================= */}

        <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto py-2">

          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
            Visited Order:
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">

            {visited.length === 0 ? (

              <span className="text-xs text-slate-500 italic">
                No nodes visited yet
              </span>

            ) : (

              visited.map((nodeId, idx) => (

                <React.Fragment key={`${nodeId}-${idx}`}>

                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 font-mono text-xs font-bold border border-emerald-700/60 shadow-sm">
                    {nodeId}
                  </span>

                  {idx < visited.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  )}

                </React.Fragment>

              ))

            )}

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN */}
      {/* ========================================================= */}

      <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl z-10">

        <div>

          {/* Header */}

          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">

            <div className="flex items-center gap-2">

              <Layers className="w-4 h-4 text-cyan-400" />

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isBFS
                  ? 'FIFO Queue State'
                  : 'LIFO Stack State'}
              </h3>

            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              Size: {isBFS ? queue.length : stack.length}
            </span>

          </div>

          {/* Explanation */}

          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">

            {isBFS
              ? 'BFS uses a Queue: elements are removed from the front and newly discovered neighbors are added to the rear.'
              : 'DFS uses a Stack: the most recently added node is processed first.'}

          </p>

          {/* ===================================================== */}
          {/* QUEUE */}
          {/* ===================================================== */}

          {isBFS && (

            <div className="space-y-2">

              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>◀ FRONT</span>
                <span>REAR ▶</span>
              </div>

              <div className="min-h-[85px] bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex items-center gap-1.5 overflow-x-auto">

                {queue.length === 0 ? (

                  <span className="text-xs text-slate-600 italic mx-auto">
                    Queue is empty
                  </span>

                ) : (

                  queue.map((item, idx) => (

                    <div
                      key={`${item}-${idx}`}
                      className={`min-w-10 h-12 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-sm border shadow-md transition-all ${
                        idx === 0
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
                          : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-200'
                      }`}
                    >

                      <span>{item}</span>

                      <span className="text-[8px] text-slate-400 font-normal">
                        {idx === 0
                          ? 'next'
                          : `#${idx}`}
                      </span>

                    </div>

                  ))

                )}

              </div>

            </div>

          )}

          {/* ===================================================== */}
          {/* STACK */}
          {/* ===================================================== */}

          {!isBFS && (

            <div className="space-y-2">

              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>TOP ▲</span>
                <span>BOTTOM ▼</span>
              </div>

              <div className="h-44 bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto">

                {stack.length === 0 ? (

                  <span className="text-xs text-slate-600 italic m-auto">
                    Stack is empty
                  </span>

                ) : (

                  stack.map((item, idx) => {

                    const isTop =
                      idx === stack.length - 1;

                    return (
                      <div
                        key={`${item}-${idx}`}
                        className={`w-full py-2 px-3 rounded-lg flex items-center justify-between font-mono font-bold text-sm border shadow-sm transition-all ${
                          isTop
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
                            : 'bg-purple-950/50 border-purple-800/50 text-purple-200'
                        }`}
                      >

                        <span>
                          Node {item}
                        </span>

                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-sans ${
                            isTop
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isTop
                            ? 'Top'
                            : `[${idx}]`}
                        </span>

                      </div>
                    );

                  })

                )}

              </div>

            </div>

          )}

        </div>

        {/* ========================================================= */}
        {/* STATUS */}
        {/* ========================================================= */}

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">

          {backtracking && !isBFS && (

            <div className="p-2 rounded-lg bg-orange-950/50 border border-orange-700/50 text-orange-300 font-medium flex items-start gap-2">

              <RotateCcw className="w-4 h-4 mt-0.5 shrink-0" />

              <div>
                <p className="font-bold">
                  Backtracking
                </p>

                <p className="text-[10px] text-orange-400/80 mt-0.5">
                  Dead end reached. Returning to a previous node.
                </p>
              </div>

            </div>

          )}

          {isComplete && (

            <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-700/50 flex items-start gap-2 text-emerald-300">

              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Traversal Finished!
                </p>

                <p className="text-[10px] text-emerald-400/70 mt-0.5">
                  All reachable nodes have been processed.
                </p>
              </div>

            </div>

          )}

          {!isComplete &&
            !backtracking &&
            currentNode !== null && (

              <div className="flex items-center gap-2 text-slate-400">

                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

                <span>
                  {isBFS
                    ? 'Exploring level by level...'
                    : 'Exploring depth first...'}

              </span>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}