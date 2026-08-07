import { useState, useEffect } from 'react';
import api from '../../services/api';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

export default function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get('/coordinator/dashboard').then((res) => setDashboard(res.data));
    api.get('/coordinator/alerts').then((res) => setAlerts(res.data));
  }, []);

  const panicCount = alerts.filter((a) => a.type === 'panic').length;
  const timeoutCount = alerts.filter((a) => a.type === 'timeout').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-official-light/10 pb-24">
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Reports</h1>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-official">{dashboard?.activeFarmers ?? '...'}</p>
            <p className="text-xs text-gray-400">Active Farmers</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-2xl font-bold text-farmer">{dashboard?.securityPosts ?? '...'}</p>
            <p className="text-xs text-gray-400">Security Posts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="font-semibold text-gray-700 mb-3">Alerts by Type</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">🚨 Panic Alerts</span>
              <span className="font-semibold">{panicCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">⏰ Missed Check-outs</span>
              <span className="font-semibold">{timeoutCount}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-2">
              <span className="text-gray-600">✅ Resolved</span>
              <span className="font-semibold text-farmer">{resolvedCount} / {alerts.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="font-semibold text-gray-700 mb-3">Response Rate</p>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-farmer h-3 rounded-full transition-all"
              style={{ width: `${alerts.length ? Math.round((resolvedCount / alerts.length) * 100) : 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {alerts.length ? Math.round((resolvedCount / alerts.length) * 100) : 0}% of alerts resolved
          </p>
        </div>
      </div>

      <CsoBottomNav />
    </div>
  );
}
