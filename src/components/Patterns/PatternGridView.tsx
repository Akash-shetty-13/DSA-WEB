import React from 'react';
import { Boxes, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { NavView } from '../Layout/Sidebar';

interface PatternGridViewProps {
  onSelectView: (view: NavView) => void;
}

export const PatternGridView: React.FC<PatternGridViewProps> = ({ onSelectView }) => {
  const { patternStats, setFilter } = useTracker();

  const handlePatternClick = (patternName: string) => {
    setFilter(prev => ({ ...prev, pattern: patternName }));
    onSelectView('problems');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Boxes className="w-6 h-6 text-emerald-400" />
          <span>DSA Pattern Dashboards</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Master algorithms topic by topic. Select any pattern card to filter problem tables.
        </p>
      </div>

      {/* Grid of Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patternStats.map(stat => (
          <div
            key={stat.pattern}
            onClick={() => handlePatternClick(stat.pattern)}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {stat.pattern}
                </h3>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Progress Count */}
              <div className="flex items-baseline justify-between font-mono mb-2">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {stat.solved} / {stat.total}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {stat.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>

            {/* Bottom Breakdown & Revisions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">{stat.easySolved}E</span>
                <span>•</span>
                <span className="text-amber-400">{stat.mediumSolved}M</span>
                <span>•</span>
                <span className="text-rose-400">{stat.hardSolved}H</span>
              </div>

              {stat.needsRevisionCount > 0 && (
                <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                  <RotateCcw className="w-3 h-3" />
                  <span>{stat.needsRevisionCount} due</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
