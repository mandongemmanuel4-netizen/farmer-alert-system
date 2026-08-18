import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

const statusStyles = {
  'checked-in': { label: 'On Time', bg: 'bg-farmer-light', text: 'text-farmer-dark' },
  overdue: { label: 'Overdue', bg: 'bg-orange-100', text: 'text-orange-600' },
  emergency: { label: 'Active Alert', bg: 'bg-red-100', text: 'text-alert-panic' },
  idle: { label: 'Off Farm', bg: 'bg-gray-100', text: 'text-gray-500' },
};

export default function ActiveFarmers() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/coordinator/farmers').then((res) => {
      setFarmers(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = farmers.filter((f) => {
    const matchesSearch = f.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && ['checked-in', 'overdue', 'emergency'].includes(f.status)) ||
      (filter === 'overdue' && (f.status === 'overdue' || f.status === 'emergency'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-official-light/10 pb-24">
      <div className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900 mb-3">Active Farmers</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farmer or farm"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3"
        />
        <div className="flex gap-2 text-sm">
          {[
            { key: 'all', label: `All (${farmers.length})` },
            { key: 'active', label: 'On Farm' },
            { key: 'overdue', label: 'Overdue' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full font-medium ${filter === f.key ? 'bg-official text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No farmers found.</p>
        ) : (
          filtered.map((f) => {
            const style = statusStyles[f.status] || statusStyles.idle;
            return (
              <button
                key={f._id}
                onClick={() => navigate(`/coordinator/farmers/${f._id}`)}
                className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between text-left"
              >
                <div>
                  <p className="font-semibold text-gray-800">{f.fullName}</p>
                  <p className="text-xs text-gray-400">
                    {f.activeSession?.farm?.farmName || f.village || 'No active session'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </button>
            );
          })
        )}
      </div>

      <CsoBottomNav />
    </div>
  );
}
