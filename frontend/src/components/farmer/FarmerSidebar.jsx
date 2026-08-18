import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const navItems = [
  { to: '/farmer', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/farmer/farms', label: 'My Farms', icon: '🌾' },
  { to: '/farmer/checkin', label: 'Check In / Out', icon: '📍' },
  { to: '/farmer/contacts', label: 'Emergency Contacts', icon: '📞' },
  { to: '/farmer/history', label: 'History', icon: '🕐' },
  { to: '/farmer/profile', label: 'Profile', icon: '👤' },
  { to: '/farmer/change-pin', label: 'Change PIN', icon: '🔒' },
];

// Desktop-only sidebar (hidden by default, shown from md breakpoint up).
// Purely additive: the mobile bottom nav and every page's own markup are untouched.
export default function FarmerSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:fixed md:left-0 md:top-0 bg-farmer text-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/15">
        <Logo size={36} />
        <span className="font-extrabold text-lg">FSDAMS</span>
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
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10 mt-2"
        >
          <span>🚪</span> Logout
        </button>
      </nav>

      {/* Decorative farmer illustration, matching the sample */}
      <div className="px-4 pb-4 text-6xl text-center opacity-90">🧑‍🌾</div>
    </aside>
  );
}
