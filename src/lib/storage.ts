import {
  Problem,
  UserProgress,
  RevisionRecord,
  DailyActivity,
  PracticeSession,
  UserProfile,
  CombinedProblemProgress,
  ProblemStatus
} from '../types/dsa';
import initialProblemsData from '../data/problems.json';
import { supabase, isSupabaseConfigured } from './supabase';

const PROGRESS_STORAGE_KEY = 'dsa_tracker_user_progress_v1';
const REVISION_STORAGE_KEY = 'dsa_tracker_revisions_v1';
const DAILY_STORAGE_KEY = 'dsa_tracker_daily_activity_v1';
const PRACTICE_STORAGE_KEY = 'dsa_tracker_practice_sessions_v1';
const USER_PROFILE_KEY = 'dsa_tracker_user_profile_v1';

// Initial pre-solved problem titles
const PRE_SOLVED_TITLES = new Set([
  'Two Sum',
  'Container With Most Water',
  'Remove Duplicates from Sorted Array',
  'Remove Element',
  'Valid Palindrome',
  'Sort Colors',
  'Move Zeroes',
  'Jump Game',
  'Jump Game II',
  'Gas Station',
  'Product of Array Except Self',
  'Longest Consecutive Sequence',
  'Continuous Subarray Sum',
  'Subarray Sum Equals K',
  'Maximum Product Subarray',
  'Maximum Subarray',
  '3Sum',
  '4Sum'
]);

export class StorageEngine {
  private static instance: StorageEngine;

  private constructor() {}

  public static getInstance(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  // Load canonical problems base data
  public getProblems(): Problem[] {
    return initialProblemsData as Problem[];
  }

  // Load user progress map (problem_id -> UserProgress)
  public loadUserProgress(userId: string): Record<string, UserProgress> {
    const raw = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse local progress:', e);
      }
    }

    // Default initialization with pre-solved problems
    const initialMap: Record<string, UserProgress> = {};
    const problems = this.getProblems();
    const now = new Date().toISOString();

    problems.forEach(p => {
      const isPreSolved = PRE_SOLVED_TITLES.has(p.title);
      initialMap[p.id] = {
        id: `prog_${p.id}`,
        user_id: userId,
        problem_id: p.id,
        status: isPreSolved ? 'Previously Solved' : 'Not Started',
        is_solved: isPreSolved,
        solved_date: isPreSolved ? now : null,
        attempts: isPreSolved ? 1 : 0,
        time_taken: isPreSolved ? 15 : 0,
        confidence: isPreSolved ? 4 : 0,
        needs_revision: false,
        revision_date: null,
        last_reviewed: isPreSolved ? now : null,
        review_count: 0,
        notes: isPreSolved ? 'Previously solved on LeetCode.' : '',
        solution_notes: {
          approach: '',
          algorithm: '',
          timeComplexity: '',
          spaceComplexity: '',
          mistakes: '',
          keyInsight: ''
        },
        created_at: now,
        updated_at: now
      };
    });

    this.saveUserProgress(userId, initialMap);
    return initialMap;
  }

  public saveUserProgress(userId: string, progressMap: Record<string, UserProgress>): void {
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${userId}`, JSON.stringify(progressMap));
  }

  public async updateProblemProgress(
    userId: string,
    problemId: string,
    updates: Partial<UserProgress>
  ): Promise<UserProgress> {
    const map = this.loadUserProgress(userId);
    const existing = map[problemId] || {
      id: `prog_${problemId}`,
      user_id: userId,
      problem_id: problemId,
      status: 'Not Started',
      is_solved: false,
      solved_date: null,
      attempts: 0,
      time_taken: 0,
      confidence: 0,
      needs_revision: false,
      revision_date: null,
      last_reviewed: null,
      review_count: 0,
      notes: '',
      solution_notes: {
        approach: '',
        algorithm: '',
        timeComplexity: '',
        spaceComplexity: '',
        mistakes: '',
        keyInsight: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updated: UserProgress = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Auto calculate Mastered status: Solved + Confidence >= 4 + at least 1 revision
    if (updated.is_solved && updated.confidence >= 4 && updated.review_count >= 1) {
      updated.status = 'Mastered';
    } else if (updated.is_solved && updated.status === 'Not Started') {
      updated.status = 'Solved';
    }

    map[problemId] = updated;
    this.saveUserProgress(userId, map);

    // Record today's activity if newly solved
    if (updates.is_solved && !existing.is_solved) {
      this.recordDailySolve(userId, updates.time_taken || 15);
    }

    // Supabase DB Sync if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('user_problem_progress').upsert({
          user_id: userId,
          problem_id: problemId,
          status: updated.status,
          is_solved: updated.is_solved,
          solved_date: updated.solved_date,
          attempts: updated.attempts,
          time_taken: updated.time_taken,
          confidence: updated.confidence,
          needs_revision: updated.needs_revision,
          revision_date: updated.revision_date,
          last_reviewed: updated.last_reviewed,
          review_count: updated.review_count,
          notes: updated.notes,
          solution_notes: updated.solution_notes,
          updated_at: updated.updated_at
        });
      } catch (err) {
        console.warn('Supabase sync error:', err);
      }
    }

    return updated;
  }

  // Revision Engine
  public loadRevisionHistory(userId: string): RevisionRecord[] {
    const raw = localStorage.getItem(`${REVISION_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  }

  public addRevisionRecord(userId: string, record: Omit<RevisionRecord, 'id' | 'user_id' | 'created_at'>): RevisionRecord {
    const history = this.loadRevisionHistory(userId);
    const newRecord: RevisionRecord = {
      ...record,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    history.push(newRecord);
    localStorage.setItem(`${REVISION_STORAGE_KEY}_${userId}`, JSON.stringify(history));

    // Update parent problem progress review_count & last_reviewed
    const map = this.loadUserProgress(userId);
    if (map[record.problem_id]) {
      const p = map[record.problem_id];
      const reviewCount = (p.review_count || 0) + 1;
      const confidence = record.confidence_after || p.confidence;
      
      // Calculate next revision date based on interval_days
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + record.interval_days);

      this.updateProblemProgress(userId, record.problem_id, {
        confidence,
        review_count: reviewCount,
        last_reviewed: record.reviewed_at,
        needs_revision: false,
        revision_date: nextDate.toISOString(),
        status: (p.is_solved && confidence >= 4 && reviewCount >= 1) ? 'Mastered' : p.status
      });
    }

    return newRecord;
  }

  // Daily Activity & Streak Engine
  public loadDailyActivities(userId: string): Record<string, DailyActivity> {
    const raw = localStorage.getItem(`${DAILY_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : {};
  }

  public recordDailySolve(userId: string, timeSpentMinutes: number = 15): void {
    const activities = this.loadDailyActivities(userId);
    const today = new Date().toISOString().split('T')[0];
    
    const existing = activities[today] || {
      id: `act_${today}`,
      user_id: userId,
      date: today,
      problems_solved: 0,
      study_time: 0,
      target_goal: 3
    };

    existing.problems_solved += 1;
    existing.study_time += timeSpentMinutes;

    activities[today] = existing;
    localStorage.setItem(`${DAILY_STORAGE_KEY}_${userId}`, JSON.stringify(activities));
  }

  // Practice Sessions (Learning Mode)
  public loadPracticeSessions(userId: string): PracticeSession[] {
    const raw = localStorage.getItem(`${PRACTICE_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  }

  public savePracticeSession(userId: string, session: PracticeSession): void {
    const sessions = this.loadPracticeSessions(userId);
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(`${PRACTICE_STORAGE_KEY}_${userId}`, JSON.stringify(sessions));
  }

  // User Profile & Settings
  public loadUserProfile(userId: string): UserProfile {
    const raw = localStorage.getItem(`${USER_PROFILE_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);

    const defaultProfile: UserProfile = {
      id: userId,
      email: 'coder@dsa-mastery.com',
      name: 'DSA Explorer',
      daily_goal: 3,
      theme: 'dark'
    };
    this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  public saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(`${USER_PROFILE_KEY}_${profile.id}`, JSON.stringify(profile));
  }

  // Data Export & Import Engine
  public exportDataJSON(userId: string): string {
    const payload = {
      version: '1.0.0',
      export_date: new Date().toISOString(),
      user_id: userId,
      profile: this.loadUserProfile(userId),
      progress: this.loadUserProgress(userId),
      revisions: this.loadRevisionHistory(userId),
      daily_activities: this.loadDailyActivities(userId),
      practice_sessions: this.loadPracticeSessions(userId)
    };
    return JSON.stringify(payload, null, 2);
  }

  public exportProgressCSV(userId: string): string {
    const problems = this.getProblems();
    const progressMap = this.loadUserProgress(userId);

    const headers = [
      'Problem ID',
      'Title',
      'Difficulty',
      'Pattern',
      'Sub Pattern',
      'Sources',
      'Status',
      'Is Solved',
      'Confidence',
      'Attempts',
      'Time Taken (min)',
      'Solved Date',
      'Notes'
    ];

    const rows = problems.map(p => {
      const prog = progressMap[p.id] || {};
      return [
        `"${p.id}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.difficulty}"`,
        `"${p.primary_pattern}"`,
        `"${p.sub_pattern || ''}"`,
        `"${(p.sources || []).join(', ')}"`,
        `"${prog.status || 'Not Started'}"`,
        `"${prog.is_solved ? 'Yes' : 'No'}"`,
        `"${prog.confidence || 0}"`,
        `"${prog.attempts || 0}"`,
        `"${prog.time_taken || 0}"`,
        `"${prog.solved_date || ''}"`,
        `"${(prog.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  public importDataJSON(userId: string, jsonContent: string): { success: boolean; message: string; count: number } {
    try {
      const data = JSON.parse(jsonContent);
      if (!data.progress) {
        return { success: false, message: 'Invalid file format: Missing progress object.', count: 0 };
      }

      // Merge behavior - never delete existing progress, update/upsert entries
      const currentMap = this.loadUserProgress(userId);
      let count = 0;

      Object.entries(data.progress).forEach(([pid, importedProg]: [string, any]) => {
        currentMap[pid] = {
          ...(currentMap[pid] || {}),
          ...importedProg,
          user_id: userId,
          updated_at: new Date().toISOString()
        };
        count++;
      });

      this.saveUserProgress(userId, currentMap);

      if (data.revisions && Array.isArray(data.revisions)) {
        const existingRevs = this.loadRevisionHistory(userId);
        const combinedRevs = [...existingRevs, ...data.revisions];
        localStorage.setItem(`${REVISION_STORAGE_KEY}_${userId}`, JSON.stringify(combinedRevs));
      }

      if (data.daily_activities) {
        const currentDaily = this.loadDailyActivities(userId);
        const mergedDaily = { ...currentDaily, ...data.daily_activities };
        localStorage.setItem(`${DAILY_STORAGE_KEY}_${userId}`, JSON.stringify(mergedDaily));
      }

      return { success: true, message: `Successfully merged data for ${count} problems.`, count };
    } catch (e: any) {
      return { success: false, message: `Failed to parse JSON file: ${e.message}`, count: 0 };
    }
  }
}

export const storage = StorageEngine.getInstance();
