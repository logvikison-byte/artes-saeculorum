interface Series {
  label: string;
  color: string;
  values: (number | null)[];
}

const W = 320;
const H = 120;
const PAD = { top: 10, right: 10, bottom: 8, left: 22 };

/**
 * Small multi-series line chart on a 1–5 scale (mood / focus ratings).
 * Null values (unrated sessions) leave gaps in the line.
 */
export default function TrendChart({ series }: { series: Series[] }) {
  const n = Math.max(...series.map((s) => s.values.length));
  if (n < 2) return null;

  const x = (i: number) => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + ((5 - v) / 4) * (H - PAD.top - PAD.bottom);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[1, 3, 5].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="rgba(148,163,184,0.12)" />
            <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>{v}</text>
          </g>
        ))}
        {series.map((s) => {
          let d = '';
          let drawing = false;
          s.values.forEach((v, i) => {
            if (v === null) { drawing = false; return; }
            d += `${drawing ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
            drawing = true;
          });
          return (
            <g key={s.label}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {s.values.map((v, i) =>
                v === null ? null : <circle key={i} cx={x(i)} cy={y(v)} r={2.5} fill={s.color} />,
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex gap-4 justify-center mt-1">
        {series.map((s) => (
          <span key={s.label} className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
