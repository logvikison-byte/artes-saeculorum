import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rating, Session } from '../types';

interface Settings {
  soundOn: boolean;
  defaultDurationSec: number;
}

interface StoreState {
  sessions: Session[];
  streakFreezesAvailable: number;
  settings: Settings;
  addSession: (s: Session) => void;
  finishSession: (
    id: string,
    result: { moodAfter?: Rating; focusRating?: Rating; actualDurationSec?: number },
  ) => void;
  earnFreeze: () => void;
  spendFreeze: () => void;
  setSoundOn: (on: boolean) => void;
  setDefaultDuration: (sec: number) => void;
  resetAll: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      sessions: [],
      streakFreezesAvailable: 1,
      settings: { soundOn: true, defaultDurationSec: 180 },

      addSession: (s) => set((state) => ({ sessions: [...state.sessions, s] })),

      finishSession: (id, { moodAfter, focusRating, actualDurationSec }) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  completed: true,
                  moodAfter,
                  focusRating,
                  durationSec: actualDurationSec ?? s.durationSec,
                }
              : s,
          ),
        })),

      earnFreeze: () =>
        set((state) => ({
          streakFreezesAvailable: Math.min(3, state.streakFreezesAvailable + 1),
        })),

      spendFreeze: () =>
        set((state) => ({
          streakFreezesAvailable: Math.max(0, state.streakFreezesAvailable - 1),
        })),

      setSoundOn: (on) =>
        set((state) => ({ settings: { ...state.settings, soundOn: on } })),

      setDefaultDuration: (sec) =>
        set((state) => ({ settings: { ...state.settings, defaultDurationSec: sec } })),

      resetAll: () =>
        set({
          sessions: [],
          streakFreezesAvailable: 1,
          settings: { soundOn: true, defaultDurationSec: 180 },
        }),
    }),
    { name: 'stillpoint-v1' },
  ),
);
