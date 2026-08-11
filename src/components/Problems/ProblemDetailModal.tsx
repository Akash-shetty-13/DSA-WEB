import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Circle,
  Star,
  Clock,
  RotateCcw,
  BookOpen,
  Youtube,
  Globe,
  Save,
  Sparkles,
  Building2
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CombinedProblemProgress, SolutionNotes } from '../../types/dsa';

interface ProblemDetailModalProps {
  problem: CombinedProblemProgress | null;
  onClose: () => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ problem, onClose }) => {
  const { markProblemSolved, markProblemUnsolved, updateProblemNotes, scheduleRevision } = useTracker();

  if (!problem) return null;

  const isSolved = Boolean(problem.progress?.is_solved);
  const [confidence, setConfidence] = useState(problem.progress?.confidence || 3);
  const [timeTaken, setTimeTaken] = useState(problem.progress?.time_taken || 15);
  const [attempts, setAttempts] = useState(problem.progress?.attempts || 1);
  const [notes, setNotes] = useState(problem.progress?.notes || '');
  
  const [solutionNotes, setSolutionNotes] = useState<SolutionNotes>({
    approach: problem.progress?.solution_notes?.approach || '',
    algorithm: problem.progress?.solution_notes?.algorithm || '',
    timeComplexity: problem.progress?.solution_notes?.timeComplexity || '',
    spaceComplexity: problem.progress?.solution_notes?.spaceComplexity || '',
    mistakes: problem.progress?.solution_notes?.mistakes || '',
    keyInsight: problem.progress?.solution_notes?.keyInsight || ''
  });

  const [activeTab, setActiveTab] = useState<'details' | 'solution' | 'revision'>('details');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    setConfidence(problem.progress?.confidence || 3);
    setTimeTaken(problem.progress?.time_taken || 15);
    setAttempts(problem.progress?.attempts || 1);
    setNotes(problem.progress?.notes || '');
    setSolutionNotes({
      approach: problem.progress?.solution_notes?.approach || '',
      algorithm: problem.progress?.solution_notes?.algorithm || '',
      timeComplexity: problem.progress?.solution_notes?.timeComplexity || '',
      spaceComplexity: problem.progress?.solution_notes?.spaceComplexity || '',
      mistakes: problem.progress?.solution_notes?.mistakes || '',
      keyInsight: problem.progress?.solution_notes?.keyInsight || ''
    });
  }, [problem]);

  const handleSaveNotes = async () => {
    await updateProblemNotes(problem.id, notes, solutionNotes);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  const handleToggleSolved = async () => {
    if (isSolved) {
      await markProblemUnsolved(problem.id);
    } else {
      await markProblemSolved(problem.id, {
        time_taken: timeTaken,
        confidence: confidence,
        notes: notes,
        solution_notes: solutionNotes
      });
    }
  };

  const handleScheduleRevision = (days: number) => {
    scheduleRevision(problem.id, days, confidence, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
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

              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {problem.primary_pattern}
              </span>

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

            <h3 className="text-xl font-extrabold text-white">
              {problem.leetcode_number ? `${problem.leetcode_number}. ` : ''}{problem.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'solution'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solution & Notes
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'revision'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Revision Schedule
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* External Links Bar */}
              <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> LeetCode Official <ExternalLink className="w-3 h-3" />
                </a>

                {problem.youtube_url && (
                  <a
                    href={problem.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" /> Video Solution <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {problem.practice_url && (
                  <a
                    href={problem.practice_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> GFG Practice <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Status & Solve Action */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {isSolved ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Status: <span className="text-emerald-400">{problem.progress?.status || 'Not Started'}</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isSolved ? `Solved on ${new Date(problem.progress?.solved_date || '').toLocaleDateString()}` : 'Not completed yet'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleSolved}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isSolved
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-950/50'
                  }`}
                >
                  {isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                </button>
              </div>

              {/* Stats & Confidence Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Confidence Rating */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Confidence Level (1-5)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setConfidence(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= confidence
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700 hover:text-amber-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    {confidence === 1 && '1 = Hard to grasp'}
                    {confidence === 2 && '2 = Need major help'}
                    {confidence === 3 && '3 = Understand approach'}
                    {confidence === 4 && '4 = Solved with minor help'}
                    {confidence === 5 && '5 = Mastered independently'}
                  </p>
                </div>

                {/* Time Taken */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Time Taken (minutes)</label>
                  <input
                    type="number"
                    value={timeTaken}
                    onChange={e => setTimeTaken(Number(e.target.value))}
                    min={1}
                    className="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg px-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Attempts */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Total Attempts</label>
                  <input
                    type="number"
                    value={attempts}
                    onChange={e => setAttempts(Number(e.target.value))}
                    min={1}
                    className="w-full h-9 bg-slate-900 border border-slate-800 rounded-lg px-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Personal Quick Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Personal Quick Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Use left and right pointers. Move left when left value is smaller."
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Approach & Intuition</label>
                  <textarea
                    value={solutionNotes.approach}
                    onChange={e => setSolutionNotes({ ...solutionNotes, approach: e.target.value })}
                    placeholder="Key intuition, data structure choice..."
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Algorithm Steps</label>
                  <textarea
                    value={solutionNotes.algorithm}
                    onChange={e => setSolutionNotes({ ...solutionNotes, algorithm: e.target.value })}
                    placeholder="Step 1: ..., Step 2: ..."
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={solutionNotes.timeComplexity}
                    onChange={e => setSolutionNotes({ ...solutionNotes, timeComplexity: e.target.value })}
                    placeholder="e.g. O(N log N)"
                    className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={solutionNotes.spaceComplexity}
                    onChange={e => setSolutionNotes({ ...solutionNotes, spaceComplexity: e.target.value })}
                    placeholder="e.g. O(1)"
                    className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-400 mb-1">Common Mistakes</label>
                  <textarea
                    value={solutionNotes.mistakes}
                    onChange={e => setSolutionNotes({ ...solutionNotes, mistakes: e.target.value })}
                    placeholder="Boundary check off-by-one, integer overflow..."
                    rows={2}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Key Insight</label>
                  <textarea
                    value={solutionNotes.keyInsight}
                    onChange={e => setSolutionNotes({ ...solutionNotes, keyInsight: e.target.value })}
                    placeholder="The core trick or pattern shortcut..."
                    rows={2}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revision' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1">Schedule Next Review</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Select an interval to queue this problem for future spaced repetition.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: 'Tomorrow', days: 1 },
                    { label: 'In 3 Days', days: 3 },
                    { label: 'In 7 Days', days: 7 },
                    { label: 'In 14 Days', days: 14 },
                    { label: 'In 30 Days', days: 30 }
                  ].map(option => (
                    <button
                      key={option.days}
                      onClick={() => handleScheduleRevision(option.days)}
                      className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all text-center"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {isSavedAlert && <span className="text-emerald-400 font-bold">✓ Notes saved successfully!</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Notes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
