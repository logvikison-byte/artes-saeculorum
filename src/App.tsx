import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SessionPlayer from './pages/SessionPlayer';
import TechniqueLibrary from './pages/TechniqueLibrary';
import ProgressPage from './pages/ProgressPage';
import Settings from './pages/Settings';

const NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/techniques', label: 'Techniques', icon: '🧘' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

function Shell() {
  const location = useLocation();
  const inSession = location.pathname.startsWith('/session');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200">
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
