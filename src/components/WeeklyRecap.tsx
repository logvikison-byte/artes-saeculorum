import { useStore } from '../store/useStore';
import { weeklyRecap } from '../lib/recap';
import { getTechnique } from '../data/techniques';

/** "Your calmest day was Tuesday" — a short weekly story of the user's practice. */
export default function WeeklyRecap() {
  const sessions = useStore((s) => s.sessions);
  const recap = weeklyRecap(sessions);
  if (!recap) return null;

  const top = recap.topTechniqueId ? getTechnique(recap.topTechniqueId) : null;
  const delta = recap.minutesDelta;

  return (
    <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5">
      <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">This week</div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-2xl font-bold text-emerald-300">{recap.minutes}</div>
          <div className="text-xs text-slate-400">minutes</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-sky-300">{recap.sessions}</div>
          <div className="text-xs text-slate-400">sessions</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-300">{recap.daysPracticed}/7</div>
          <div className="text-xs text-slate-400">days</div>
        </div>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-300">
        {delta !== 0 && (
          <li>
            {delta > 0 ? '📈' : '🌱'} That’s{' '}
            <span className={delta > 0 ? 'text-emerald-300' : 'text-slate-300'}>
              {Math.abs(delta)} minute{Math.abs(delta) === 1 ? '' : 's'} {delta > 0 ? 'more' : 'less'}
            </span>{' '}
            than the week before.
          </li>
        )}
        {recap.calmestDay && (
          <li>🕊️ Your calmest day was <span className="text-slate-100 font-medium">{recap.calmestDay}</span>.</li>
        )}
        {top && (
          <li>
            💫 You leaned on <span style={{ color: top.color }}>{top.name}</span> most this week.
          </li>
        )}
      </ul>
    </section>
  );
}
