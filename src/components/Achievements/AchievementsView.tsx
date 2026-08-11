import React from 'react';
import { Trophy, Award, CheckCircle2, Lock, Flame, Star } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const AchievementsView: React.FC = () => {
  const { stats, patternStats } = useTracker();

  const achievementsList = [
    { id: 'a1', title: 'First Steps', desc: 'Solve your first DSA problem', threshold: 1, current: stats.solvedCount, icon: Star },
    { id: 'a2', title: 'Problem Solver 10', desc: 'Solve 10 DSA problems', threshold: 10, current: stats.solvedCount, icon: Trophy },
    { id: 'a3', title: 'Quarter Century 25', desc: 'Solve 25 DSA problems', threshold: 25, current: stats.solvedCount, icon: Trophy },
    { id: 'a4', title: 'Half Century 50', desc: 'Solve 50 DSA problems', threshold: 50, current: stats.solvedCount, icon: Award },
    { id: 'a5', title: 'Century 100', desc: 'Solve 100 DSA problems', threshold: 100, current: stats.solvedCount, icon: Award },
    { id: 'a6', title: 'DSA Veteran 150', desc: 'Solve 150 DSA problems', threshold: 150, current: stats.solvedCount, icon: Trophy },
    { id: 'a7', title: 'DSA Specialist 200', desc: 'Solve 200 DSA problems', threshold: 200, current: stats.solvedCount, icon: Trophy },
    { id: 'a8', title: 'Master 300', desc: 'Solve 300 DSA problems', threshold: 300, current: stats.solvedCount, icon: Award },
    { id: 'a9', title: 'Grandmaster 500', desc: 'Solve 500 DSA problems', threshold: 500, current: stats.solvedCount, icon: Award },

    { id: 's1', title: 'Consistency 7-Day', desc: 'Maintain a 7-day streak', threshold: 7, current: stats.longestStreak, icon: Flame },
    { id: 's2', title: 'Unstoppable 14-Day', desc: 'Maintain a 14-day streak', threshold: 14, current: stats.longestStreak, icon: Flame },
    { id: 's3', title: 'Dedicated 30-Day', desc: 'Maintain a 30-day streak', threshold: 30, current: stats.longestStreak, icon: Flame },
    { id: 's4', title: 'Iron Will 60-Day', desc: 'Maintain a 60-day streak', threshold: 60, current: stats.longestStreak, icon: Flame },
    { id: 's5', title: 'Legend 100-Day', desc: 'Maintain a 100-day streak', threshold: 100, current: stats.longestStreak, icon: Flame }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Achievements & Badges</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Unlock achievements as you solve problems and build daily consistency streaks.
        </p>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsList.map(item => {
          const isUnlocked = item.current >= item.threshold;
          const progress = Math.min(Math.round((item.current / item.threshold) * 100), 100);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isUnlocked
                  ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {isUnlocked ? <Icon className="w-6 h-6 fill-slate-950" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  {isUnlocked && (
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Unlocked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{item.current} / {item.threshold}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
