import React from 'react';
import { ArrowRight, Layers, ListOrdered, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GraphVisualizer({
  graphData,
  activeAlgo, // 'bfs' | 'dfs'
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

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-6 p-4 md:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl min-h-[460px] relative overflow-hidden">
      
      {/* Subtle Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Left/Main Column: SVG Graph Canvas */}
      <div className="flex-1 flex flex-col items-center justify-between z-10">
        
        {/* Graph Canvas Header */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold tracking-wider">
              {isBFS ? 'BFS (Breadth-First)' : 'DFS (Depth-First)'} Graph Traversal
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
              {graphData?.name}
            </span>
          </div>

          {/* Node State Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-slate-400">Unvisited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300">{isBFS ? 'In Queue' : 'In Stack'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300">Visited</span>
            </div>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="w-full flex-1 flex items-center justify-center p-2">
          <svg
            viewBox="0 0 600 370"
            className="w-full max-w-[620px] h-[320px] select-none"
          >
            <defs>
              {/* Active Node Glow Filter */}
              <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const edgeKey = [edge.from, edge.to].sort().join("-");
              const isTraversed = traversedEdges.includes(edgeKey);
              const isExamining =
                (currentNode === edge.from && examiningNeighbor === edge.to) ||
                (currentNode === edge.to && examiningNeighbor === edge.from);

              let strokeColor = "#334155"; // slate-700
              let strokeWidth = 2;
              let strokeDasharray = undefined;

              if (isTraversed) {
                strokeColor = "#10b981"; // emerald-500
                strokeWidth = 3.5;
              } else if (isExamining) {
                strokeColor = "#f59e0b"; // amber-500
                strokeWidth = 3;
                strokeDasharray = "5,4";
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

            {/* Nodes */}
            {nodes.map((node) => {
              const isCurrent = currentNode === node.id;
              const isNeighbor = examiningNeighbor === node.id;
              const isVisited = visited.includes(node.id);
              const inQueue = isBFS && queue.includes(node.id);
              const inStack = !isBFS && stack.includes(node.id);

              let fillColor = "#0f172a"; // slate-900
              let strokeColor = "#475569"; // slate-600
              let strokeWidth = 2.5;
              let filter = undefined;

              if (isCurrent) {
                fillColor = "#f59e0b"; // amber-500
                strokeColor = "#fef08a"; // yellow-200
                strokeWidth = 4;
                filter = "url(#glow-amber)";
              } else if (isNeighbor) {
                fillColor = "#db2777"; // pink-600
                strokeColor = "#f472b6";
                strokeWidth = 3.5;
              } else if (isVisited) {
                fillColor = "#059669"; // emerald-600
                strokeColor = "#6ee7b7"; // emerald-300
                strokeWidth = 3;
              } else if (inQueue || inStack) {
                fillColor = "#0284c7"; // sky-600
                strokeColor = "#38bdf8"; // sky-400
                strokeWidth = 3;
                filter = "url(#glow-cyan)";
              }

              return (
                <g key={node.id} className="transition-all duration-300 cursor-pointer">
                  {/* Outer Pulsing Ring for Active Node */}
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="29"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={filter}
                    className="transition-all duration-200 shadow-xl"
                  />

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill={isCurrent ? "#0f172a" : "#ffffff"}
                    fontWeight="bold"
                    fontSize="15"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>

                  {/* BFS Level Badge */}
                  {isBFS && levels[node.id] !== undefined && isVisited && (
                    <g transform={`translate(${node.x + 12}, ${node.y - 20})`}>
                      <circle cx="8" cy="8" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="8" y="11" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {levels[node.id]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Visited Sequence Trail */}
        <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" /> Visited Order:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {visited.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No nodes visited yet</span>
            ) : (
              visited.map((nodeId, idx) => (
                <React.Fragment key={idx}>
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

      {/* Right Column: LIVE DATA STRUCTURE INSPECTOR (Queue for BFS / Stack for DFS) */}
      <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl z-10">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isBFS ? 'FIFO Queue State' : 'LIFO Stack State'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              Size: {isBFS ? queue.length : stack.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            {isBFS
              ? 'BFS uses a Queue: elements are dequeued from FRONT and new neighbors are enqueued to REAR.'
              : 'DFS uses a Stack: elements are popped from TOP and new neighbors are pushed to TOP.'}
          </p>

          {/* Queue Visualization (Horizontal / Flow) */}
          {isBFS && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>◀ FRONT (Next Out)</span>
                <span>REAR (New In) ▶</span>
              </div>
              <div className="min-h-[85px] bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex items-center gap-1.5 overflow-x-auto">
                {queue.length === 0 ? (
                  <span className="text-xs text-slate-600 italic mx-auto">Queue is empty</span>
                ) : (
                  queue.map((item, idx) => (
                    <div
                      key={idx}
                      className={`min-w-10 h-12 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-sm border shadow-md transition-all ${
                        idx === 0
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
                          : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-200'
                      }`}
                    >
                      <span>{item}</span>
                      <span className="text-[8px] text-slate-400 font-normal">
                        {idx === 0 ? 'head' : `#${idx}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stack Visualization (Vertical) */}
          {!isBFS && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>▲ TOP (Next Out / In)</span>
                <span>BOTTOM ▼</span>
              </div>
              <div className="h-44 bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto">
                {stack.length === 0 ? (
                  <span className="text-xs text-slate-600 italic m-auto">Stack is empty</span>
                ) : (
                  stack.map((item, idx) => {
                    const isTop = idx === stack.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`w-full py-2 px-3 rounded-lg flex items-center justify-between font-mono font-bold text-sm border shadow-sm transition-all ${
                          isTop
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
                            : 'bg-purple-950/50 border-purple-800/50 text-purple-200'
                        }`}
                      >
                        <span>Node {item}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-sans ${
                          isTop ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }">
                          {isTop ? 'Top' : `[${idx}]`}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Backtracking & Completion Callout */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
          {backtracking && !isBFS && (
            <div className="p-2 rounded-lg bg-orange-950/50 border border-orange-700/50 text-orange-300 font-medium">
              ⚠️ Dead end hit. Backtracking to parent node...
            </div>
          )}
          {isComplete && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Traversal Finished!</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
