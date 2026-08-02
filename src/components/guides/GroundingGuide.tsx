import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;

const SENSES: Record<string, { emoji: string; count: number; color: string }> = {
  see: { emoji: '👁️', count: 5, color: '#f472b6' },
  hear: { emoji: '👂', count: 4, color: '#e879f9' },
  feel: { emoji: '✋', count: 3, color: '#c084fc' },
  smell: { emoji: '👃', count: 2, color: '#a78bfa' },
  taste: { emoji: '👅', count: 1, color: '#818cf8' },
};

/**
 * 5·4·3·2·1 grounding: a sense card flips in per phase, and dots light up one
 * by one to pace the user through noticing that many things.
 */
export default function GroundingGuide({ engine }: { engine: EngineState }) {
  const c = SIZE / 2;
  const sense = SENSES[engine.phase.animation] ?? SENSES.see;
  const t = engine.phaseProgress;
  const flipIn = Math.min(1, t * 4);
  const litDots = Math.min(sense.count, Math.floor(t * sense.count) + 1);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <g style={{ transform: `scale(${0.7 + 0.3 * flipIn})`, transformOrigin: 'center', opacity: flipIn }}>
        <rect
          x={50} y={44} width={140} height={130} rx={20}
          fill={`${sense.color}14`} stroke={`${sense.color}66`} strokeWidth={2}
        />
        <text x={c} y={104} textAnchor="middle" fontSize={44}>{sense.emoji}</text>
        <text x={c} y={148} textAnchor="middle" fill={sense.color} fontSize={30} fontWeight={700}>
          {sense.count}
        </text>
      </g>
      <g>
        {Array.from({ length: sense.count }, (_, i) => {
          const spread = (sense.count - 1) * 24;
          const x = c - spread / 2 + i * 24;
          return (
            <circle
              key={i} cx={x} cy={200} r={7}
              fill={i < litDots ? sense.color : 'rgba(148,163,184,0.2)'}
              style={{ transition: 'fill 0.5s ease' }}
            />
          );
        })}
      </g>
      <text x={c} y={230} textAnchor="middle" fill="#fbcfe8" fontSize={16} fontWeight={600}>
        {engine.phase.label} {sense.count} thing{sense.count > 1 ? 's' : ''}
      </text>
    </svg>
  );
}
