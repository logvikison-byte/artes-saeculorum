import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;
const PAD = 30;
const SIDE = SIZE - PAD * 2;

/** Corner coordinates: top-left → top-right → bottom-right → bottom-left. */
const CORNERS = [
  [PAD, PAD],
  [PAD + SIDE, PAD],
  [PAD + SIDE, PAD + SIDE],
  [PAD, PAD + SIDE],
] as const;

/**
 * A dot traces one edge of the square per phase:
 * inhale = top edge, hold = right, exhale = bottom, hold = left.
 */
export default function BoxBreathingGuide({ engine }: { engine: EngineState }) {
  const edge = engine.phaseIndex % 4;
  const [x1, y1] = CORNERS[edge];
  const [x2, y2] = CORNERS[(edge + 1) % 4];
  const t = engine.phaseProgress;
  const dotX = x1 + (x2 - x1) * t;
  const dotY = y1 + (y2 - y1) * t;

  const secondsLeft = Math.ceil(engine.phase.durationSec * (1 - t));
  const breathing = edge === 0 ? 1 + 0.06 * t : edge === 2 ? 1.06 - 0.06 * t : edge === 1 ? 1.06 : 1;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <g style={{ transform: `scale(${breathing})`, transformOrigin: 'center' }}>
        <rect
          x={PAD} y={PAD} width={SIDE} height={SIDE} rx={18}
          fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.35)" strokeWidth={2}
        />
        {/* Traveled part of the current edge glows brighter */}
        <line
          x1={x1} y1={y1} x2={dotX} y2={dotY}
          stroke="#38bdf8" strokeWidth={4} strokeLinecap="round"
        />
        <circle cx={dotX} cy={dotY} r={10} fill="#38bdf8">
          <animate attributeName="opacity" values="1;0.7;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={dotX} cy={dotY} r={16} fill="none" stroke="#38bdf8" strokeOpacity={0.35} strokeWidth={2} />
      </g>
      <text x={SIZE / 2} y={SIZE / 2 - 8} textAnchor="middle" fill="#e0f2fe" fontSize={26} fontWeight={600}>
        {engine.phase.label}
      </text>
      <text x={SIZE / 2} y={SIZE / 2 + 24} textAnchor="middle" fill="#7dd3fc" fontSize={20}>
        {secondsLeft}
      </text>
    </svg>
  );
}
