import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit3,
  Star,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Youtube,
  Globe
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress } from '../../types/dsa';
import { ProblemFilters } from './ProblemFilters';

export const ProblemTableView: React.FC = () => {
  const { filteredProblems, markProblemSolved, markProblemUnsolved, setSelectedProblem, scheduleRevision } = useTracker();

  // Pagination state for maximum performance
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">All Problems</h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, solve, and revise problems merged from Custom 140 & RisingBrain.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <ProblemFilters />

      {/* Table Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Pattern / Sub-pattern</th>
                <th className="py-3.5 px-4">Sources</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-300">No problems match your filters.</p>
                      <p className="text-xs text-slate-500">Try resetting filters or changing search keywords.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProblems.map(p => {
                  const isSolved = p.progress?.is_solved;
                  const confidence = p.progress?.confidence || 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (isSolved) {
                              markProblemUnsolved(p.id);
                            } else {
                              markProblemSolved(p.id);
                            }
                          }}
                          className="focus:outline-none group-hover:scale-110 transition-transform"
                          title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400 transition-colors" />
                          )}
                        </button>
                      </td>

                      {/* Problem Title & Links */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProblem(p)}
                            className="font-semibold text-slate-100 hover:text-emerald-400 transition-colors text-left"
                          >
                            {p.leetcode_number ? `${p.leetcode_number}. ` : ''}{p.title}
                          </button>

                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Open on LeetCode"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {p.progress?.notes && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5 font-normal italic">
                            "{p.progress.notes}"
                          </p>
                        )}
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                              : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Pattern & Sub-pattern */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                        <div className="font-semibold text-slate-200">{p.primary_pattern}</div>
                        {p.sub_pattern && (
                          <div className="text-[10px] text-slate-400">{p.sub_pattern}</div>
                        )}
                      </td>

                      {/* Sources Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          {p.sources.includes('custom') && (
                            <span className="text-[10px] font-mono bg-purple-950/60 text-purple-400 px-1.5 py-0.5 rounded border border-purple-800/40">
                              Custom 140
                            </span>
                          )}
                          {p.sources.includes('risingbrain') && (
                            <span className="text-[10px] font-mono bg-teal-950/60 text-teal-400 px-1.5 py-0.5 rounded border border-teal-800/40">
                              RisingBrain
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Confidence Rating Stars */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= confidence
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedProblem(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Edit Notes & Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => scheduleRevision(p.id, 3)}
                            className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border border-amber-800/40 transition-colors"
                            title="Schedule Revision in 3 Days"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 transition-colors"
                            title="Open LeetCode Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <span className="font-bold text-white">{currentPage}</span> of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
