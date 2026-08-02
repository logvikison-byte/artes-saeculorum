import type { Session } from '../types';
import { unlockContext } from './unlocks';

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  /** CSS background for the app shell. */
  background: string;
  hint: string;
  unlocked: (sessions: Session[]) => boolean;
}

export const THEMES: Theme[] = [
  {
    id: 'night',
    name: 'Night',
    emoji: '🌙',
    background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)',
    hint: 'Always yours',
    unlocked: () => true,
  },
  {
    id: 'dawn',
    name: 'Dawn',
    emoji: '🌅',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #3f1d38 55%, #0f172a 100%)',
    hint: 'Complete 3 sessions',
    unlocked: (s) => unlockContext(s).sessionCount >= 3,
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    background: 'linear-gradient(180deg, #022c22 0%, #052e16 55%, #020617 100%)',
    hint: 'Reach a 3-day streak',
    unlocked: (s) => unlockContext(s).longestStreak >= 3,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    background: 'linear-gradient(180deg, #082f49 0%, #0c3a5e 55%, #020617 100%)',
    hint: 'Meditate 60 lifetime minutes',
    unlocked: (s) => unlockContext(s).totalMinutes >= 60,
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
