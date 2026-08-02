import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDuration } from '../components/shared';

const DURATIONS = [60, 180, 300, 600];

export default function Settings() {
  const { soundOn, defaultDurationSec } = useStore((s) => s.settings);
  const setSoundOn = useStore((s) => s.setSoundOn);
  const setDefaultDuration = useStore((s) => s.setDefaultDuration);
  const resetAll = useStore((s) => s.resetAll);
  const sessions = useStore((s) => s.sessions);
  const [confirmReset, setConfirmReset] = useState(false);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ sessions }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stillpoint-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
      </header>

      <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-200 font-medium">Phase chime</div>
            <div className="text-sm text-slate-500">A soft tone at each phase change</div>
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className={`w-14 h-8 rounded-full transition relative ${soundOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${soundOn ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>

        <div>
          <div className="text-slate-200 font-medium mb-2">Default session length</div>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDefaultDuration(d)}
                className={`px-4 py-2 rounded-xl border text-sm transition ${
                  defaultDurationSec === d
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {formatDuration(d)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-200 font-medium">Export your data</div>
            <div className="text-sm text-slate-500">Download all sessions as JSON</div>
          </div>
          <button onClick={exportData} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-700/50 transition text-sm">
            Export
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-200 font-medium">Start over</div>
            <div className="text-sm text-slate-500">Erase all progress. This cannot be undone.</div>
          </div>
          {confirmReset ? (
            <div className="flex gap-2">
              <button
                onClick={() => { resetAll(); setConfirmReset(false); }}
                className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400 text-red-300 text-sm"
              >
                Really erase
              </button>
              <button onClick={() => setConfirmReset(false)} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-sm">
                Keep it
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-red-300 hover:border-red-400/50 transition text-sm">
              Reset
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
