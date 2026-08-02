import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;

function Foot({ x, y, mirrored, opacity }: { x: number; y: number; mirrored: boolean; opacity: number }) {
  return (
    <g
      style={{ transition: 'opacity 0.4s ease' }}
      opacity={opacity}
      transform={`translate(${x} ${y})${mirrored ? ' scale(-1,1)' : ''}`}
    >
      <ellipse cx={0} cy={0} rx={11} ry={20} fill="#4ade80" />
      <ellipse cx={-1} cy={-26} rx={4.5} ry={6} fill="#4ade80" />
      <ellipse cx={7} cy={-24} rx={3.5} ry={5} fill="#4ade80" />
      <ellipse cx={-9} cy={-23} rx={3} ry={4.5} fill="#4ade80" />
    </g>
  );
}

/**
 * Walking meditation: footprints appear alternately left and right, walking up
 * the screen, with a lift–move–place rhythm bar pacing each step.
 */
export default function WalkingGuide({ engine }: { engine: EngineState }) {
  const c = SIZE / 2;
  const isLeft = engine.phase.animation === 'left';
  const t = engine.phaseProgress;
  const stepInPair = isLeft ? 0 : 1;
  const totalStep = engine.cycleCount * 2 + stepInPair;

  // Show a trail of the last few steps walking upward, wrapping around.
  const TRAIL = 4;
  const feet = Array.from({ length: TRAIL }, (_, i) => {
    const stepNum = totalStep - (TRAIL - 1 - i);
    if (stepNum < 0) return null;
    const left = stepNum % 2 === 0;
    const y = 210 - (stepNum % 5) * 42;
    const isCurrent = stepNum === totalStep;
    return {
      x: left ? c - 28 : c + 28,
      y,
      mirrored: left,
      opacity: isCurrent ? Math.min(1, t * 3) : 0.25 + 0.15 * i,
      key: stepNum,
    };
  }).filter(Boolean) as { x: number; y: number; mirrored: boolean; opacity: number; key: number }[];

  // Lift–move–place sub-rhythm within the step.
  const subPhase = t < 0.33 ? 'lift' : t < 0.66 ? 'move' : 'place';

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <line x1={c} y1={20} x2={c} y2={225} stroke="rgba(74,222,128,0.15)" strokeWidth={2} strokeDasharray="2 8" />
      {feet.map((f) => (
        <Foot key={f.key} x={f.x} y={f.y} mirrored={f.mirrored} opacity={f.opacity} />
      ))}
      {/* rhythm bar */}
      <rect x={40} y={232} width={160} height={5} rx={2.5} fill="rgba(148,163,184,0.15)" />
      <rect x={40} y={232} width={160 * t} height={5} rx={2.5} fill="#4ade80" />
      <text x={c} y={224} textAnchor="middle" fill="#bbf7d0" fontSize={14} fontWeight={600}>
        {engine.phase.label} — {subPhase}
      </text>
    </svg>
  );
}
