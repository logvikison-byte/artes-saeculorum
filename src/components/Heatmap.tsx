import { useStore } from '../store/useStore';
import { dayKey, minutesByDay } from '../lib/stats';

const WEEKS = 16;

function cellColor(minutes: number): string {
  if (minutes <= 0) return 'rgba(148,163,184,0.12)';
  if (minutes < 3) return 'rgba(52,211,153,0.35)';
  if (minutes < 8) return 'rgba(52,211,153,0.6)';
  if (minutes < 15) return 'rgba(52,211,153,0.8)';
  return '#34d399';
}

/** Calendar heat-map of the last 16 weeks, GitHub-contribution style. */
export default function Heatmap() {
  const sessions = useStore((s) => s.sessions);
  const byDay = minutesByDay(sessions);

  const today = new Date();
  // Grid columns are weeks; each column runs Mon..Sun.
  const end = new Date(today);
  const cells: { key: string; minutes: number; future: boolean }[][] = [];
  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1) - ((start.getDay() + 6) % 7));

  for (let w = 0; w < WEEKS + 1; w++) {
    const col: { key: string; minutes: number; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = dayKey(date);
      col.push({ key, minutes: byDay.get(key) ?? 0, future: date > today });
    }
    cells.push(col);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 w-max">
        {cells.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((cell) => (
              <div
                key={cell.key}
                title={cell.future ? '' : `${cell.key}: ${Math.round(cell.minutes)} min`}
                className="w-3 h-3 rounded-[3px]"
                style={{
                  background: cell.future ? 'transparent' : cellColor(cell.minutes),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
