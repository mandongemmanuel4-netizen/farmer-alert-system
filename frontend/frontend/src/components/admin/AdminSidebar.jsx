import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/farmers', label: 'Farmers', icon: '🌾' },
  { to: '/admin/csos', label: 'CSOs', icon: '👮' },
  { to: '/admin/states', label: 'States', icon: '🗺️' },
  { to: '/admin/lgas', label: 'LGAs', icon: '📍' },
  { to: '/admin/wards', label: 'Wards', icon: '🏘️' },
  { to: '/admin/security-posts', label: 'Security Posts', icon: '🛡️' },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: '📊' },
  { to: '/admin/logs', label: 'Activity Logs', icon: '📜' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-official-dark text-white flex flex-col fixed left-0 top-0">
      <div className="p-5 border-b border-white/10">
        <p className="font-bold text-lg">FSDAMS</p>
        <p className="text-xs text-white/50">Admin Portal</p>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm ${isActive ? 'bg-white/10 text-white font-semibold border-l-4 border-official-light' : 'text-white/70'}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/50 mb-1">{user?.fullName}</p>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="text-xs text-red-300 hover:text-red-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
