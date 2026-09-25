import React from 'react';
import { Code2, Terminal, Info } from 'lucide-react';

export default function PseudocodeViewer({ codeLines = [], activeLine = null, currentDescription = "" }) {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl backdrop-blur-md">
      
      {/* Live Explanation Banner */}
      <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/30 flex items-start gap-2.5 shadow-inner">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0 animate-pulse" />
        <div className="flex-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">
            Current Step Explanation
          </span>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {currentDescription || "Ready. Click Play ▶️ or Step Forward ⏭️ to begin execution."}
          </p>
        </div>
      </div>

      {/* Code Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Algorithm Pseudocode
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-slate-400" />
          Live Trace
        </span>
      </div>

      {/* Code Lines Display */}
      <div className="font-mono text-xs overflow-x-auto py-1 space-y-0.5">
        {codeLines.map((item) => {
          const isActive = activeLine === item.line;
          return (
            <div
              key={item.line}
              className={`flex items-center px-2 py-1 rounded-md transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-l-4 border-cyan-400 font-bold shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className={`w-6 text-[10px] text-right mr-3 select-none ${
                isActive ? 'text-cyan-400 font-extrabold' : 'text-slate-600'
              }`}>
                {item.line}
              </span>
              <pre className="whitespace-pre overflow-x-auto flex-1 font-mono text-[11px] leading-tight">
                {item.text}
              </pre>
            </div>
          );
        })}
      </div>

    </div>
  );
}
