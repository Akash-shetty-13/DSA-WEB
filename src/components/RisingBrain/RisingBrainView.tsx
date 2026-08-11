import React, { useState } from 'react';
import { Zap, ChevronRight, ChevronDown, CheckCircle2, Circle, ExternalLink, Youtube, BookOpen, Building2 } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress } from '../../types/dsa';

export const RisingBrainView: React.FC = () => {
  const { problems, stats, markProblemSolved, markProblemUnsolved, setSelectedProblem } = useTracker();

  // Filter RisingBrain problems
  const rbProblems = problems.filter(p => p.sources.includes('risingbrain'));

  // Group by category (Topic) -> sub_pattern (Subtopic)
  const topicMap: Record<string, Record<string, CombinedProblemProgress[]>> = {};

  rbProblems.forEach(p => {
    const cat = p.category || p.primary_pattern;
    const sub = p.sub_pattern || 'General';

    if (!topicMap[cat]) topicMap[cat] = {};
    if (!topicMap[cat][sub]) topicMap[cat][sub] = [];
    topicMap[cat][sub].push(p);
  });

  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({
    'Array_Two-Pointer': true,
    'Array_Sliding Window': true
  });

  const toggleSubtopic = (key: string) => {
    setExpandedSubtopics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-teal-500/20 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Pattern-Wise Sheet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            RisingBrain Official DSA Sheet
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Complete live problem set retrieved directly from RisingBrain across 17 topics and 60+ pattern subcategories.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right font-mono">
          <div className="text-2xl font-extrabold text-teal-400">
            {stats.risingBrainStats.solved} / {stats.risingBrainStats.total}
          </div>
          <p className="text-xs text-slate-400">
            {stats.risingBrainStats.percentage}% Solved
          </p>
        </div>
      </div>

      {/* Topics & Subtopics Accordion Hierarchy */}
      <div className="space-y-8">
        {Object.entries(topicMap).map(([topicTitle, subtopicsObj]) => {
          let topicTotal = 0;
          let topicSolved = 0;

          Object.values(subtopicsObj).forEach(list => {
            topicTotal += list.length;
            topicSolved += list.filter(p => p.progress?.is_solved).length;
          });

          return (
            <div key={topicTitle} className="space-y-3">
              {/* Topic Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{topicTitle}</span>
                  </h3>
                </div>

                <div className="font-mono text-xs text-slate-400">
                  <span className="font-bold text-teal-400">{topicSolved}</span> / {topicTotal} solved
                </div>
              </div>

              {/* Subtopics List */}
              <div className="space-y-3">
                {Object.entries(subtopicsObj).map(([subTitle, list]) => {
                  const subKey = `${topicTitle}_${subTitle}`;
                  const isExpanded = Boolean(expandedSubtopics[subKey]);
                  const subSolved = list.filter(p => p.progress?.is_solved).length;
                  const subPercentage = Math.round((subSolved / list.length) * 100);

                  return (
                    <div
                      key={subTitle}
                      className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all"
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleSubtopic(subKey)}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-teal-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-white">{subTitle}</h4>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {list.length} problems
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 font-mono text-xs">
                          <span className="text-slate-300">
                            {subSolved} / {list.length}
                          </span>

                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-teal-400 h-full transition-all duration-300 rounded-full"
                              style={{ width: `${subPercentage}%` }}
                            />
                          </div>

                          <span className="text-teal-400 font-bold w-10 text-right">{subPercentage}%</span>
                        </div>
                      </button>

                      {/* Subtopic Problems List */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-800/60 bg-slate-950/60 divide-y divide-slate-800/40">
                          {list.map(p => {
                            const isSolved = Boolean(p.progress?.is_solved);

                            return (
                              <div
                                key={p.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => {
                                      if (isSolved) markProblemUnsolved(p.id);
                                      else markProblemSolved(p.id);
                                    }}
                                    className="mt-0.5 focus:outline-none"
                                  >
                                    {isSolved ? (
                                      <CheckCircle2 className="w-4 h-4 text-teal-400 fill-teal-400/20" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-600 hover:text-teal-400" />
                                    )}
                                  </button>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        onClick={() => setSelectedProblem(p)}
                                        className="text-xs font-bold text-slate-200 hover:text-teal-400 transition-colors text-left"
                                      >
                                        {p.title}
                                      </button>

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

                                      {p.sources.includes('custom') && (
                                        <span className="text-[9px] font-mono bg-purple-950/60 text-purple-400 px-1 py-0.2 rounded border border-purple-800/40">
                                          In My 140
                                        </span>
                                      )}
                                    </div>

                                    {p.companies && p.companies.length > 0 && (
                                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        <Building2 className="w-3 h-3 text-slate-500" />
                                        {p.companies.slice(0, 3).map((comp: any) => (
                                          <span
                                            key={comp.name || comp}
                                            className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800"
                                          >
                                            {comp.name || comp}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pl-7 sm:pl-0">
                                  {p.youtube_url && (
                                    <a
                                      href={p.youtube_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 text-xs flex items-center gap-1 transition-colors"
                                      title="Watch Solution Video"
                                    >
                                      <Youtube className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                                  >
                                    Solve <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
