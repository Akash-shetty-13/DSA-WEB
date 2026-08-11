export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Unknown';
export type ProblemStatus = 'Not Started' | 'In Progress' | 'Solved' | 'Needs Revision' | 'Mastered' | 'Previously Solved';
export type ProblemSource = 'custom' | 'risingbrain' | 'both';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  leetcode_number?: number | null;
  url: string;
  leetcode_url?: string | null;
  difficulty: Difficulty;
  category: string; // e.g. "Array", "Strings", "Trees"
  sub_pattern?: string | null; // e.g. "Two-Pointer", "Sliding Window"
  primary_pattern: string; // Major pattern
  secondary_patterns: string[];
  source: ProblemSource;
  sources: ('custom' | 'risingbrain')[];
  description?: string;
  tags: string[];
  youtube_url?: string | null;
  practice_url?: string | null;
  companies?: Company[];
  created_at?: string;
  updated_at?: string;
}

export interface SolutionNotes {
  approach: string;
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  mistakes: string;
  keyInsight: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_id: string;
  status: ProblemStatus;
  is_solved: boolean;
  solved_date?: string | null;
  attempts: number;
  time_taken: number; // in minutes
  confidence: number; // 1 to 5
  needs_revision: boolean;
  revision_date?: string | null;
  last_reviewed?: string | null;
  review_count: number;
  notes: string;
  solution_notes: SolutionNotes;
  created_at: string;
  updated_at: string;
}

export interface CombinedProblemProgress extends Problem {
  progress?: UserProgress;
}

export interface RevisionRecord {
  id: string;
  user_id: string;
  problem_id: string;
  reviewed_at: string;
  interval_days: number; // 1, 3, 7, 14, 30
  confidence_before: number;
  confidence_after: number;
  revision_notes: string;
  time_spent: number;
  created_at?: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  problems_solved: number;
  study_time: number; // minutes
  target_goal: number;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  pattern: string;
  difficulty: string;
  total_questions: number;
  solved_questions: number;
  skipped_questions: number;
  avg_confidence: number;
  time_spent: number; // seconds
  status: 'in_progress' | 'completed';
  created_at: string;
  problem_ids: string[];
}

export interface DashboardStats {
  totalProblems: number;
  solvedCount: number;
  unsolvedCount: number;
  progressPercentage: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  solvedToday: number;
  solvedThisWeek: number;
  solvedThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  revisionDueCount: number;
  averageConfidence: number;
  totalStudyTime: number; // in minutes
  customSheetStats: {
    total: number;
    solved: number;
    percentage: number;
  };
  risingBrainStats: {
    total: number;
    solved: number;
    percentage: number;
  };
  bothSourcesStats: {
    total: number;
    solved: number;
    percentage: number;
  };
}

export interface PatternStat {
  pattern: string;
  total: number;
  solved: number;
  percentage: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  needsRevisionCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'problems' | 'pattern' | 'streak';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface FilterState {
  search: string;
  status: 'All' | 'Solved' | 'Unsolved' | 'Revision Needed' | 'Revision Due';
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  source: 'All' | 'Custom 140' | 'RisingBrain' | 'Both Sources';
  pattern: string;
  subPattern: string;
  sortBy: 'name' | 'difficulty' | 'pattern' | 'solved_date' | 'attempts' | 'confidence' | 'leetcode_number';
  sortOrder: 'asc' | 'desc';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  daily_goal: number;
  theme: 'dark' | 'light' | 'system';
}
