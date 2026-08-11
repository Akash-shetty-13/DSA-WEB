import React, { useState } from 'react';
import { BookmarkCheck, CheckCircle2, Circle, ExternalLink, Sparkles, Star } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress } from '../../types/dsa';

export const My140View: React.FC = () => {
  const { problems, stats, markProblemSolved, markProblemUnsolved, setSelectedProblem } = useTracker();

  // Filter only custom 140 problems
  const customProblems = problems.filter(p => p.sources.includes('custom'));

  // Group by pattern
  const patternGroupMap: Record<string, CombinedProblemProgress[]> = {};
  customProblems.forEach(p => {
    const pat = p.primary_pattern;
    if (!patternGroupMap[pat]) patternGroupMap[pat] = [];
    patternGroupMap[pat].push(p);
  });

  const [activePatternFilter, setActivePatternFilter] = useState<string>('All');

  const patternKeys = Object.keys(patternGroupMap);
  const filteredPatternKeys = activePatternFilter === 'All'
    ? patternKeys
    : patternKeys.filter(k => k === activePatternFilter);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-500/20 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Dedicated Sheet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Personal 140 DSA Sheet
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Curated list of 140 essential interview problems categorized across 16 core patterns.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right font-mono">
          <div className="text-2xl font-extrabold text-emerald-400">
            {stats.customSheetStats.solved} / {stats.customSheetStats.total}
          </div>
          <p className="text-xs text-slate-400">
            {stats.customSheetStats.percentage}% Completed
          </p>
        </div>
      </div>

      {/* Pattern Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setActivePatternFilter('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activePatternFilter === 'All'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Patterns ({customProblems.length})
        </button>

        {patternKeys.map(pat => {
          const list = patternGroupMap[pat];
          const solved = list.filter(p => p.progress?.is_solved).length;

          return (
            <button
              key={pat}
              onClick={() => setActivePatternFilter(pat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activePatternFilter === pat
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{pat}</span>
              <span className="font-mono text-[10px] opacity-80">({solved}/{list.length})</span>
            </button>
          );
        })}
      </div>

      {/* Pattern Grouped Cards */}
      <div className="space-y-6">
        {filteredPatternKeys.map(pat => {
          const list = patternGroupMap[pat];
          const solved = list.filter(p => p.progress?.is_solved).length;
          const percentage = list.length > 0 ? Math.round((solved / list.length) * 100) : 0;

          return (
            <div key={pat} className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
              {/* Pattern Group Header */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{pat}</span>
                    <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {solved} of {list.length} solved
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{percentage}%</span>
                </div>
              </div>

              {/* Problems Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map(p => {
                  const isSolved = Boolean(p.progress?.is_solved);

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <button
                          onClick={() => {
                            if (isSolved) markProblemUnsolved(p.id);
                            else markProblemSolved(p.id);
                          }}
                          className="mt-0.5 focus:outline-none"
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-emerald-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => setSelectedProblem(p)}
                            className="text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors text-left truncate block w-full"
                          >
                            {p.leetcode_number ? `${p.leetcode_number}. ` : ''}{p.title}
                          </button>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                                p.difficulty === 'Easy'
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                  : p.difficulty === 'Medium'
                                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                                  : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                              }`}
                            >
                              {p.difficulty}
                            </span>

                            {p.progress?.confidence ? (
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-2.5 h-2.5 ${
                                      star <= (p.progress?.confidence || 0)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-800'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Open LeetCode"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
