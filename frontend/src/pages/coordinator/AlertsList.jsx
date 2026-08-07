import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

export default function AlertsList() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    api.get('/coordinator/alerts').then((res) => {
      setAlerts(res.data);
      setLoading(false);
    });
  }, []);

  const counts = {
    all: alerts.length,
    panic: alerts.filter((a) => a.type === 'panic').length,
    overdue: alerts.filter((a) => a.type === 'timeout').length,
  };

  const filtered = alerts.filter((a) => {
    if (tab === 'panic') return a.type === 'panic';
    if (tab === 'overdue') return a.type === 'timeout';
    return true;
  });

  return (
    <div className="min-h-screen bg-official-light/10 pb-24">
      <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900 mb-3">Alerts</h1>
        <div className="flex gap-4 text-sm border-b border-gray-100">
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'panic', label: `Panic (${counts.panic})` },
            { key: 'overdue', label: `Overdue (${counts.overdue})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 font-medium ${tab === t.key ? 'text-alert-panic border-b-2 border-alert-panic' : 'text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No alerts here.</p>
        ) : (
          filtered.map((a) => (
            <button
              key={a._id}
              onClick={() => navigate(`/coordinator/alerts/${a._id}`)}
              className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.type === 'panic' ? '🚨' : '⏰'}</span>
                <div>
                  <p className="font-semibold text-gray-800">{a.farmer?.fullName || 'Unknown farmer'}</p>
                  <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${a.type === 'panic' ? 'bg-red-100 text-alert-panic' : 'bg-orange-100 text-orange-600'}`}>
                  {a.type === 'panic' ? 'Panic Alert' : 'Overdue'}
                </span>
                <p className={`text-xs mt-1 font-medium ${a.status === 'open' ? 'text-alert-panic' : 'text-farmer'}`}>
                  {a.status === 'open' ? 'Active' : 'Resolved'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      <CsoBottomNav />
    </div>
  );
}
