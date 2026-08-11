import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Target,
  Trophy,
  Brain,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { getRecommendedProblems } from '../../lib/recommendations';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { NavView } from '../Layout/Sidebar';

interface DashboardViewProps {
  onSelectView: (view: NavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView }) => {
  const { stats, patternStats, problems, setSelectedProblem, markProblemSolved } = useTracker();

  const recommended = getRecommendedProblems(problems, 2);

  // Difficulty Distribution Chart Data
  const difficultyData = [
    { name: 'Easy', value: stats.easySolved, total: stats.totalEasy, color: '#10b981' },
    { name: 'Medium', value: stats.mediumSolved, total: stats.totalMedium, color: '#f59e0b' },
    { name: 'Hard', value: stats.hardSolved, total: stats.totalHard, color: '#ef4444' }
  ];

  // Pattern Completion Bar Chart Data (Top 8 patterns by total)
  const patternChartData = patternStats
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map(p => ({
      name: p.pattern.length > 12 ? p.pattern.substring(0, 10) + '...' : p.pattern,
      fullName: p.pattern,
      Solved: p.solved,
      Remaining: p.total - p.solved
    }));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DSA Mastery Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Master Candidate!
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track your custom 140 sheet merged seamlessly with RisingBrain pattern problems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('practice')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span>Start Practice Session</span>
            </button>
            <button
              onClick={() => onSelectView('my140')}
              className="px-4 py-2.5 bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
            >
              My 140 Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Problems */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Problems</span>
            <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono">{stats.totalProblems}</div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Custom 140 + RisingBrain merged
            </p>
          </div>
        </div>

        {/* Solved Problems */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Solved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.solvedCount}</div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {stats.unsolvedCount} remaining
            </p>
          </div>
        </div>

        {/* Progress % */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-teal-400 font-mono">{stats.progressPercentage}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${stats.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sources Solved Summary */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Breakdown</span>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">Live DB</span>
          </div>
          <div className="mt-2 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>My 140:</span>
              <span className="font-bold text-emerald-400">{stats.customSheetStats.solved} / {stats.customSheetStats.total}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>RisingBrain:</span>
              <span className="font-bold text-teal-400">{stats.risingBrainStats.solved} / {stats.risingBrainStats.total}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Both Sources:</span>
              <span className="font-bold text-amber-400">{stats.bothSourcesStats.solved} / {stats.bothSourcesStats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Streak, Goal, Revision, Study Time */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/10 shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Streak</span>
            <Flame className="w-5 h-5 fill-amber-400/20 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.currentStreak} Days</div>
          <p className="text-xs text-slate-400 mt-1">Longest: {stats.longestStreak} days</p>
        </div>

        {/* Goal Card */}
        <div
          onClick={() => onSelectView('today')}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Target</span>
            <Target className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.solvedToday} Solved</div>
          <p className="text-xs text-slate-400 mt-1">Target: {stats.solvedToday} / 3 questions</p>
        </div>

        {/* Revision Due Card */}
        <div
          onClick={() => onSelectView('revision')}
          className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Revision Due</span>
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.revisionDueCount}</div>
          <p className="text-xs text-slate-400 mt-1">Click to review now</p>
        </div>

        {/* Total Study Time Card */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Study Time</span>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m
          </div>
          <p className="text-xs text-slate-400 mt-1">Avg confidence: {stats.averageConfidence} / 5</p>
        </div>
      </div>

      {/* Row 3: Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pattern Progress Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Pattern Progress Breakdown</h3>
              <p className="text-xs text-slate-400">Solved vs remaining across major topic patterns</p>
            </div>
            <button
              onClick={() => onSelectView('patterns')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Patterns <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Solved" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Remaining" fill="#334155" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Donut Chart */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Difficulty Distribution</h3>
            <p className="text-xs text-slate-400">Easy, Medium, and Hard solved ratios</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-emerald-400 font-bold font-mono">{stats.easySolved}</span>
              <p className="text-[11px] text-slate-400">Easy</p>
            </div>
            <div>
              <span className="text-amber-400 font-bold font-mono">{stats.mediumSolved}</span>
              <p className="text-[11px] text-slate-400">Medium</p>
            </div>
            <div>
              <span className="text-rose-400 font-bold font-mono">{stats.hardSolved}</span>
              <p className="text-[11px] text-slate-400">Hard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Pattern Recommendations Card */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">What Should I Solve Next?</h3>
              <p className="text-xs text-slate-400">Deterministic pattern recommendation based on your learning momentum</p>
            </div>
          </div>

          <button
            onClick={() => onSelectView('problems')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Explore All Problems <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map(({ problem, reason }) => (
            <div
              key={problem.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {problem.sources.includes('custom') && (
                      <span className="text-[10px] font-mono bg-purple-950/60 text-purple-400 px-1.5 py-0.5 rounded border border-purple-800/40">
                        Custom 140
                      </span>
                    )}
                    {problem.sources.includes('risingbrain') && (
                      <span className="text-[10px] font-mono bg-teal-950/60 text-teal-400 px-1.5 py-0.5 rounded border border-teal-800/40">
                        RisingBrain
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                  {problem.leetcode_number ? `${problem.leetcode_number}. ` : ''}{problem.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Pattern: <span className="text-slate-200">{problem.primary_pattern}</span>
                  {problem.sub_pattern && <span> ({problem.sub_pattern})</span>}
                </p>

                <p className="text-[11px] text-emerald-400/90 mt-2 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30">
                  <span className="font-semibold">Reason:</span> {reason}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Open LeetCode
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProblem(problem)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => markProblemSolved(problem.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    Solve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
