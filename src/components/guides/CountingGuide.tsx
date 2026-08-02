import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;

/**
 * Counting breaths: a big numeral fades in on each exhale, counting 1–10,
 * then the count starts over with a gentle ripple.
 */
export default function CountingGuide({ engine }: { engine: EngineState }) {
  const c = SIZE / 2;
  const t = engine.phaseProgress;
  const isExhale = engine.phase.animation === 'count';
  const count = (engine.cycleCount % 10) + 1;
  const restarting = count === 1 && engine.cycleCount > 0;

  const numberOpacity = isExhale ? Math.min(1, t * 3) : Math.max(0, 1 - t * 3);
  const breathR = isExhale ? 88 - 26 * t : 62 + 26 * t;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <circle cx={c} cy={c} r={breathR} fill="rgba(52,211,153,0.12)" stroke="rgba(52,211,153,0.35)" strokeWidth={2} />
      {restarting && isExhale && t < 0.5 && (
        <circle cx={c} cy={c} r={breathR + 40 * t} fill="none" stroke="#34d399" strokeOpacity={0.5 - t} strokeWidth={2} />
      )}
      <text
        x={c} y={c + 22} textAnchor="middle" fill="#a7f3d0"
        fontSize={64} fontWeight={700} opacity={numberOpacity}
      >
        {count}
      </text>
      <text x={c} y={c + 58} textAnchor="middle" fill="#6ee7b7" fontSize={15}>
        {isExhale ? (restarting ? 'back to one — that’s the practice' : 'exhale and count') : 'breathe in'}
      </text>
    </svg>
  );
}
