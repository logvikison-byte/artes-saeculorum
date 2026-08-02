import type { Mood, Rating } from '../types';

export const MOODS: { key: Mood; emoji: string; label: string; rating: Rating }[] = [
  { key: 'anxious', emoji: '😰', label: 'Anxious', rating: 2 },
  { key: 'restless', emoji: '🤹', label: 'Restless', rating: 2 },
  { key: 'tired', emoji: '😴', label: 'Tired', rating: 2 },
  { key: 'scattered', emoji: '🌀', label: 'Scattered', rating: 3 },
  { key: 'okay', emoji: '🙂', label: 'Okay', rating: 4 },
];

export const FEELING_SCALE: { rating: Rating; emoji: string; label: string }[] = [
  { rating: 1, emoji: '😖', label: 'Rough' },
  { rating: 2, emoji: '😕', label: 'Meh' },
  { rating: 3, emoji: '😐', label: 'Neutral' },
  { rating: 4, emoji: '😌', label: 'Calm' },
  { rating: 5, emoji: '🤩', label: 'Great' },
];

export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  return `${min} min`;
}

export function StatCard({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 px-4 py-3 text-center">
      <div className="text-2xl font-bold" style={{ color: accent ?? '#e2e8f0' }}>{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
