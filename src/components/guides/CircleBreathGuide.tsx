import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;
const R_MIN = 40;
const R_MAX = 92;

const PHASE_COLOR: Record<string, string> = {
  grow: '#a78bfa',
  hold: '#818cf8',
  shrink: '#c4b5fd',
};

/** 4·7·8 breathing: a circle that grows on inhale, glows on hold, shrinks on exhale. */
export default function CircleBreathGuide({ engine }: { engine: EngineState }) {
  const t = engine.phaseProgress;
  const anim = engine.phase.animation;

  let r = R_MIN;
  if (anim === 'grow') r = R_MIN + (R_MAX - R_MIN) * easeInOut(t);
  else if (anim === 'hold') r = R_MAX;
  else if (anim === 'shrink') r = R_MAX - (R_MAX - R_MIN) * easeInOut(t);

  const color = PHASE_COLOR[anim] ?? '#a78bfa';
  const secondsLeft = Math.ceil(engine.phase.durationSec * (1 - t));
  const c = SIZE / 2;

  // Countdown ring around the outside of the breath circle.
  const ringR = 104;
  const circumference = 2 * Math.PI * ringR;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <circle cx={c} cy={c} r={ringR} fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth={3} />
      <circle
        cx={c} cy={c} r={ringR} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - t)}
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: 'stroke-dashoffset 0.15s linear' }}
      />
      <circle cx={c} cy={c} r={r + 14} fill={color} opacity={0.12} />
      <circle cx={c} cy={c} r={r} fill={color} opacity={0.28} />
      <circle cx={c} cy={c} r={r * 0.72} fill={color} opacity={0.45} />
      <text x={c} y={c - 4} textAnchor="middle" fill="#f5f3ff" fontSize={24} fontWeight={600}>
        {engine.phase.label}
      </text>
      <text x={c} y={c + 24} textAnchor="middle" fill="#ddd6fe" fontSize={19}>
        {secondsLeft}
      </text>
    </svg>
  );
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
