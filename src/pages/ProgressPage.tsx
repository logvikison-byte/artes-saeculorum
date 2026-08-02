import { useStore } from '../store/useStore';
import {
  currentStreak, longestStreak, totalMinutes, techniquesTried,
  completedSessions, averageMoodShift,
} from '../lib/stats';
import { getTechnique } from '../data/techniques';
import { StatCard, FEELING_SCALE, formatDuration } from '../components/shared';
import Heatmap from '../components/Heatmap';
import TrendChart from '../components/TrendChart';
import WeeklyRecap from '../components/WeeklyRecap';

const MILESTONES = [
  { emoji: '🌱', name: 'First sit', test: (c: Ctx) => c.count >= 1 },
  { emoji: '🔥', name: '3-day streak', test: (c: Ctx) => c.longest >= 3 },
  { emoji: '⚡', name: '7-day streak', test: (c: Ctx) => c.longest >= 7 },
  { emoji: '⏳', name: '60 lifetime minutes', test: (c: Ctx) => c.minutes >= 60 },
  { emoji: '🧭', name: 'Tried 3 techniques', test: (c: Ctx) => c.tried >= 3 },
  { emoji: '🌊', name: '25 sessions', test: (c: Ctx) => c.count >= 25 },
];
type Ctx = { count: number; longest: number; minutes: number; tried: number };

export default function ProgressPage() {
  const sessions = useStore((s) => s.sessions);
  const freezes = useStore((s) => s.streakFreezesAvailable);
  const done = completedSessions(sessions);
  const ctx: Ctx = {
    count: done.length,
    longest: longestStreak(sessions),
    minutes: totalMinutes(sessions),
    tried: techniquesTried(sessions),
  };
  const shift = averageMoodShift(sessions);
  const recent = [...done].reverse().slice(0, 8);
  const trendWindow = done.slice(-20);

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-bold text-slate-100">Your progress</h1>
        <p className="text-slate-400 mt-1">Every minute counts, and none of them ever disappear.</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value={`${currentStreak(sessions, freezes)}🔥`} label="current streak" accent="#fb923c" />
        <StatCard value={String(ctx.longest)} label="longest streak" accent="#f472b6" />
        <StatCard value={String(ctx.minutes)} label="lifetime minutes" accent="#34d399" />
        <StatCard value={String(ctx.count)} label="sessions" accent="#38bdf8" />
      </div>

      <WeeklyRecap />

      <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Practice calendar</h2>
        <Heatmap />
      </section>

      {shift !== null && (
        <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
          <h2 className="text-lg font-semibold text-slate-200 mb-2">Is it working?</h2>
          <p className="text-slate-300">
            On average you feel{' '}
            <span className={shift >= 0 ? 'text-emerald-300 font-semibold' : 'text-orange-300 font-semibold'}>
              {shift >= 0 ? `+${shift.toFixed(1)}` : shift.toFixed(1)}
            </span>{' '}
            better after meditating than before. That shift is the whole point — and it compounds.
          </p>
          <div className="mt-4">
            <TrendChart
              series={[
                { label: 'mood before', color: '#64748b', values: trendWindow.map((s) => s.moodBefore ?? null) },
                { label: 'mood after', color: '#f472b6', values: trendWindow.map((s) => s.moodAfter ?? null) },
              ]}
            />
          </div>
        </section>
      )}

      {trendWindow.some((s) => s.focusRating !== undefined) && (
        <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
          <h2 className="text-lg font-semibold text-slate-200 mb-2">Focus over time</h2>
          <p className="text-sm text-slate-500 mb-3">Your last {trendWindow.length} sessions. Ups and downs are normal — the trend is what matters.</p>
          <TrendChart
            series={[
              { label: 'focus', color: '#34d399', values: trendWindow.map((s) => s.focusRating ?? null) },
            ]}
          />
        </section>
      )}

      <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Milestones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MILESTONES.map((m) => {
            const earned = m.test(ctx);
            return (
              <div
                key={m.name}
                className={`rounded-2xl border p-3 text-center ${
                  earned ? 'border-amber-400/50 bg-amber-400/10' : 'border-slate-700 opacity-45'
                }`}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className={`text-xs mt-1 ${earned ? 'text-amber-200' : 'text-slate-400'}`}>{m.name}</div>
              </div>
            );
          })}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Recent sessions</h2>
          <ul className="space-y-2">
            {recent.map((s) => {
              const t = getTechnique(s.techniqueId);
              const after = FEELING_SCALE.find((f) => f.rating === s.moodAfter);
              return (
                <li key={s.id} className="flex items-center justify-between text-sm rounded-xl bg-slate-900/40 px-4 py-2.5">
                  <span style={{ color: t?.color }}>{t?.name ?? s.techniqueId}</span>
                  <span className="text-slate-500">
                    {new Date(s.startedAt).toLocaleDateString()} · {formatDuration(s.durationSec)}
                    {after ? ` · felt ${after.emoji}` : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
