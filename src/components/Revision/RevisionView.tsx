import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Calendar, Star, Clock, AlertTriangle } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress } from '../../types/dsa';

export const RevisionView: React.FC = () => {
  const { revisionQueue, scheduleRevision, setSelectedProblem } = useTracker();

  const [activeSubTab, setActiveSubTab] = useState<'due' | 'upcoming'>('due');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-amber-400" />
            <span>Spaced Repetition Queue</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review difficult problems on scheduled intervals (1, 3, 7, 14, 30 days) to solidify long-term memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
            {revisionQueue.length} Due for Review
          </span>
        </div>
      </div>

      {/* Due Problems Queue List */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Due for Review Today</span>
        </h3>

        {revisionQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white">All Revisions Up to Date!</h4>
            <p className="text-xs text-slate-400 mt-1">
              No problems are currently due for review. Great job retaining your DSA knowledge!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {revisionQueue.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
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

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {p.primary_pattern}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                    {p.leetcode_number ? `${p.leetcode_number}. ` : ''}{p.title}
                  </h4>

                  {p.progress?.notes && (
                    <p className="text-xs text-slate-400 mt-1 font-mono italic">
                      "{p.progress.notes}"
                    </p>
                  )}
                </div>

                {/* Reschedule Interval Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Next Review:</span>
                  {[
                    { label: '1 Day', days: 1 },
                    { label: '3 Days', days: 3 },
                    { label: '7 Days', days: 7 },
                    { label: '14 Days', days: 14 }
                  ].map(interval => (
                    <button
                      key={interval.days}
                      onClick={() => scheduleRevision(p.id, interval.days, (p.progress?.confidence || 3) + 1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                    >
                      {interval.label}
                    </button>
                  ))}

                  <button
                    onClick={() => setSelectedProblem(p)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    View Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
