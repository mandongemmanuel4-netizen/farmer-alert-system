import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-official-light/10 pb-24">
      <div className="bg-official text-white px-6 pt-8 pb-10 rounded-b-3xl text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
          {user?.fullName?.charAt(0).toUpperCase() || '👤'}
        </div>
        <h1 className="text-xl font-bold">{user?.fullName}</h1>
        <p className="text-white/80 text-sm">Community Safety Officer</p>
      </div>

      <div className="px-6 -mt-4 space-y-3">
        <div className="bg-white rounded-xl shadow-sm p-4 text-sm space-y-2">
          <div className="flex justify-between"><span className="text-gray-400">Phone</span><span>{user?.phone}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Role</span><span>Community Safety Officer</span></div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-lg mt-6"
        >
          Logout
        </button>
      </div>

      <CsoBottomNav />
    </div>
  );
}
