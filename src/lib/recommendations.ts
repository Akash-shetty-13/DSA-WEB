import { CombinedProblemProgress } from '../types/dsa';

export interface RecommendationResult {
  problem: CombinedProblemProgress;
  score: number;
  reason: string;
}

export function getRecommendedProblems(
  problems: CombinedProblemProgress[],
  limit: number = 3
): RecommendationResult[] {
  const unsolved = problems.filter(p => !p.progress?.is_solved);
  if (unsolved.length === 0) return [];

  // Calculate pattern progress stats to find active learning patterns
  const patternTotalMap: Record<string, number> = {};
  const patternSolvedMap: Record<string, number> = {};

  problems.forEach(p => {
    const pat = p.primary_pattern;
    patternTotalMap[pat] = (patternTotalMap[pat] || 0) + 1;
    if (p.progress?.is_solved) {
      patternSolvedMap[pat] = (patternSolvedMap[pat] || 0) + 1;
    }
  });

  const scoredList: RecommendationResult[] = unsolved.map(p => {
    let score = 0;
    let reasons: string[] = [];

    const pat = p.primary_pattern;
    const totalInPattern = patternTotalMap[pat] || 1;
    const solvedInPattern = patternSolvedMap[pat] || 0;
    const patternCompletionRatio = solvedInPattern / totalInPattern;

    // 1. Revision due check
    if (p.progress?.needs_revision) {
      score += 100;
      reasons.push('Revision due for this problem');
    }

    // 2. Custom 140 priority
    if (p.sources.includes('custom')) {
      score += 50;
      reasons.push('Featured in your Custom 140 Sheet');
    }

    // 3. Active learning pattern priority (in active 20%-80% momentum zone)
    if (patternCompletionRatio > 0.2 && patternCompletionRatio < 0.9) {
      score += 40;
      reasons.push(`You have completed ${solvedInPattern}/${totalInPattern} ${pat} problems`);
    } else if (solvedInPattern > 0) {
      score += 20;
      reasons.push(`Building on your ${pat} foundation (${solvedInPattern} solved)`);
    }

    // 4. Difficulty progression
    if (p.difficulty === 'Easy' && solvedInPattern === 0) {
      score += 30;
      reasons.push('Great introductory problem for this pattern');
    } else if (p.difficulty === 'Medium') {
      score += 25;
      reasons.push('Standard interview medium question');
    }

    // Default reason fallback
    const mainReason = reasons.length > 0 ? reasons.join(' • ') : `Recommended problem in ${pat}`;

    return {
      problem: p,
      score: score,
      reason: mainReason
    };
  });

  // Sort by score descending
  scoredList.sort((a, b) => b.score - a.score);

  return scoredList.slice(0, limit);
}
