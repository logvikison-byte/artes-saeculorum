export type Mood = 'anxious' | 'restless' | 'tired' | 'scattered' | 'okay';

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Phase {
  label: string;
  instruction: string;
  durationSec: number;
  /** Key the guide component uses to pick its animation state. */
  animation: string;
}

export type CycleMode =
  /** Phases repeat as a cycle until the session duration is reached. */
  | 'loop'
  /** Phase durations are scaled so one pass through fills the whole session. */
  | 'fit';

export type TechniqueFamily =
  | 'breath'
  | 'body'
  | 'grounding'
  | 'visual'
  | 'compassion'
  | 'movement';

export interface UnlockContext {
  sessionCount: number;
  totalMinutes: number;
  longestStreak: number;
  techniquesTried: number;
}

export interface UnlockRule {
  /** Shown on the locked card, e.g. "Complete 3 sessions". */
  hint: string;
  test: (ctx: UnlockContext) => boolean;
}

export interface Technique {
  id: string;
  name: string;
  tagline: string;
  description: string;
  family: TechniqueFamily;
  cycleMode: CycleMode;
  phases: Phase[];
  /** Moods this technique works especially well for. */
  moodTags: Mood[];
  /** Suggested session lengths in seconds. */
  durations: number[];
  color: string;
  /** Absent = available from day one. */
  unlock?: UnlockRule;
}

export interface Session {
  id: string;
  techniqueId: string;
  startedAt: string; // ISO timestamp
  durationSec: number;
  completed: boolean;
  moodBefore?: Rating;
  moodAfter?: Rating;
  focusRating?: Rating;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  sessions: Session[];
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  techniquesTried: number;
}
