import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getTechnique } from '../data/techniques';
import { usePhaseEngine } from '../hooks/usePhaseEngine';
import { GUIDES } from '../components/guides';
import { useStore } from '../store/useStore';
import { playChime } from '../lib/chime';
import { MOODS, FEELING_SCALE, formatDuration } from '../components/shared';
import { currentStreak, totalMinutes } from '../lib/stats';
import type { Rating, Technique } from '../types';

type Stage = 'preview' | 'active' | 'checkin' | 'done';

export default function SessionPlayer() {
  const { techniqueId } = useParams();
  const technique = techniqueId ? getTechnique(techniqueId) : undefined;
  if (!technique) {
    return (
      <div className="text-center py-20 text-slate-400">
        Technique not found. <Link to="/" className="underline">Back home</Link>
      </div>
    );
  }
  return <SessionFlow technique={technique} />;
}

function SessionFlow({ technique }: { technique: Technique }) {
  const [search] = useSearchParams();
  const durationSec = Number(search.get('duration')) || 180;
  const moodKey = search.get('mood');
  const moodBefore = MOODS.find((m) => m.key === moodKey)?.rating;

  const [stage, setStage] = useState<Stage>('preview');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const addSession = useStore((s) => s.addSession);

  const begin = () => {
    const id = crypto.randomUUID();
    setSessionId(id);
    addSession({
      id,
      techniqueId: technique.id,
      startedAt: new Date().toISOString(),
      durationSec,
      completed: false,
      moodBefore,
    });
    setStage('active');
  };

  if (stage === 'preview') return <Preview technique={technique} durationSec={durationSec} onBegin={begin} />;
  if (stage === 'active' && sessionId)
    return (
      <Active
        technique={technique}
        durationSec={durationSec}
        onEnd={(elapsed) => { setElapsedSec(elapsed); setStage('checkin'); }}
      />
    );
  if (stage === 'checkin' && sessionId)
    return <CheckIn sessionId={sessionId} elapsedSec={elapsedSec} onDone={() => setStage('done')} />;
  return <Celebration technique={technique} />;
}

/** Live animated demo of the guide, so users learn by watching — no reading required. */
function Preview({ technique, durationSec, onBegin }: {
  technique: Technique; durationSec: number; onBegin: () => void;
}) {
  const [engine] = usePhaseEngine(technique.phases, 3600, 'loop');
  const Guide = GUIDES[technique.id];

  return (
    <div className="flex flex-col items-center text-center space-y-5 py-4">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: technique.color }}>{technique.name}</h1>
        <p className="text-slate-400 text-sm mt-1">{technique.tagline} · {formatDuration(durationSec)}</p>
      </div>
      <div className="relative">
        <Guide engine={engine} />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">
          ↑ watch how it flows, then join in
        </div>
      </div>
      <p className="max-w-md text-slate-300 text-sm leading-relaxed">{technique.description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {technique.phases.map((p, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            {p.label}{technique.cycleMode === 'loop' ? ` · ${p.durationSec}s` : ''}
          </span>
        ))}
      </div>
      <button
        onClick={onBegin}
        className="px-10 py-4 rounded-2xl font-bold text-lg text-slate-950 hover:opacity-90 transition"
        style={{ background: technique.color }}
      >
        Begin
      </button>
      <Link to="/" className="text-xs text-slate-500 hover:text-slate-300">← choose something else</Link>
    </div>
  );
}

function Active({ technique, durationSec, onEnd }: {
  technique: Technique; durationSec: number; onEnd: (elapsedSec: number) => void;
}) {
  const soundOn = useStore((s) => s.settings.soundOn);
  const [engine, controls] = usePhaseEngine(
    technique.phases,
    durationSec,
    technique.cycleMode,
    () => { if (soundOn) playChime(); },
  );
  const Guide = GUIDES[technique.id];

  useEffect(() => {
    if (engine.done) onEnd(engine.elapsedSec);
  }, [engine.done, engine.elapsedSec, onEnd]);
  if (engine.done) return null;

  const remaining = Math.max(0, engine.totalSec - engine.elapsedSec);
  const overall = engine.elapsedSec / engine.totalSec;

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-full max-w-md h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${overall * 100}%`, background: technique.color }} />
      </div>
      <Guide engine={engine} />
      <p className="text-slate-300 text-center max-w-sm min-h-[3rem]">{engine.phase.instruction}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={controls.toggle}
          className="px-6 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
        >
          {engine.running ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button
          onClick={controls.stop}
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 transition"
        >
          End early
        </button>
      </div>
      <div className="text-slate-500 text-sm tabular-nums">
        {Math.floor(remaining / 60)}:{String(Math.ceil(remaining % 60)).padStart(2, '0')} left
      </div>
    </div>
  );
}

function CheckIn({ sessionId, elapsedSec, onDone }: {
  sessionId: string; elapsedSec: number; onDone: () => void;
}) {
  const finishSession = useStore((s) => s.finishSession);
  const [moodAfter, setMoodAfter] = useState<Rating | null>(null);
  const [focus, setFocus] = useState<Rating | null>(null);

  const save = () => {
    finishSession(sessionId, {
      moodAfter: moodAfter ?? undefined,
      focusRating: focus ?? undefined,
      actualDurationSec: Math.max(1, Math.round(elapsedSec)),
    });
    onDone();
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-10">
      <h1 className="text-2xl font-bold text-slate-100">Nice work. 🌿</h1>
      <div>
        <p className="text-slate-300 mb-3">How do you feel now?</p>
        <div className="flex gap-2 justify-center">
          {FEELING_SCALE.map((f) => (
            <button
              key={f.rating}
              onClick={() => setMoodAfter(f.rating)}
              title={f.label}
              className={`text-3xl p-2 rounded-xl transition ${
                moodAfter === f.rating ? 'bg-sky-500/25 scale-110' : 'hover:bg-slate-800'
              }`}
            >
              {f.emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-slate-300 mb-3">How was your focus?</p>
        <div className="flex gap-2 justify-center">
          {([1, 2, 3, 4, 5] as Rating[]).map((r) => (
            <button
              key={r}
              onClick={() => setFocus(r)}
              className={`w-11 h-11 rounded-xl border text-lg transition ${
                focus !== null && r <= focus
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                  : 'border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">A wandering mind is normal — noticing it *is* the skill.</p>
      </div>
      <button
        onClick={save}
        className="px-10 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-bold hover:opacity-90 transition"
      >
        Save session
      </button>
    </div>
  );
}

function Celebration({ technique }: { technique: Technique }) {
  const navigate = useNavigate();
  const sessions = useStore((s) => s.sessions);
  const freezes = useStore((s) => s.streakFreezesAvailable);
  const streak = currentStreak(sessions, freezes);
  const minutes = totalMinutes(sessions);
  const confetti = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({
      left: (i * 37 + 13) % 100,
      delay: (i % 8) * 0.15,
      emoji: ['✨', '🌿', '💫', '🍃'][i % 4],
    })),
    [],
  );

  return (
    <div className="relative flex flex-col items-center text-center space-y-6 py-14 overflow-hidden">
      {confetti.map((c, i) => (
        <span
          key={i}
          className="absolute text-xl animate-confetti"
          style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}
        >
          {c.emoji}
        </span>
      ))}
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold text-slate-100">Session complete</h1>
      <p className="text-slate-400 max-w-sm">
        You just practiced <span style={{ color: technique.color }}>{technique.name}</span>.
        Your streak is now <span className="text-orange-300 font-semibold">{streak} day{streak === 1 ? '' : 's'}</span> and
        you’ve meditated <span className="text-emerald-300 font-semibold">{minutes} minutes</span> in total.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/progress')}
          className="px-6 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
        >
          See my progress
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-bold hover:opacity-90 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
