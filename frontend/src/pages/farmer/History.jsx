import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

const statusStyles = {
  completed: { label: 'Completed', bg: 'bg-farmer-light', text: 'text-farmer-dark' },
  'alert-sent': { label: 'Missed Check-out', bg: 'bg-orange-100', text: 'text-orange-600' },
  emergency: { label: 'Emergency', bg: 'bg-red-100', text: 'text-alert-panic' },
};

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/checkins/history').then((res) => {
      setHistory(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24 md:ml-64">
      <FarmerSidebar />
      <div className="bg-white px-6 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate('/farmer')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">History</h1>
      </div>

      <div className="px-6 py-4 md:max-w-2xl md:mx-auto">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No past farming sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => {
              const style = statusStyles[h.status] || statusStyles.completed;
              return (
                <div key={h._id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800">{h.farm?.farmName || 'Farm'}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(h.checkInTime).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {new Date(h.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {h.checkOutTime && ` - ${new Date(h.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FarmerBottomNav />
    </div>
  );
}
