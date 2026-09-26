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
  HelpCircle
} from 'lucide-react';

const ALGO_TABS = [
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    icon: ArrowUpDown
  },
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'Sorting',
    icon: GitMerge
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Searching',
    icon: Search
  },
  {
    id: 'bfs',
    name: 'BFS',
    category: 'Graph',
    icon: Network
  },
  {
    id: 'dfs',
    name: 'DFS',
    category: 'Graph',
    icon: GitFork
  }
];

export default function Header({
  activeAlgo,
  onSelectAlgo,
  isAudioOn,
  onToggleAudio,
  onOpenInfoModal
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">

        <div className="flex items-center gap-5">

          {/* LOGO */}
          <div className="flex items-center gap-3 shrink-0">

            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div className="hidden xl:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
                AlgoVisualizer
              </h1>

              <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                Interactive Algorithm Simulator
              </p>
            </div>

          </div>

          {/* ALGORITHM SELECTOR */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">

              {ALGO_TABS.map((tab) => {
                const Icon = tab.icon;

                const isActive =
                  activeAlgo === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      onSelectAlgo(tab.id)
                    }
                    className={`
                      shrink-0
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      border
                      text-sm
                      font-semibold
                      whitespace-nowrap
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300/40 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:border-slate-600'
                      }
                    `}
                  >

                    <Icon
                      className={`
                        w-4 h-4
                        shrink-0
                        ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-500'
                        }
                      `}
                    />

                    <span>
                      {tab.name}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-2 shrink-0">

            {/* SOUND */}
            <button
              type="button"
              onClick={onToggleAudio}
              className={`
                flex
                items-center
                gap-2
                px-3
                py-2.5
                rounded-xl
                border
                text-xs
                font-semibold
                transition-all
                ${
                  isAudioOn
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }
              `}
              title={
                isAudioOn
                  ? 'Mute audio'
                  : 'Enable audio'
              }
            >

              {isAudioOn ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}

              <span className="hidden lg:inline">
                {isAudioOn
                  ? 'Sound'
                  : 'Muted'}
              </span>

            </button>

            {/* GUIDE */}
            <button
              type="button"
              onClick={onOpenInfoModal}
              className="
                flex
                items-center
                gap-2
                px-3
                py-2.5
                rounded-xl
                bg-slate-900
                border
                border-slate-800
                text-slate-400
                hover:text-slate-100
                hover:border-slate-600
                text-xs
                font-semibold
                transition-all
              "
              title="Algorithm guide"
            >

              <HelpCircle className="w-4 h-4" />

              <span className="hidden lg:inline">
                Guide
              </span>

            </button>

          </div>

        </div>

      </div>

    </header>
  );
}