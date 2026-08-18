import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ReportsAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/admin/reports').then((res) => setData(res.data)); }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-official">{data?.totalAlerts ?? '...'}</p>
          <p className="text-xs text-gray-400">Total Alerts</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-alert-panic">{data?.panicAlerts ?? '...'}</p>
          <p className="text-xs text-gray-400">Panic Alerts</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-orange-500">{data?.timeoutAlerts ?? '...'}</p>
          <p className="text-xs text-gray-400">Automatic Alerts</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-farmer">{data?.resolvedAlerts ?? '...'}</p>
          <p className="text-xs text-gray-400">Resolved Alerts</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="font-semibold text-gray-700 mb-4">Alerts by Ward</p>
        {!data?.alertsByWard?.length ? (
          <p className="text-gray-400 text-sm">No alert data yet.</p>
        ) : (
          <div className="space-y-3">
            {data.alertsByWard.map((w) => (
              <div key={w.ward}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{w.ward}</span>
                  <span className="font-medium">{w.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-official h-2 rounded-full"
                    style={{ width: `${(w.count / data.alertsByWard[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
