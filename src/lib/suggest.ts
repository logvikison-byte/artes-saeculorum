import type { Mood, Session, Technique } from '../types';
import { unlockedTechniques } from './unlocks';

export interface Suggestion {
  technique: Technique;
  /** Short human explanation shown in the UI, e.g. "you focus well with this". */
  reason: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function timeOfDay(d: Date = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

interface TechniqueStats {
  uses: number;
  avgFocus: number | null;
  avgMoodShift: number | null;
  /** Average focus rating for sessions started in the current time of day. */
  avgFocusThisTimeOfDay: number | null;
}

function statsFor(technique: Technique, completed: Session[], now: Date): TechniqueStats {
  const mine = completed.filter((s) => s.techniqueId === technique.id);
  const focus = mine.filter((s) => s.focusRating !== undefined).map((s) => s.focusRating!);
  const shifts = mine
    .filter((s) => s.moodBefore !== undefined && s.moodAfter !== undefined)
    .map((s) => s.moodAfter! - s.moodBefore!);
  const bucket = timeOfDay(now);
  const sameTime = mine.filter(
    (s) => s.focusRating !== undefined && timeOfDay(new Date(s.startedAt)) === bucket,
  );

  const avg = (xs: number[]) => (xs.length > 0 ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  return {
    uses: mine.length,
    avgFocus: avg(focus),
    avgMoodShift: avg(shifts),
    avgFocusThisTimeOfDay: avg(sameTime.map((s) => s.focusRating!)),
  };
}

/**
 * Adaptive technique suggestion (see PLAN.md §2.2 and Phase 3):
 * - never repeat the technique used in the most recent session
 * - every 3rd session, prefer something the user hasn't tried yet
 * - match the user's mood to technique mood tags
 * - weight by the user's own focus ratings, mood improvement, and which
 *   techniques work for them at this time of day
 */
export function suggestWithReason(
  sessions: Session[],
  mood: Mood | null,
  timeSec: number | null,
  now: Date = new Date(),
): Suggestion {
  const completed = sessions.filter((s) => s.completed);
  const lastId = completed.length > 0 ? completed[completed.length - 1].techniqueId : null;
  const available = unlockedTechniques(sessions);

  let pool = available.filter((t) => t.id !== lastId);
  if (pool.length === 0) pool = [...available];

  if (timeSec !== null) {
    const fitting = pool.filter((t) => t.durations.some((d) => d <= timeSec));
    if (fitting.length > 0) pool = fitting;
  }

  // Novelty injection: every 3rd session, surface an untried technique.
  const tried = new Set(completed.map((s) => s.techniqueId));
  const noveltyTurn = completed.length > 0 && completed.length % 3 === 2;
  if (noveltyTurn) {
    const untried = pool.filter((t) => !tried.has(t.id));
    if (untried.length > 0) pool = untried;
  }

  let moodMatched = false;
  if (mood) {
    const matching = pool.filter((t) => t.moodTags.includes(mood));
    if (matching.length > 0) {
      pool = matching;
      moodMatched = true;
    }
  }

  const scored = pool.map((t) => {
    const st = statsFor(t, completed, now);
    // Unrated techniques sit at a neutral 3 so they still surface early on.
    let score = st.avgFocus ?? 3;
    if (st.avgMoodShift !== null) score += st.avgMoodShift * 0.8;
    if (st.avgFocusThisTimeOfDay !== null) score += (st.avgFocusThisTimeOfDay - 3) * 0.6;
    if (st.uses === 0) score += 0.75; // curiosity bonus keeps practice fresh
    score += Math.random() * 1.2; // keep suggestions from feeling deterministic
    return { technique: t, stats: st, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  return { technique: best.technique, reason: reasonFor(best.stats, { moodMatched, mood, now }) };
}

function reasonFor(
  st: TechniqueStats,
  ctx: { moodMatched: boolean; mood: Mood | null; now: Date },
): string {
  if (st.uses === 0) return 'something new — worth a try';
  if (st.avgMoodShift !== null && st.avgMoodShift >= 1) return 'this one reliably lifts your mood';
  if (st.avgFocusThisTimeOfDay !== null && st.avgFocusThisTimeOfDay >= 4) {
    return `you focus well with this in the ${ctx.now.getHours() < 12 ? 'morning' : ctx.now.getHours() < 17 ? 'afternoon' : 'evening'}`;
  }
  if (st.avgFocus !== null && st.avgFocus >= 4) return 'you’ve been focusing well with this';
  if (ctx.moodMatched && ctx.mood) return `a good match for feeling ${ctx.mood}`;
  return 'a fresh change of pace';
}

/** Back-compat helper for callers that only need the technique. */
export function suggestTechnique(
  sessions: Session[],
  mood: Mood | null,
  timeSec: number | null,
): Technique {
  return suggestWithReason(sessions, mood, timeSec).technique;
}

/** Stable-for-the-day pick shown on the dashboard's "Today's suggestion" card. */
export function dailySuggestion(sessions: Session[]): Technique {
  const today = new Date();
  const seed = today.getFullYear() * 372 + today.getMonth() * 31 + today.getDate();
  const completed = sessions.filter((s) => s.completed);
  const lastId = completed.length > 0 ? completed[completed.length - 1].techniqueId : null;
  const available = unlockedTechniques(sessions);
  const pool = available.filter((t) => t.id !== lastId);
  const list = pool.length > 0 ? pool : available;
  return list[seed % list.length];
}
