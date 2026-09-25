import React from 'react';
import { X, Play, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Algorithm Visualizer Guide</h2>
            <p className="text-xs text-slate-400">Round 2 Interactive Simulator</p>
          </div>
        </div>

        {/* Guide Content */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /> Playback Controls
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li><strong>Play ▶️:</strong> Starts animated step-by-step execution.</li>
              <li><strong>Pause ⏸️:</strong> Pauses at the exact current micro-step.</li>
              <li><strong>Reset ↻:</strong> Rewinds back to step 0 with the initial array or graph.</li>
              <li><strong>Step Backward ⏮️ / Forward ⏭️:</strong> Move through code instructions one by one.</li>
              <li><strong>Timeline Scrubber:</strong> Drag the slider to instantly jump to any point in the algorithm execution.</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Algorithm Visualizations
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><strong className="text-white">Bubble Sort:</strong> Highlights adjacent elements comparing, swapping in real-time, and locks in sorted elements at the right end.</li>
              <li><strong className="text-white">Merge Sort:</strong> Divide-and-conquer subarray highlighting, midpoint markers, and merge placement.</li>
              <li><strong className="text-white">Binary Search:</strong> Displays L (Left), MID, and R (Right) pointers. Eliminates 50% of the range each step with shaded styling.</li>
              <li><strong className="text-white">BFS (Breadth-First Search):</strong> Real-time FIFO Queue animation showing enqueuing to rear and dequeuing from front. Supports both Network Graph and 2D Grid!</li>
              <li><strong className="text-white">DFS (Depth-First Search):</strong> Real-time LIFO Stack animation showing deep branch exploration, backtracking, and stack push/pop.</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Audio Sonification
            </h4>
            <p className="text-slate-300">
              Turn on audio in the top right to hear real-time pitch-shifted musical chords generated dynamically as elements are compared, swapped, or visited!
            </p>
          </div>

        </div>

        {/* Got it button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            Start Exploring
          </button>
        </div>

      </div>
    </div>
  );
}
