import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/farmer', label: 'Home', icon: '🏠', end: true },
  { to: '/farmer/farms', label: 'Farms', icon: '🌾' },
  { to: '/farmer/history', label: 'History', icon: '🕐' },
  { to: '/farmer/profile', label: 'Profile', icon: '👤' },
];

export default function FarmerBottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 max-w-md mx-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs px-3 py-1 ${isActive ? 'text-farmer font-semibold' : 'text-gray-400'}`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
