import type { Session, Technique, UnlockContext } from '../types';
import { TECHNIQUES } from '../data/techniques';
import { completedSessions, longestStreak, techniquesTried, totalMinutes } from './stats';

export function unlockContext(sessions: Session[]): UnlockContext {
  return {
    sessionCount: completedSessions(sessions).length,
    totalMinutes: totalMinutes(sessions),
    longestStreak: longestStreak(sessions),
    techniquesTried: techniquesTried(sessions),
  };
}

export function isUnlocked(technique: Technique, sessions: Session[]): boolean {
  if (!technique.unlock) return true;
  return technique.unlock.test(unlockContext(sessions));
}

export function unlockedTechniques(sessions: Session[]): Technique[] {
  const ctx = unlockContext(sessions);
  return TECHNIQUES.filter((t) => !t.unlock || t.unlock.test(ctx));
}

/** Techniques that this session's completion pushed over their unlock threshold. */
export function newlyUnlocked(sessions: Session[], finishedSessionId: string): Technique[] {
  const before = sessions.filter((s) => s.id !== finishedSessionId);
  const wasUnlocked = new Set(unlockedTechniques(before).map((t) => t.id));
  return unlockedTechniques(sessions).filter((t) => !wasUnlocked.has(t.id));
}
