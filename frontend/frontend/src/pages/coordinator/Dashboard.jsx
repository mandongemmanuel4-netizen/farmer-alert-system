import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/coordinator/dashboard').then((res) => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-official-light/20 pb-24">
      <div className="bg-official text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <p className="text-sm text-white/80">Good Morning,</p>
        <h1 className="text-xl font-bold">CSO {user?.fullName || ''}</h1>
      </div>

      <div className="px-6 -mt-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-official">{data?.activeFarmers ?? '...'}</p>
            <p className="text-xs text-gray-400">Active Farmers</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-alert-panic">{data?.activeAlerts ?? '...'}</p>
            <p className="text-xs text-gray-400">Active Alerts</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-farmer">{data?.resolvedToday ?? '...'}</p>
            <p className="text-xs text-gray-400">Resolved Today</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-official">{data?.securityPosts ?? '...'}</p>
            <p className="text-xs text-gray-400">Security Posts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800">Recent Alerts</p>
            <Link to="/coordinator/alerts" className="text-official text-sm">View All</Link>
          </div>
          {!data?.recentAlerts?.length ? (
            <p className="text-gray-400 text-sm">No alerts yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentAlerts.map((a) => (
                <Link key={a._id} to={`/coordinator/alerts/${a._id}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{a.farmer?.fullName || 'Unknown farmer'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${a.type === 'panic' ? 'bg-red-100 text-alert-panic' : 'bg-orange-100 text-orange-600'}`}>
                    {a.type === 'panic' ? 'Panic Alert' : 'Overdue'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <CsoBottomNav />
    </div>
  );
}
