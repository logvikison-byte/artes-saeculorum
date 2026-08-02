import type { EngineState } from '../../hooks/usePhaseEngine';

/** Region key → the silhouette parts that glow during that phase. */
const REGION_ORDER = ['feet', 'legs', 'belly', 'chest', 'arms', 'shoulders', 'head', 'whole'];

interface PartProps {
  active: boolean;
  passed: boolean;
}

function partStyle({ active, passed }: PartProps) {
  return {
    fill: active ? '#fb923c' : passed ? 'rgba(251,146,60,0.45)' : 'rgba(148,163,184,0.18)',
    transition: 'fill 0.8s ease',
    filter: active ? 'drop-shadow(0 0 8px rgba(251,146,60,0.8))' : undefined,
  } as const;
}

/**
 * Body scan: a simple human silhouette whose regions light up one at a time,
 * bottom to top, as attention moves through the body.
 */
export default function BodyScanGuide({ engine }: { engine: EngineState }) {
  const region = engine.phase.animation;
  const idx = REGION_ORDER.indexOf(region);
  const whole = region === 'whole';

  const p = (key: string): PartProps => {
    const i = REGION_ORDER.indexOf(key);
    return { active: whole || region === key, passed: !whole && i < idx };
  };

  return (
    <svg viewBox="0 0 200 300" className="w-52 h-72 md:w-60 md:h-[21rem]">
      {/* head */}
      <circle cx={100} cy={38} r={22} style={partStyle(p('head'))} />
      {/* neck + shoulders */}
      <path d="M92 60 h16 v12 h-16 z" style={partStyle(p('shoulders'))} />
      <path d="M60 74 q40 -14 80 0 l-6 18 q-34 -10 -68 0 z" style={partStyle(p('shoulders'))} />
      {/* chest */}
      <path d="M68 92 q32 -8 64 0 l-4 34 q-28 -6 -56 0 z" style={partStyle(p('chest'))} />
      {/* belly */}
      <path d="M72 128 q28 -6 56 0 l-3 36 q-25 -5 -50 0 z" style={partStyle(p('belly'))} />
      {/* arms */}
      <path d="M58 78 q-12 34 -8 66 l12 2 q-2 -32 8 -60 z" style={partStyle(p('arms'))} />
      <path d="M142 78 q12 34 8 66 l-12 2 q2 -32 -8 -60 z" style={partStyle(p('arms'))} />
      <circle cx={54} cy={152} r={7} style={partStyle(p('arms'))} />
      <circle cx={146} cy={152} r={7} style={partStyle(p('arms'))} />
      {/* legs */}
      <path d="M76 166 q10 2 22 2 l-2 74 h-16 z" style={partStyle(p('legs'))} />
      <path d="M124 166 q-10 2 -22 2 l2 74 h16 z" style={partStyle(p('legs'))} />
      {/* feet */}
      <path d="M78 244 h18 v14 q-2 6 -12 6 h-14 q-4 -2 -2 -8 z" style={partStyle(p('feet'))} />
      <path d="M104 244 h18 l10 12 q2 6 -2 8 h-14 q-10 0 -12 -6 z" style={partStyle(p('feet'))} />
      <text x={100} y={290} textAnchor="middle" fill="#fed7aa" fontSize={15} fontWeight={600}>
        {engine.phase.label}
      </text>
    </svg>
  );
}
