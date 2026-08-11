import React, { useState } from 'react';
import { BrainCircuit, CheckCircle2, AlertCircle, SkipForward, RotateCcw, Play, ExternalLink, Trophy, Clock } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress, PracticeSession } from '../../types/dsa';

export const PracticeSessionView: React.FC = () => {
  const { problems, markProblemSolved, scheduleRevision, savePracticeSession } = useTracker();

  // Setup options
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [questionCount, setQuestionCount] = useState<number>(3);

  // Session Active state
  const [activeSession, setActiveSession] = useState<{
    problems: CombinedProblemProgress[];
    currentIndex: number;
    solvedCount: number;
    skippedCount: number;
    startTime: number;
    isCompleted: boolean;
  } | null>(null);

  const PATTERNS_LIST = [
    'All',
    'Two Pointers',
    'Sliding Window',
    'Prefix Sum',
    'Hashing',
    'Binary Search',
    'Stack',
    'Linked List',
    'Trees',
    'Heap',
    'Greedy',
    'Backtracking',
    'Graphs',
    'Dynamic Programming'
  ];

  const handleStartSession = () => {
    let pool = problems;
    if (selectedPattern !== 'All') {
      pool = pool.filter(p => p.primary_pattern === selectedPattern || p.category === selectedPattern);
    }
    if (selectedDifficulty !== 'All') {
      pool = pool.filter(p => p.difficulty === selectedDifficulty);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);

    if (shuffled.length === 0) {
      alert('No problems match your practice session criteria!');
      return;
    }

    setActiveSession({
      problems: shuffled,
      currentIndex: 0,
      solvedCount: 0,
      skippedCount: 0,
      startTime: Date.now(),
      isCompleted: false
    });
  };

  const handleAction = async (action: 'solved' | 'help' | 'skip' | 'revision') => {
    if (!activeSession) return;

    const currentProblem = activeSession.problems[activeSession.currentIndex];

    if (action === 'solved') {
      await markProblemSolved(currentProblem.id, { confidence: 5 });
    } else if (action === 'help') {
      await markProblemSolved(currentProblem.id, { confidence: 3 });
    } else if (action === 'revision') {
      await scheduleRevision(currentProblem.id, 1, 2);
    }

    const nextIndex = activeSession.currentIndex + 1;
    const isEnd = nextIndex >= activeSession.problems.length;

    const newSolved = action === 'solved' || action === 'help' ? activeSession.solvedCount + 1 : activeSession.solvedCount;
    const newSkipped = action === 'skip' ? activeSession.skippedCount + 1 : activeSession.skippedCount;

    if (isEnd) {
      const timeSpentSec = Math.round((Date.now() - activeSession.startTime) / 1000);
      const sessionData: PracticeSession = {
        id: `session_${Date.now()}`,
        user_id: 'current_user',
        pattern: selectedPattern,
        difficulty: selectedDifficulty,
        total_questions: activeSession.problems.length,
        solved_questions: newSolved,
        skipped_questions: newSkipped,
        avg_confidence: 4.0,
        time_spent: timeSpentSec,
        status: 'completed',
        created_at: new Date().toISOString(),
        problem_ids: activeSession.problems.map(p => p.id)
      };

      savePracticeSession(sessionData);

      setActiveSession({
        ...activeSession,
        solvedCount: newSolved,
        skippedCount: newSkipped,
        isCompleted: true
      });
    } else {
      setActiveSession({
        ...activeSession,
        currentIndex: nextIndex,
        solvedCount: newSolved,
        skippedCount: newSkipped
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-emerald-400" />
          <span>Practice Session (Learning Mode)</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Simulate targeted interview coding tests with step-by-step problem evaluation.
        </p>
      </div>

      {!activeSession ? (
        /* Setup Form */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Configure Practice Session</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pattern */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Target Pattern
              </label>
              <select
                value={selectedPattern}
                onChange={e => setSelectedPattern(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {PATTERNS_LIST.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>1 Question</option>
                <option value={2}>2 Questions</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Start Practice Session
          </button>
        </div>
      ) : activeSession.isCompleted ? (
        /* Summary Screen */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <Trophy className="w-16 h-16 text-emerald-400 mx-auto" />
          <div>
            <h3 className="text-2xl font-extrabold text-white">Practice Session Completed!</h3>
            <p className="text-sm text-slate-400 mt-1">Here is your summary performance report.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-2xl font-extrabold text-emerald-400">{activeSession.solvedCount}</span>
              <p className="text-xs text-slate-400 mt-1">Solved</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-2xl font-extrabold text-amber-400">{activeSession.skippedCount}</span>
              <p className="text-xs text-slate-400 mt-1">Skipped</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-2xl font-extrabold text-teal-400">{activeSession.problems.length}</span>
              <p className="text-xs text-slate-400 mt-1">Total</p>
            </div>
          </div>

          <button
            onClick={() => setActiveSession(null)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
          >
            Configure Another Session
          </button>
        </div>
      ) : (
        /* Active Flashcard Screen */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
            <span>
              Question <strong className="text-white">{activeSession.currentIndex + 1}</strong> of {activeSession.problems.length}
            </span>
            <span className="text-emerald-400 font-bold">
              {activeSession.problems[activeSession.currentIndex].primary_pattern}
            </span>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  activeSession.problems[activeSession.currentIndex].difficulty === 'Easy'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                    : activeSession.problems[activeSession.currentIndex].difficulty === 'Medium'
                    ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                    : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                }`}
              >
                {activeSession.problems[activeSession.currentIndex].difficulty}
              </span>

              <a
                href={activeSession.problems[activeSession.currentIndex].url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Open LeetCode <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              {activeSession.problems[activeSession.currentIndex].title}
            </h3>

            <p className="text-xs text-slate-400 font-mono">
              Category: {activeSession.problems[activeSession.currentIndex].category}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => handleAction('solved')}
              className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> I Solved It
            </button>

            <button
              onClick={() => handleAction('help')}
              className="py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" /> Needed Help
            </button>

            <button
              onClick={() => handleAction('revision')}
              className="py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Mark Revision
            </button>

            <button
              onClick={() => handleAction('skip')}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <SkipForward className="w-4 h-4" /> Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
