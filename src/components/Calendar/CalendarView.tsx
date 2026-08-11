import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const CalendarView: React.FC = () => {
  const { dailyActivities, problems, stats } = useTracker();

  // Generate 365 days dates grid
  const daysGrid = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const activity = dailyActivities[dateStr];
      const solvedFromProgs = problems.filter(
        p => p.progress?.is_solved && p.progress?.solved_date && p.progress.solved_date.split('T')[0] === dateStr
      ).length;

      const solvedCount = Math.max(activity?.problems_solved || 0, solvedFromProgs);

      result.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        solvedCount: solvedCount
      });
    }
    return result;
  }, [dailyActivities, problems]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Contribution & Activity Calendar</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            GitHub & LeetCode style daily contribution heatmap tracking your consistency over the year.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-800/40">
          <Flame className="w-4 h-4" />
          <span>Current Streak: {stats.currentStreak} Days</span>
        </div>
      </div>

      {/* Heatmap Calendar Box */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Past 365 Days</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-3 h-3 rounded bg-emerald-700" />
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <div className="w-3 h-3 rounded bg-emerald-400 shadow-sm shadow-emerald-500/50" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[750px]">
            {daysGrid.map(item => {
              let bgClass = 'bg-slate-950 border border-slate-800/60';
              if (item.solvedCount === 1) bgClass = 'bg-emerald-950 border border-emerald-800/80';
              else if (item.solvedCount === 2) bgClass = 'bg-emerald-800';
              else if (item.solvedCount >= 3 && item.solvedCount < 5) bgClass = 'bg-emerald-600';
              else if (item.solvedCount >= 5) bgClass = 'bg-emerald-400 shadow-sm shadow-emerald-400/50';

              return (
                <div
                  key={item.date}
                  className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-all hover:scale-125 cursor-pointer`}
                  title={`${item.date}: ${item.solvedCount} problems solved`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
