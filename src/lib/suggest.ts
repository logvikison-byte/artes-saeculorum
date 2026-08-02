import type { Mood, Session, Technique } from '../types';
import { TECHNIQUES } from '../data/techniques';

/**
 * Rules-based technique suggestion (see PLAN.md §2.2):
 * - never repeat the technique used in the most recent session
 * - every 3rd session, prefer something the user hasn't tried yet
 * - match the user's mood to technique mood tags
 * - otherwise prefer techniques the user rated as more focused
 */
export function suggestTechnique(
  sessions: Session[],
  mood: Mood | null,
  timeSec: number | null,
): Technique {
  const completed = sessions.filter((s) => s.completed);
  const lastId = completed.length > 0 ? completed[completed.length - 1].techniqueId : null;

  let pool = TECHNIQUES.filter((t) => t.id !== lastId);
  if (pool.length === 0) pool = [...TECHNIQUES];

  if (timeSec !== null) {
    const fitting = pool.filter((t) => t.durations.some((d) => d <= timeSec));
    if (fitting.length > 0) pool = fitting;
  }

  // Novelty injection: every 3rd session, surface an untried technique.
  const tried = new Set(completed.map((s) => s.techniqueId));
  if (completed.length > 0 && completed.length % 3 === 2) {
    const untried = pool.filter((t) => !tried.has(t.id));
    if (untried.length > 0) pool = untried;
  }

  if (mood) {
    const matching = pool.filter((t) => t.moodTags.includes(mood));
    if (matching.length > 0) pool = matching;
  }

  // Prefer techniques with higher average focus ratings; unrated ones get a
  // neutral score so new techniques still surface.
  const scored = pool.map((t) => {
    const ratings = completed
      .filter((s) => s.techniqueId === t.id && s.focusRating !== undefined)
      .map((s) => s.focusRating!);
    const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 3;
    return { technique: t, score: avg + Math.random() * 1.5 };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].technique;
}

/** Stable-for-the-day pick shown on the dashboard's "Today's suggestion" card. */
export function dailySuggestion(sessions: Session[]): Technique {
  const today = new Date();
  const seed = today.getFullYear() * 372 + today.getMonth() * 31 + today.getDate();
  const completed = sessions.filter((s) => s.completed);
  const lastId = completed.length > 0 ? completed[completed.length - 1].techniqueId : null;
  const pool = TECHNIQUES.filter((t) => t.id !== lastId);
  const list = pool.length > 0 ? pool : TECHNIQUES;
  return list[seed % list.length];
}
