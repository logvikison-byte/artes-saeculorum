import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;

/** Which ripple rings are lit per phase — the circle of care widens outward. */
const RINGS: Record<string, number> = { self: 1, loved: 2, stranger: 3, all: 4 };
const RING_LABELS = ['you', 'a loved one', 'a stranger', 'everyone'];

/**
 * Loving-kindness: a glowing heart at the center, with concentric ripples
 * expanding outward as the circle of care widens phase by phase.
 */
export default function LovingKindnessGuide({ engine }: { engine: EngineState }) {
  const c = SIZE / 2;
  const lit = RINGS[engine.phase.animation] ?? 1;
  const t = engine.phaseProgress;
  const pulse = 1 + 0.05 * Math.sin(t * Math.PI * 6);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      {[4, 3, 2, 1].map((ring) => {
        const r = 24 + ring * 22;
        const active = ring <= lit;
        const isNewest = ring === lit;
        return (
          <circle
            key={ring} cx={c} cy={c} r={isNewest ? r * (0.85 + 0.15 * Math.min(1, t * 3)) : r}
            fill={active ? `rgba(251,113,133,${0.1 + 0.05 * (5 - ring)})` : 'none'}
            stroke={active ? 'rgba(251,113,133,0.5)' : 'rgba(148,163,184,0.15)'}
            strokeWidth={active ? 2 : 1}
            style={{ transition: 'stroke 0.6s ease, fill 0.6s ease' }}
          />
        );
      })}
      <text
        x={c} y={c + 10} textAnchor="middle" fontSize={30}
        style={{ transform: `scale(${pulse})`, transformOrigin: 'center' }}
      >
        💗
      </text>
      <text x={c} y={SIZE - 14} textAnchor="middle" fill="#fecdd3" fontSize={15} fontWeight={600}>
        warmth for {RING_LABELS[lit - 1]}
      </text>
    </svg>
  );
}
