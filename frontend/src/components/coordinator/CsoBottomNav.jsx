import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/coordinator', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/coordinator/farmers', label: 'Farmers', icon: '👥' },
  { to: '/coordinator/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/coordinator/map', label: 'Map', icon: '🗺️' },
  { to: '/coordinator/reports', label: 'Reports', icon: '📊' },
];

export default function CsoBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 max-w-2xl mx-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs px-2 py-1 ${isActive ? 'text-official font-semibold' : 'text-gray-400'}`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
