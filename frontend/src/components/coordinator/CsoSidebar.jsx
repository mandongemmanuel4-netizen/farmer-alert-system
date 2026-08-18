import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const navItems = [
  { to: '/coordinator', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/coordinator/farmers', label: 'Active Farmers', icon: '👥' },
  { to: '/coordinator/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/coordinator/map', label: 'Live Map', icon: '🗺️' },
  { to: '/coordinator/reports', label: 'Reports', icon: '📊' },
  { to: '/coordinator/profile', label: 'Profile', icon: '👤' },
];

// Desktop-only sidebar for the CSO/Coordinator portal (hidden below md breakpoint).
// Mirrors FarmerSidebar/AdminSidebar so all three portals feel consistent on desktop.
export default function CsoSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:fixed md:left-0 md:top-0 bg-official text-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/15">
        <Logo size={36} />
        <div>
          <p className="font-extrabold text-lg leading-none">FSDAMS</p>
          <p className="text-xs text-white/60">CSO Portal</p>
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition ${
                isActive ? 'bg-white/15 font-semibold border-l-4 border-white' : 'text-white/80 hover:bg-white/10'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/60 mb-1">{user?.fullName}</p>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="text-xs text-red-200 hover:text-red-100"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
