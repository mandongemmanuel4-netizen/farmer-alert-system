import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24 md:ml-64">
      <FarmerSidebar />
      <div className="bg-farmer text-white px-6 pt-8 pb-10 rounded-b-3xl text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
          {user?.fullName?.charAt(0).toUpperCase() || '👤'}
        </div>
        <h1 className="text-xl font-bold">{user?.fullName || 'Farmer'}</h1>
        <p className="text-white/80 text-sm">{user?.phone}</p>
      </div>

      <div className="px-6 -mt-4 space-y-3 md:max-w-md md:mx-auto">
        <button
          onClick={() => navigate('/farmer/change-pin')}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-800">🔒 Change PIN</span>
          <span className="text-gray-400">&rsaquo;</span>
        </button>
        <button
          onClick={() => navigate('/farmer/farms')}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-800">🌾 My Farms</span>
          <span className="text-gray-400">&rsaquo;</span>
        </button>
        <button
          onClick={() => navigate('/farmer/contacts')}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-800">📞 Emergency Contacts</span>
          <span className="text-gray-400">&rsaquo;</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-lg mt-6"
        >
          Logout
        </button>
      </div>

      <FarmerBottomNav />
    </div>
  );
}