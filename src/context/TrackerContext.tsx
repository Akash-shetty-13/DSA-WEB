import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Problem,
  UserProgress,
  CombinedProblemProgress,
  DashboardStats,
  PatternStat,
  FilterState,
  RevisionRecord,
  DailyActivity,
  PracticeSession
} from '../types/dsa';
import { storage } from '../lib/storage';
import { useAuth } from './AuthContext';

interface TrackerContextType {
  problems: CombinedProblemProgress[];
  stats: DashboardStats;
  patternStats: PatternStat[];
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilter: () => void;
  filteredProblems: CombinedProblemProgress[];
  selectedProblem: CombinedProblemProgress | null;
  setSelectedProblem: (problem: CombinedProblemProgress | null) => void;
  markProblemSolved: (problemId: string, details?: { time_taken?: number; confidence?: number; notes?: string; solution_notes?: any }) => Promise<void>;
  markProblemUnsolved: (problemId: string) => Promise<void>;
  updateProblemNotes: (problemId: string, notes: string, solutionNotes?: any) => Promise<void>;
  scheduleRevision: (problemId: string, intervalDays: number, confidenceAfter?: number, notes?: string) => Promise<void>;
  revisionQueue: CombinedProblemProgress[];
  dailyActivities: Record<string, DailyActivity>;
  practiceSessions: PracticeSession[];
  savePracticeSession: (session: PracticeSession) => void;
  exportDataJSON: () => string;
  exportProgressCSV: () => string;
  importDataJSON: (jsonContent: string) => { success: boolean; message: string; count: number };
  refreshData: () => void;
}

const defaultFilter: FilterState = {
  search: '',
  status: 'All',
  difficulty: 'All',
  source: 'All',
  pattern: 'All',
  subPattern: 'All',
  sortBy: 'name',
  sortOrder: 'asc'
};

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user_default';

  const [rawProblems, setRawProblems] = useState<Problem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [revisionHistory, setRevisionHistory] = useState<RevisionRecord[]>([]);
  const [dailyActivities, setDailyActivities] = useState<Record<string, DailyActivity>>({});
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectedProblem, setSelectedProblem] = useState<CombinedProblemProgress | null>(null);

  const loadData = useCallback(() => {
    const pList = storage.getProblems();
    const pMap = storage.loadUserProgress(userId);
    const revs = storage.loadRevisionHistory(userId);
    const daily = storage.loadDailyActivities(userId);
    const practice = storage.loadPracticeSessions(userId);

    setRawProblems(pList);
    setProgressMap(pMap);
    setRevisionHistory(revs);
    setDailyActivities(daily);
    setPracticeSessions(practice);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Combine raw problems with user progress
  const problems: CombinedProblemProgress[] = useMemo(() => {
    return rawProblems.map(p => ({
      ...p,
      progress: progressMap[p.id]
    }));
  }, [rawProblems, progressMap]);

  // Dynamic Dashboard Stats Calculation
  const stats: DashboardStats = useMemo(() => {
    const totalProblems = problems.length;
    let solvedCount = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalEasy = 0;
    let totalMedium = 0;
    let totalHard = 0;
    let confidenceSum = 0;
    let solvedConfidenceCount = 0;

    let customTotal = 0;
    let customSolved = 0;
    let rbTotal = 0;
    let rbSolved = 0;
    let bothTotal = 0;
    let bothSolved = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let solvedToday = 0;
    let solvedThisWeek = 0;
    let solvedThisMonth = 0;
    let totalStudyTime = 0;
    let revisionDueCount = 0;

    problems.forEach(p => {
      const isSolved = Boolean(p.progress?.is_solved);
      const diff = p.difficulty;

      if (diff === 'Easy') totalEasy++;
      else if (diff === 'Medium') totalMedium++;
      else if (diff === 'Hard') totalHard++;

      if (isSolved) {
        solvedCount++;
        if (diff === 'Easy') easySolved++;
        else if (diff === 'Medium') mediumSolved++;
        else if (diff === 'Hard') hardSolved++;

        if (p.progress?.confidence) {
          confidenceSum += p.progress.confidence;
          solvedConfidenceCount++;
        }

        if (p.progress?.solved_date) {
          const sDate = new Date(p.progress.solved_date);
          const sDateStr = p.progress.solved_date.split('T')[0];
          if (sDateStr === todayStr) solvedToday++;
          if (sDate >= oneWeekAgo) solvedThisWeek++;
          if (sDate >= startOfMonth) solvedThisMonth++;
        }
      }

      if (p.progress?.needs_revision) {
        revisionDueCount++;
      } else if (p.progress?.revision_date) {
        const rDate = new Date(p.progress.revision_date);
        if (rDate <= now) revisionDueCount++;
      }

      if (p.progress?.time_taken) {
        totalStudyTime += p.progress.time_taken;
      }

      // Source breakdowns
      const isCustom = p.sources.includes('custom');
      const isRB = p.sources.includes('risingbrain');

      if (isCustom) {
        customTotal++;
        if (isSolved) customSolved++;
      }
      if (isRB) {
        rbTotal++;
        if (isSolved) rbSolved++;
      }
      if (isCustom && isRB) {
        bothTotal++;
        if (isSolved) bothSolved++;
      }
    });

    // Calculate Streaks from daily activities & solved dates
    const activeDates = new Set<string>();
    Object.values(dailyActivities).forEach(act => {
      if (act.problems_solved > 0) activeDates.add(act.date);
    });

    problems.forEach(p => {
      if (p.progress?.solved_date) {
        activeDates.add(p.progress.solved_date.split('T')[0]);
      }
    });

    const sortedDates = Array.from(activeDates).sort((a, b) => b.localeCompare(a));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (sortedDates.length > 0) {
      // Check if today or yesterday is active for current streak
      const todayDate = new Date();
      const todayString = todayDate.toISOString().split('T')[0];
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayString = yesterdayDate.toISOString().split('T')[0];

      let checkDate = new Date();
      if (!activeDates.has(todayString) && activeDates.has(yesterdayString)) {
        checkDate = yesterdayDate;
      }

      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Longest streak
      let prevDate: Date | null = null;
      sortedDates.sort((a, b) => a.localeCompare(b)).forEach(dStr => {
        const curDate = new Date(dStr);
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        prevDate = curDate;
      });
    }

    const progressPercentage = totalProblems > 0 ? parseFloat(((solvedCount / totalProblems) * 100).toFixed(1)) : 0;
    const averageConfidence = solvedConfidenceCount > 0 ? parseFloat((confidenceSum / solvedConfidenceCount).toFixed(1)) : 0;

    return {
      totalProblems,
      solvedCount,
      unsolvedCount: totalProblems - solvedCount,
      progressPercentage,
      easySolved,
      mediumSolved,
      hardSolved,
      totalEasy,
      totalMedium,
      totalHard,
      solvedToday,
      solvedThisWeek,
      solvedThisMonth,
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      revisionDueCount,
      averageConfidence,
      totalStudyTime,
      customSheetStats: {
        total: customTotal,
        solved: customSolved,
        percentage: customTotal > 0 ? parseFloat(((customSolved / customTotal) * 100).toFixed(1)) : 0
      },
      risingBrainStats: {
        total: rbTotal,
        solved: rbSolved,
        percentage: rbTotal > 0 ? parseFloat(((rbSolved / rbTotal) * 100).toFixed(1)) : 0
      },
      bothSourcesStats: {
        total: bothTotal,
        solved: bothSolved,
        percentage: bothTotal > 0 ? parseFloat(((bothSolved / bothTotal) * 100).toFixed(1)) : 0
      }
    };
  }, [problems, dailyActivities]);

  // Pattern statistics breakdown
  const patternStats: PatternStat[] = useMemo(() => {
    const map: Record<string, { total: number; solved: number; easy: number; medium: number; hard: number; revision: number }> = {};

    problems.forEach(p => {
      const pat = p.primary_pattern;
      if (!map[pat]) {
        map[pat] = { total: 0, solved: 0, easy: 0, medium: 0, hard: 0, revision: 0 };
      }

      map[pat].total++;
      if (p.progress?.is_solved) {
        map[pat].solved++;
        if (p.difficulty === 'Easy') map[pat].easy++;
        if (p.difficulty === 'Medium') map[pat].medium++;
        if (p.difficulty === 'Hard') map[pat].hard++;
      }
      if (p.progress?.needs_revision) {
        map[pat].revision++;
      }
    });

    return Object.entries(map).map(([pat, data]) => ({
      pattern: pat,
      total: data.total,
      solved: data.solved,
      percentage: data.total > 0 ? parseFloat(((data.solved / data.total) * 100).toFixed(1)) : 0,
      easySolved: data.easy,
      mediumSolved: data.medium,
      hardSolved: data.hard,
      needsRevisionCount: data.revision
    }));
  }, [problems]);

  // Revision Due Queue
  const revisionQueue: CombinedProblemProgress[] = useMemo(() => {
    const now = new Date();
    return problems.filter(p => {
      if (p.progress?.needs_revision) return true;
      if (p.progress?.revision_date) {
        return new Date(p.progress.revision_date) <= now;
      }
      return false;
    });
  }, [problems]);

  // Filtered & Sorted Problems for Table/Grid
  const filteredProblems: CombinedProblemProgress[] = useMemo(() => {
    return problems.filter(p => {
      // 1. Search Query
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLc = p.leetcode_number?.toString() === query || `leetcode ${p.leetcode_number}` === query;
        const matchesPattern = p.primary_pattern.toLowerCase().includes(query) || (p.sub_pattern && p.sub_pattern.toLowerCase().includes(query));
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesTag = p.tags.some(t => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesLc && !matchesPattern && !matchesCategory && !matchesTag) {
          return false;
        }
      }

      // 2. Status Filter
      if (filter.status === 'Solved' && !p.progress?.is_solved) return false;
      if (filter.status === 'Unsolved' && p.progress?.is_solved) return false;
      if (filter.status === 'Revision Needed' && !p.progress?.needs_revision) return false;
      if (filter.status === 'Revision Due') {
        const isDue = p.progress?.needs_revision || (p.progress?.revision_date && new Date(p.progress.revision_date) <= new Date());
        if (!isDue) return false;
      }

      // 3. Difficulty Filter
      if (filter.difficulty !== 'All' && p.difficulty !== filter.difficulty) return false;

      // 4. Source Filter
      if (filter.source === 'Custom 140' && !p.sources.includes('custom')) return false;
      if (filter.source === 'RisingBrain' && !p.sources.includes('risingbrain')) return false;
      if (filter.source === 'Both Sources' && !(p.sources.includes('custom') && p.sources.includes('risingbrain'))) return false;

      // 5. Pattern Filter
      if (filter.pattern !== 'All' && p.primary_pattern !== filter.pattern && p.category !== filter.pattern) return false;

      // 6. Sub-pattern Filter
      if (filter.subPattern !== 'All' && p.sub_pattern !== filter.subPattern) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filter.sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      } else if (filter.sortBy === 'difficulty') {
        const diffRank = { Easy: 1, Medium: 2, Hard: 3, Unknown: 4 };
        comparison = diffRank[a.difficulty] - diffRank[b.difficulty];
      } else if (filter.sortBy === 'pattern') {
        comparison = a.primary_pattern.localeCompare(b.primary_pattern);
      } else if (filter.sortBy === 'solved_date') {
        const dateA = a.progress?.solved_date ? new Date(a.progress.solved_date).getTime() : 0;
        const dateB = b.progress?.solved_date ? new Date(b.progress.solved_date).getTime() : 0;
        comparison = dateB - dateA;
      } else if (filter.sortBy === 'confidence') {
        comparison = (b.progress?.confidence || 0) - (a.progress?.confidence || 0);
      } else if (filter.sortBy === 'leetcode_number') {
        comparison = (a.leetcode_number || 999999) - (b.leetcode_number || 999999);
      }

      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [problems, filter]);

  const markProblemSolved = async (
    problemId: string,
    details?: { time_taken?: number; confidence?: number; notes?: string; solution_notes?: any }
  ) => {
    const updated = await storage.updateProblemProgress(userId, problemId, {
      is_solved: true,
      status: 'Solved',
      solved_date: new Date().toISOString(),
      attempts: (progressMap[problemId]?.attempts || 0) + 1,
      time_taken: details?.time_taken !== undefined ? details.time_taken : (progressMap[problemId]?.time_taken || 15),
      confidence: details?.confidence !== undefined ? details.confidence : (progressMap[problemId]?.confidence || 4),
      notes: details?.notes !== undefined ? details.notes : (progressMap[problemId]?.notes || ''),
      solution_notes: details?.solution_notes || progressMap[problemId]?.solution_notes
    });

    setProgressMap(prev => ({ ...prev, [problemId]: updated }));
    loadData();
  };

  const markProblemUnsolved = async (problemId: string) => {
    const updated = await storage.updateProblemProgress(userId, problemId, {
      is_solved: false,
      status: 'Not Started',
      confidence: 0,
      needs_revision: false
    });

    setProgressMap(prev => ({ ...prev, [problemId]: updated }));
    loadData();
  };

  const updateProblemNotes = async (problemId: string, notes: string, solutionNotes?: any) => {
    const updated = await storage.updateProblemProgress(userId, problemId, {
      notes,
      solution_notes: solutionNotes || progressMap[problemId]?.solution_notes
    });

    setProgressMap(prev => ({ ...prev, [problemId]: updated }));
  };

  const scheduleRevision = async (
    problemId: string,
    intervalDays: number,
    confidenceAfter?: number,
    notes?: string
  ) => {
    const currentConfidence = progressMap[problemId]?.confidence || 3;
    storage.addRevisionRecord(userId, {
      problem_id: problemId,
      reviewed_at: new Date().toISOString(),
      interval_days: intervalDays,
      confidence_before: currentConfidence,
      confidence_after: confidenceAfter || currentConfidence,
      revision_notes: notes || '',
      time_spent: 10
    });

    loadData();
  };

  const resetFilter = () => setFilter(defaultFilter);

  const savePracticeSession = (session: PracticeSession) => {
    storage.savePracticeSession(userId, session);
    setPracticeSessions(storage.loadPracticeSessions(userId));
  };

  return (
    <TrackerContext.Provider
      value={{
        problems,
        stats,
        patternStats,
        filter,
        setFilter,
        resetFilter,
        filteredProblems,
        selectedProblem,
        setSelectedProblem,
        markProblemSolved,
        markProblemUnsolved,
        updateProblemNotes,
        scheduleRevision,
        revisionQueue,
        dailyActivities,
        practiceSessions,
        savePracticeSession,
        exportDataJSON: () => storage.exportDataJSON(userId),
        exportProgressCSV: () => storage.exportProgressCSV(userId),
        importDataJSON: (content: string) => {
          const res = storage.importDataJSON(userId, content);
          if (res.success) loadData();
          return res;
        },
        refreshData: loadData
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
