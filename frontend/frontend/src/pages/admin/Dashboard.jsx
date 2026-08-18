import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data));
  }, []);

  const cards = [
    { label: 'Total Farmers', value: data?.totalFarmers, color: 'text-official' },
    { label: 'Active Sessions', value: data?.activeSessions, color: 'text-farmer' },
    { label: 'Total CSOs', value: data?.totalCoordinators, color: 'text-official' },
    { label: 'Active Alerts', value: data?.activeAlerts, color: 'text-alert-panic' },
    { label: 'Farms Registered', value: data?.totalFarms, color: 'text-farmer' },
    { label: 'Security Posts', value: data?.totalSecurityPosts, color: 'text-official' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-400 text-sm mb-6">Overview of system activities</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-5">
            <p className={`text-3xl font-bold ${c.color}`}>{c.value ?? '...'}</p>
            <p className="text-sm text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="font-semibold text-gray-700 mb-3">Alerts Overview</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>🚨 Panic Alerts</span><span className="font-semibold">{data?.alertsOverview?.panic ?? 0}</span></div>
            <div className="flex justify-between"><span>⏰ Missed Check-outs</span><span className="font-semibold">{data?.alertsOverview?.timeout ?? 0}</span></div>
            <div className="flex justify-between"><span>✅ Resolved</span><span className="font-semibold text-farmer">{data?.alertsOverview?.resolved ?? 0}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="font-semibold text-gray-700 mb-3">Recent Activity</p>
          {!data?.recentActivity?.length ? (
            <p className="text-gray-400 text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {data.recentActivity.map((log) => (
                <div key={log._id} className="flex justify-between">
                  <span className="text-gray-600">{log.action.replace(/_/g, ' ')}</span>
                  <span className="text-gray-400">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
