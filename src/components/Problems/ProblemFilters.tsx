import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

const PATTERNS_LIST = [
  'All',
  'Two Pointers',
  'Sliding Window',
  'Prefix Sum',
  'Hashing',
  'Binary Search',
  'Stack',
  'Linked List',
  'Double Linked List',
  'Trees',
  'Binary Search Tree',
  'Heap',
  'Greedy',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Intervals',
  'Trie',
  'Bit Manipulation',
  'Math',
  'Strings',
  'Arrays',
  'Recursion'
];

export const ProblemFilters: React.FC = () => {
  const { filter, setFilter, resetFilter, filteredProblems, stats } = useTracker();

  return (
    <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
      {/* Search & Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.search}
            onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search by problem name, LeetCode #, pattern, tag..."
            className="w-full h-10 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilter}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            Showing <span className="text-emerald-400 font-bold">{filteredProblems.length}</span> of {stats.totalProblems}
          </div>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filter.status}
            onChange={e => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved Only</option>
            <option value="Unsolved">Unsolved Only</option>
            <option value="Revision Needed">Needs Revision</option>
            <option value="Revision Due">Revision Due</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Difficulty
          </label>
          <select
            value={filter.difficulty}
            onChange={e => setFilter(prev => ({ ...prev, difficulty: e.target.value as any }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Source
          </label>
          <select
            value={filter.source}
            onChange={e => setFilter(prev => ({ ...prev, source: e.target.value as any }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Sources</option>
            <option value="Custom 140">Custom 140 Sheet</option>
            <option value="RisingBrain">RisingBrain Sheet</option>
            <option value="Both Sources">Present in Both</option>
          </select>
        </div>

        {/* Pattern */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Pattern
          </label>
          <select
            value={filter.pattern}
            onChange={e => setFilter(prev => ({ ...prev, pattern: e.target.value }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {PATTERNS_LIST.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filter.sortBy}
            onChange={e => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="name">Problem Name</option>
            <option value="difficulty">Difficulty</option>
            <option value="pattern">Pattern</option>
            <option value="solved_date">Solved Date</option>
            <option value="confidence">Confidence Rating</option>
            <option value="leetcode_number">LeetCode #</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Order
          </label>
          <select
            value={filter.sortOrder}
            onChange={e => setFilter(prev => ({ ...prev, sortOrder: e.target.value as any }))}
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="asc">Ascending (A-Z / 1-9)</option>
            <option value="desc">Descending (Z-A / 9-1)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
