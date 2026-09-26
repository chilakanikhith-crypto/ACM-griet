import React from "react";
import {
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  RotateCcw,
} from "lucide-react";

const ProgressPanel = ({
  progress = {},
  onReset = () => {},
}) => {
  const xp = progress.xp || 0;
  const level = progress.level || 1;
  const challengesCompleted =
    progress.challengesCompleted || 0;
  const correctAnswers =
    progress.correctAnswers || 0;
  const totalAnswers =
    progress.totalAnswers || 0;
  const bestStreak =
    progress.bestStreak || 0;

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const levelXP =
    xp - currentLevelXP;

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      (levelXP / 100) * 100
    )
  );

  const accuracy =
    totalAnswers > 0
      ? Math.round(
          (correctAnswers /
            totalAnswers) *
            100
        )
      : 0;

  return (
    <section className="relative z-10 mt-6 rounded-2xl border border-slate-700/60 bg-slate-900/75 p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10">
              <Trophy
                size={24}
                className="text-yellow-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Learning Progress
              </h2>

              <p className="text-sm text-slate-400">
                Keep practicing and level up your
                algorithm skills.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <RotateCcw size={16} />
            Reset Progress
          </button>
        </div>

        {/* Level */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star
                size={18}
                className="text-yellow-400"
                fill="currentColor"
              />

              <span className="font-semibold text-white">
                Level {level}
              </span>
            </div>

            <span className="text-sm text-slate-400">
              {levelXP} / 100 XP
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>
              {currentLevelXP} XP
            </span>

            <span>
              Next Level: {nextLevelXP} XP
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* XP */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Star
                size={17}
                className="text-yellow-400"
                fill="currentColor"
              />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total XP
              </span>
            </div>

            <p className="text-2xl font-bold text-white">
              {xp}
            </p>
          </div>

          {/* Challenges */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target
                size={17}
                className="text-cyan-400"
              />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Challenges
              </span>
            </div>

            <p className="text-2xl font-bold text-white">
              {challengesCompleted}
            </p>
          </div>

          {/* Accuracy */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award
                size={17}
                className="text-emerald-400"
              />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Accuracy
              </span>
            </div>

            <p className="text-2xl font-bold text-white">
              {accuracy}%
            </p>
          </div>

          {/* Best Streak */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-950/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Flame
                size={17}
                className="text-orange-400"
              />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Best Streak
              </span>
            </div>

            <p className="text-2xl font-bold text-white">
              {bestStreak}
            </p>
          </div>
        </div>

        {/* Learning message */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">
          <p className="text-sm text-slate-300">
            {totalAnswers === 0
              ? "🎯 Start a challenge to begin earning XP."
              : accuracy >= 80
              ? "🔥 Excellent work! Your algorithm understanding is growing."
              : accuracy >= 50
              ? "💪 Good progress! Keep practicing to improve your accuracy."
              : "🧠 Keep practicing. Every wrong answer is another learning opportunity."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgressPanel;