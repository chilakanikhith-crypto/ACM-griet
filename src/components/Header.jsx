import React from 'react';
import { 
  ArrowUpDown, 
  GitMerge, 
  Search, 
  Network, 
  GitFork, 
  Volume2, 
  VolumeX, 
  Sparkles,
  HelpCircle,
  Atom
} from 'lucide-react';

const ALGO_TABS = [
  { id: 'bubble_sort', name: 'Bubble Sort', category: 'Sorting', icon: ArrowUpDown },
  { id: 'merge_sort', name: 'Merge Sort', category: 'Sorting', icon: GitMerge },
  { id: 'binary_search', name: 'Binary Search', category: 'Searching', icon: Search },
  { id: 'bfs', name: 'BFS', category: 'Graph / Grid', icon: Network },
  { id: 'dfs', name: 'DFS', category: 'Graph / Grid', icon: GitFork },
];

export default function Header({ 
  activeAlgo, 
  onSelectAlgo, 
  isAudioOn, 
  onToggleAudio, 
  isInteractiveBg,
  onToggleInteractiveBg,
  onOpenInfoModal 
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AlgoVisualizer
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Round 2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Interactive Algorithm Simulator & Learning Lab
              </p>
            </div>
          </div>

          {/* Mobile Audio / Bg / Info toggles */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleInteractiveBg}
              className={`p-2 rounded-lg border transition-all ${
                isInteractiveBg
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle interactive background"
            >
              <Atom className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-lg border transition-all ${
                isAudioOn
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={isAudioOn ? 'Mute audio sonification' : 'Unmute audio sonification'}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenInfoModal}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="About this visualizer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Algorithm Selectors */}
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          {ALGO_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAlgo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectAlgo(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                  isActive ? 'bg-black/20 text-cyan-100' : 'text-slate-400'
                }`}>
                  {tab.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onToggleInteractiveBg}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isInteractiveBg
                ? 'bg-purple-500/15 border-purple-500/35 text-purple-300 hover:bg-purple-500/25 shadow-sm shadow-purple-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
            title="Interactive particle constellation background (follows cursor, ripples on click)"
          >
            <Atom className={`w-3.5 h-3.5 ${isInteractiveBg ? 'text-purple-400 animate-spin-slow' : 'text-slate-500'}`} />
            <span>{isInteractiveBg ? 'Bg Active' : 'Bg Off'}</span>
          </button>

          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isAudioOn
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
            title="Algorithm sonification: plays pitch-based audio synthesized per operation"
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Muted</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all"
            title="Algorithm guide & info"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
}
