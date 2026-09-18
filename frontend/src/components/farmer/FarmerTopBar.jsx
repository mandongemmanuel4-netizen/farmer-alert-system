import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// Desktop-only top bar (hidden below md breakpoint) — replaces the colored mobile
// hero header on wide screens, matching the reference layout: greeting on the left,
// user info + settings + theme toggle on the right, on a plain bar.
export default function FarmerTopBar({ title, subtitle }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center justify-between bg-white dark:bg-gray-900 px-8 py-4 border-b border-gray-100 dark:border-gray-800">
      <div>
        <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          onClick={() => navigate('/farmer/profile')}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="w-8 h-8 rounded-full bg-farmer-light dark:bg-farmer-dark flex items-center justify-center text-farmer-dark dark:text-white font-semibold text-sm">
            {user?.fullName?.charAt(0).toUpperCase() || '👤'}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.fullName}</span>
        </button>
        <button
          onClick={() => navigate('/farmer/change-pin')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
