import { useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SessionPlayer from './pages/SessionPlayer';
import TechniqueLibrary from './pages/TechniqueLibrary';
import ProgressPage from './pages/ProgressPage';
import Settings from './pages/Settings';
import { useStore } from './store/useStore';
import { getTheme } from './lib/themes';

/** While the app is open, fire the daily reminder notification at the chosen time. */
function useReminder() {
  const reminder = useStore((s) => s.settings.reminder);
  useEffect(() => {
    if (!reminder.enabled) return;
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayKey = `stillpoint-reminded-${now.toDateString()}`;
      if (hhmm === reminder.time && !localStorage.getItem(todayKey) && Notification.permission === 'granted') {
        localStorage.setItem(todayKey, '1');
        new Notification('Time for a moment of calm 🪷', {
          body: 'Even one minute counts. Your streak is waiting.',
        });
      }
    };
    check();
    const interval = window.setInterval(check, 30_000);
    return () => window.clearInterval(interval);
  }, [reminder.enabled, reminder.time]);
}

const NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/techniques', label: 'Techniques', icon: '🧘' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

function Shell() {
  const location = useLocation();
  const inSession = location.pathname.startsWith('/session');
  const themeId = useStore((s) => s.settings.theme);
  useReminder();

  return (
    <div className="min-h-screen text-slate-200" style={{ background: getTheme(themeId).background }}>
      <div className="max-w-2xl mx-auto px-4 pb-28 pt-4">
        {!inSession && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🪷</span>
            <span className="font-semibold tracking-wide text-slate-300">Stillpoint</span>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session/:techniqueId" element={<SessionPlayer />} />
          <Route path="/techniques" element={<TechniqueLibrary />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {!inSession && (
        <nav className="fixed bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="max-w-2xl mx-auto flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex-1 py-3 text-center text-xs transition ${
                    isActive ? 'text-sky-300' : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                <div className="text-lg">{item.icon}</div>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
