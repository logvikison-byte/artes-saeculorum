import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { currentStreak, totalMinutes, practiceDays, dayKey } from '../lib/stats';
import { suggestWithReason, dailySuggestion } from '../lib/suggest';
import { MOODS, StatCard, formatDuration } from '../components/shared';
import type { Mood } from '../types';

const DURATIONS = [60, 180, 300, 600];

export default function Dashboard() {
  const navigate = useNavigate();
  const sessions = useStore((s) => s.sessions);
  const freezes = useStore((s) => s.streakFreezesAvailable);
  const [mood, setMood] = useState<Mood | null>(null);
  const [duration, setDuration] = useState(180);

  const streak = currentStreak(sessions, freezes);
  const minutes = totalMinutes(sessions);
  const daily = dailySuggestion(sessions);
  const practicedToday = practiceDays(sessions).has(dayKey(new Date()));
  const lapsed = !practicedToday && sessions.length > 0 && streak === 0 && minutes > 0;

  const startSuggested = () => {
    const { technique, reason } = suggestWithReason(sessions, mood, duration);
    const params = new URLSearchParams({ duration: String(duration), reason });
    if (mood) params.set('mood', mood);
    navigate(`/session/${technique.id}?${params}`);
  };

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-bold text-slate-100">
          {practicedToday ? 'Beautiful. You showed up today. ✨' : 'Ready for a moment of calm?'}
        </h1>
        {lapsed && (
          <p className="text-slate-400 mt-2">
            Welcome back — your {minutes} lifetime minutes are right where you left them.
            A 1-minute reset is all it takes to restart.
          </p>
        )}
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={`${streak}🔥`} label="day streak" accent="#fb923c" />
        <StatCard value={String(minutes)} label="lifetime minutes" accent="#34d399" />
        <StatCard value={`${freezes}❄️`} label="streak freezes" accent="#38bdf8" />
      </div>

      <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">How are you feeling?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(mood === m.key ? null : m.key)}
              className={`px-3 py-2 rounded-xl border text-sm transition ${
                mood === m.key
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-slate-200">How much time do you have?</h2>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-4 py-2 rounded-xl border text-sm transition ${
                duration === d
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {formatDuration(d)}
            </button>
          ))}
        </div>

        <button
          onClick={startSuggested}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-bold text-lg hover:opacity-90 transition"
        >
          🎲 Surprise me — start now
        </button>
        <p className="text-xs text-slate-500 text-center">
          No decisions needed. We’ll pick something fresh for you.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-700/60 p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/40">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Today’s suggestion</div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold" style={{ color: daily.color }}>{daily.name}</div>
            <div className="text-sm text-slate-400">{daily.tagline}</div>
          </div>
          <Link
            to={`/session/${daily.id}?duration=${duration}`}
            className="shrink-0 px-4 py-2 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-700/50 transition text-sm"
          >
            Try it →
          </Link>
        </div>
      </section>

      <div className="text-center">
        <Link to="/techniques" className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4">
          or browse all techniques
        </Link>
      </div>
    </div>
  );
}
