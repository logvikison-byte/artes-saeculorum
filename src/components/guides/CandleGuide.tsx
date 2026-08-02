import type { EngineState } from '../../hooks/usePhaseEngine';

const SIZE = 240;

/**
 * Candle gazing (trataka): a softly flickering flame as the fixation point.
 * During "rest" phases the flame dims and the eyes-closed prompt appears.
 */
export default function CandleGuide({ engine }: { engine: EngineState }) {
  const c = SIZE / 2;
  const resting = engine.phase.animation === 'rest';
  const glow = resting ? 0.25 : 1;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-64 h-64 md:w-80 md:h-80">
      <defs>
        <radialGradient id="flameGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(251,191,36,0.5)" />
          <stop offset="100%" stopColor="rgba(251,191,36,0)" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={92} r={70} fill="url(#flameGlow)" opacity={glow} style={{ transition: 'opacity 1.2s ease' }}>
        <animate attributeName="r" values="70;76;68;74;70" dur="3.1s" repeatCount="indefinite" />
      </circle>
      {/* flame */}
      <g opacity={glow} style={{ transition: 'opacity 1.2s ease' }}>
        <path fill="#fbbf24" d="M120 52 C132 74 140 86 140 102 C140 120 131 130 120 130 C109 130 100 120 100 102 C100 86 108 74 120 52 Z">
          <animate
            attributeName="d"
            values="M120 52 C132 74 140 86 140 102 C140 120 131 130 120 130 C109 130 100 120 100 102 C100 86 108 74 120 52 Z;
                    M120 50 C130 72 142 88 141 104 C140 121 131 130 120 130 C109 130 99 120 100 101 C101 85 110 72 120 50 Z;
                    M120 54 C133 76 139 87 140 103 C141 120 131 130 120 130 C109 130 100 121 99 102 C98 86 107 76 120 54 Z;
                    M120 52 C132 74 140 86 140 102 C140 120 131 130 120 130 C109 130 100 120 100 102 C100 86 108 74 120 52 Z"
            dur="2.4s" repeatCount="indefinite"
          />
        </path>
        <path fill="#fef3c7" d="M120 84 C126 96 130 102 130 110 C130 121 125 127 120 127 C115 127 110 121 110 110 C110 102 114 96 120 84 Z">
          <animate
            attributeName="d"
            values="M120 84 C126 96 130 102 130 110 C130 121 125 127 120 127 C115 127 110 121 110 110 C110 102 114 96 120 84 Z;
                    M120 82 C125 95 131 103 130 111 C129 122 125 127 120 127 C115 127 110 121 111 109 C112 101 115 94 120 82 Z;
                    M120 84 C126 96 130 102 130 110 C130 121 125 127 120 127 C115 127 110 121 110 110 C110 102 114 96 120 84 Z"
            dur="1.7s" repeatCount="indefinite"
          />
        </path>
      </g>
      {/* wick + candle */}
      <rect x={118} y={128} width={4} height={10} rx={2} fill="#78350f" />
      <rect x={96} y={138} width={48} height={62} rx={8} fill="#e7e5e4" opacity={0.85} />
      <rect x={96} y={138} width={48} height={8} rx={4} fill="#f5f5f4" />
      <text x={c} y={224} textAnchor="middle" fill="#fde68a" fontSize={15} fontWeight={600}>
        {resting ? 'close your eyes — see the afterglow' : 'rest your gaze on the flame'}
      </text>
    </svg>
  );
}
