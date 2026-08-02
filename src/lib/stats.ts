import type { Session } from '../types';

/** Local calendar day key, e.g. "2026-08-02". */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function completedSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.completed);
}

export function totalMinutes(sessions: Session[]): number {
  const secs = completedSessions(sessions).reduce((sum, s) => sum + s.durationSec, 0);
  return Math.round(secs / 60);
}

export function practiceDays(sessions: Session[]): Set<string> {
  return new Set(completedSessions(sessions).map((s) => dayKey(new Date(s.startedAt))));
}

/** Minutes practiced per day, for the heat-map. */
export function minutesByDay(sessions: Session[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of completedSessions(sessions)) {
    const key = dayKey(new Date(s.startedAt));
    map.set(key, (map.get(key) ?? 0) + s.durationSec / 60);
  }
  return map;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/**
 * Current streak of consecutive practice days ending today or yesterday.
 * `freezes` forgives up to that many single missed days inside the run.
 */
export function currentStreak(sessions: Session[], freezes: number): number {
  const days = practiceDays(sessions);
  if (days.size === 0) return 0;

  const today = new Date();
  let cursor: Date;
  if (days.has(dayKey(today))) cursor = today;
  else if (days.has(dayKey(addDays(today, -1)))) cursor = addDays(today, -1);
  else if (freezes > 0 && days.has(dayKey(addDays(today, -2)))) {
    // Yesterday missed but coverable by a freeze.
    cursor = addDays(today, -2);
    freezes -= 1;
  } else return 0;

  let streak = 1;
  let remaining = freezes;
  let prev = cursor;
  for (;;) {
    const back1 = addDays(prev, -1);
    if (days.has(dayKey(back1))) {
      streak += 1;
      prev = back1;
      continue;
    }
    const back2 = addDays(prev, -2);
    if (remaining > 0 && days.has(dayKey(back2))) {
      remaining -= 1;
      streak += 1;
      prev = back2;
      continue;
    }
    return streak;
  }
}

/** Longest run of consecutive practice days ever (no freezes applied). */
export function longestStreak(sessions: Session[]): number {
  const days = [...practiceDays(sessions)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of days) {
    const d = new Date(key + 'T12:00:00');
    if (prev && dayKey(addDays(prev, 1)) === key) run += 1;
    else run = 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function techniquesTried(sessions: Session[]): number {
  return new Set(completedSessions(sessions).map((s) => s.techniqueId)).size;
}

export function averageMoodShift(sessions: Session[]): number | null {
  const rated = completedSessions(sessions).filter(
    (s) => s.moodBefore !== undefined && s.moodAfter !== undefined,
  );
  if (rated.length === 0) return null;
  const shift = rated.reduce((sum, s) => sum + (s.moodAfter! - s.moodBefore!), 0);
  return shift / rated.length;
}
