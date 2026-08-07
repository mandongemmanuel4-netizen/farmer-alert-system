import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/activity-logs').then((res) => { setLogs(res.data); setLoading(false); });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Time</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{log.user?.fullName || 'System'}</td>
                <td className="px-5 py-3 text-gray-600">{log.action.replace(/_/g, ' ')}</td>
                <td className="px-5 py-3 text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && logs.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No activity recorded yet.</p>}
      </div>
      <p className="text-xs text-gray-400 mt-3">Showing latest {logs.length} actions</p>
    </AdminLayout>
  );
}
