import type { Session } from '../types';
import { completedSessions, dayKey } from './stats';

export interface WeeklyRecap {
  sessions: number;
  minutes: number;
  /** Change in minutes vs. the previous 7 days. */
  minutesDelta: number;
  /** Weekday name with the best average post-session mood, if rated. */
  calmestDay: string | null;
  /** Technique id practiced most this week. */
  topTechniqueId: string | null;
  daysPracticed: number;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function inRange(s: Session, from: Date, to: Date): boolean {
  const t = new Date(s.startedAt).getTime();
  return t >= from.getTime() && t < to.getTime();
}

function minutesOf(sessions: Session[]): number {
  return Math.round(sessions.reduce((sum, s) => sum + s.durationSec, 0) / 60);
}

/** Rolling 7-day recap, compared against the 7 days before it. */
export function weeklyRecap(sessions: Session[], now: Date = new Date()): WeeklyRecap | null {
  const done = completedSessions(sessions);
  if (done.length === 0) return null;

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const weekStart = new Date(endOfToday);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const prevStart = new Date(weekStart);
  prevStart.setDate(prevStart.getDate() - 7);

  const thisWeek = done.filter((s) => inRange(s, weekStart, endOfToday));
  const lastWeek = done.filter((s) => inRange(s, prevStart, weekStart));
  if (thisWeek.length === 0) return null;

  // Calmest day: highest average post-session mood among rated sessions.
  const moodByWeekday = new Map<number, number[]>();
  for (const s of thisWeek) {
    if (s.moodAfter === undefined) continue;
    const wd = new Date(s.startedAt).getDay();
    moodByWeekday.set(wd, [...(moodByWeekday.get(wd) ?? []), s.moodAfter]);
  }
  let calmestDay: string | null = null;
  let bestMood = -Infinity;
  for (const [wd, moods] of moodByWeekday) {
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    if (avg > bestMood) {
      bestMood = avg;
      calmestDay = WEEKDAYS[wd];
    }
  }

  const useCounts = new Map<string, number>();
  for (const s of thisWeek) useCounts.set(s.techniqueId, (useCounts.get(s.techniqueId) ?? 0) + 1);
  const topTechniqueId =
    [...useCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    sessions: thisWeek.length,
    minutes: minutesOf(thisWeek),
    minutesDelta: minutesOf(thisWeek) - minutesOf(lastWeek),
    calmestDay,
    topTechniqueId,
    daysPracticed: new Set(thisWeek.map((s) => dayKey(new Date(s.startedAt)))).size,
  };
}
