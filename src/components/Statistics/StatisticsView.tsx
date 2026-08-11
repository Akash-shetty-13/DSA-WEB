import React from 'react';
import { BarChart3, TrendingUp, Clock, Brain, Trophy } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const StatisticsView: React.FC = () => {
  const { stats, patternStats } = useTracker();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>Advanced Performance Statistics</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed metrics, pattern mastery rates, and study duration analytics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Problems Solved</span>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">{stats.solvedCount}</div>
          <p className="text-xs text-emerald-400 mt-1">{stats.progressPercentage}% of total merged sheet</p>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Solved This Week</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">{stats.solvedThisWeek}</div>
          <p className="text-xs text-slate-400 mt-1">{stats.solvedThisMonth} solved this month</p>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Confidence</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{stats.averageConfidence} / 5</div>
          <p className="text-xs text-slate-400 mt-1">Across all completed problems</p>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Practice Hours</span>
          <div className="text-3xl font-extrabold text-teal-400 font-mono mt-2">
            {(stats.totalStudyTime / 60).toFixed(1)} hrs
          </div>
          <p className="text-xs text-slate-400 mt-1">{stats.totalStudyTime} total minutes</p>
        </div>
      </div>

      {/* Pattern Breakdown Ranking */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-white mb-4">Pattern Mastery Leaderboard</h3>
        <div className="space-y-4">
          {patternStats.map(stat => (
            <div key={stat.pattern} className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold">{stat.pattern}</span>
                <span className="text-emerald-400">{stat.solved} / {stat.total} ({stat.percentage}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
