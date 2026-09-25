import React from 'react';
import { BookOpen, ThumbsUp, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import { ALGORITHMS } from '../algorithms/algorithmMeta';

export default function ComplexityCard({ activeAlgo }) {
  const meta = ALGORITHMS[activeAlgo];
  if (!meta) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Complexity & Theoretical Analysis
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
          {meta.category}
        </span>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        {meta.tagline}
      </p>

      {/* Complexity Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        
        {/* Best Case */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Best Case</span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            {meta.timeComplexity.best}
          </span>
        </div>

        {/* Average Case */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Average Case</span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {meta.timeComplexity.average}
          </span>
        </div>

        {/* Worst Case */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Worst Case</span>
          <span className="text-sm font-mono font-bold text-rose-400">
            {meta.timeComplexity.worst}
          </span>
        </div>

        {/* Space Complexity */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Space Complexity</span>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {meta.spaceComplexity}
          </span>
        </div>

      </div>

      {/* Additional Characteristics */}
      <div className="flex items-center gap-2 flex-wrap mb-4 text-xs font-mono">
        {meta.dataStructure && (
          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1.5">
            <Database className="w-3 h-3" />
            Core DS: {meta.dataStructure}
          </span>
        )}
        {meta.stable && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Stable: {meta.stable}
          </span>
        )}
        {meta.inPlace && (
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
            In-Place: {meta.inPlace}
          </span>
        )}
      </div>

      {/* Pros & Cons Bullets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        
        {/* Pros */}
        <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Key Advantages</span>
          </div>
          <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
            {meta.pros?.map((pro, idx) => (
              <li key={idx} className="leading-snug">{pro}</li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-3 bg-rose-950/20 border border-rose-800/30 rounded-xl">
          <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Trade-offs & Limits</span>
          </div>
          <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
            {meta.cons?.map((con, idx) => (
              <li key={idx} className="leading-snug">{con}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
