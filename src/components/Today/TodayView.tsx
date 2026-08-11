import React, { useState } from 'react';
import { CalendarCheck, Target, CheckCircle2, Clock, Flame, RotateCcw, Play, Check } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { useAuth } from '../../context/AuthContext';
import { getRecommendedProblems } from '../../lib/recommendations';

export const TodayView: React.FC = () => {
  const { problems, stats, revisionQueue, markProblemSolved, setSelectedProblem } = useTracker();
  const { user, updateProfile } = useAuth();

  const targetGoal = user?.daily_goal || 3;
  const solvedToday = stats.solvedToday;
  const goalPercentage = Math.min(Math.round((solvedToday / targetGoal) * 100), 100);

  const [customGoalInput, setCustomGoalInput] = useState(targetGoal.toString());

  const todayStr = new Date().toISOString().split('T')[0];
  const solvedTodayList = problems.filter(
    p => p.progress?.is_solved && p.progress?.solved_date && p.progress.solved_date.split('T')[0] === todayStr
  );

  const recommendedToday = getRecommendedProblems(problems, 3);

  const handleSelectGoal = (goal: number) => {
    updateProfile({ daily_goal: goal });
    setCustomGoalInput(goal.toString());
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" />
            <span>Today's Mastery Tracker</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Focus on your daily goal target to maintain your streak and steady progress.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <span>Date: </span>
          <span className="font-bold text-white">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Row 1: Daily Target Ring & Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Goal Target Progress Ring */}
        <div className="md:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* SVG Progress Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="text-slate-800 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="text-emerald-400 stroke-current transition-all duration-500"
                  strokeWidth="10"
                  strokeDasharray={326.72}
                  strokeDashoffset={326.72 - (326.72 * goalPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white font-mono">{solvedToday} / {targetGoal}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Solved</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Daily Target Goal</span>
                {solvedToday >= targetGoal && (
                  <span className="text-xs bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    Goal Met! 🎉
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Solve at least 1 problem to extend your streak. Complete your daily goal to maximize retention.
              </p>

              {/* Goal Selector Buttons */}
              <div className="flex items-center gap-1.5 mt-4">
                <span className="text-xs font-semibold text-slate-400 mr-1">Target:</span>
                {[1, 2, 3, 5].map(g => (
                  <button
                    key={g}
                    onClick={() => handleSelectGoal(g)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      targetGoal === g
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Streak & Activity Card */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Streak Status</span>
            <Flame className="w-5 h-5 fill-amber-400/20 animate-pulse" />
          </div>

          <div className="my-4">
            <div className="text-4xl font-extrabold text-white font-mono">{stats.currentStreak} Days</div>
            <p className="text-xs text-amber-400/90 mt-1 font-semibold">
              {solvedToday > 0 ? 'Streak maintained today!' : 'Solve 1 problem today to keep streak active'}
            </p>
          </div>

          <div className="text-xs text-slate-400 pt-3 border-t border-slate-800 font-mono">
            Longest recorded streak: <span className="text-amber-300 font-bold">{stats.longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Row 2: Today's Solved Queue */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-white mb-3">Problems Solved Today ({solvedTodayList.length})</h3>

        {solvedTodayList.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
            You haven't solved a problem today yet. Pick one from the recommended list below to start!
          </div>
        ) : (
          <div className="space-y-2">
            {solvedTodayList.map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">{p.title}</span>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">{p.primary_pattern}</span>
                </div>
                <span className="font-mono text-slate-400">{p.progress?.time_taken || 15} mins</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 3: Recommended Queue for Today */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-white mb-3">Recommended Problems to Solve Today</h3>
        <div className="space-y-3">
          {recommendedToday.map(({ problem, reason }) => (
            <div key={problem.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{problem.title}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Pattern: {problem.primary_pattern} ({problem.difficulty})</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-sans">{reason}</p>
              </div>

              <button
                onClick={() => setSelectedProblem(problem)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
              >
                Solve Problem
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
