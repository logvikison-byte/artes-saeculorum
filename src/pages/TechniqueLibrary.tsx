import { Link } from 'react-router-dom';
import { TECHNIQUES } from '../data/techniques';
import { useStore } from '../store/useStore';
import { formatDuration } from '../components/shared';
import { isUnlocked } from '../lib/unlocks';

const FAMILY_LABEL: Record<string, string> = {
  breath: 'Breathing',
  body: 'Body awareness',
  grounding: 'Grounding',
  visual: 'Visual focus',
  compassion: 'Compassion',
  movement: 'Movement',
};

export default function TechniqueLibrary() {
  const sessions = useStore((s) => s.sessions);
  const defaultDuration = useStore((s) => s.settings.defaultDurationSec);
  const counts = new Map<string, number>();
  for (const s of sessions.filter((x) => x.completed)) {
    counts.set(s.techniqueId, (counts.get(s.techniqueId) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-bold text-slate-100">Techniques</h1>
        <p className="text-slate-400 mt-1">
          Each one is taught by a live animated guide — watch, then follow along. More unlock as you practice.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {TECHNIQUES.map((t) => {
          const timesUsed = counts.get(t.id) ?? 0;
          if (!isUnlocked(t, sessions)) {
            return (
              <div
                key={t.id}
                className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-5 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl mb-2">🔒</div>
                <h2 className="text-lg font-semibold text-slate-400">{t.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{t.tagline}</p>
                <p className="text-xs mt-3 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400">
                  {t.unlock!.hint} to unlock
                </p>
              </div>
            );
          }
          return (
            <Link
              key={t.id}
              to={`/session/${t.id}?duration=${defaultDuration}`}
              className="group rounded-3xl border border-slate-700/60 bg-slate-800/50 p-5 hover:border-slate-500 transition block"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{ color: t.color, borderColor: `${t.color}55`, background: `${t.color}11` }}
                >
                  {FAMILY_LABEL[t.family]}
                </span>
                <span className="text-xs text-slate-500">
                  {timesUsed > 0 ? `practiced ${timesUsed}×` : 'new ✦'}
                </span>
              </div>
              <h2 className="text-xl font-semibold mt-3" style={{ color: t.color }}>{t.name}</h2>
              <p className="text-sm text-slate-400 mt-1">{t.tagline}</p>
              <p className="text-sm text-slate-300/80 mt-3 leading-relaxed">{t.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {t.durations.map(formatDuration).join(' · ')}
                </span>
                <span className="text-sm text-slate-300 group-hover:translate-x-1 transition-transform">
                  Start →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
