import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function FarmerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/coordinator/farmers/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  const { farmer, activeSession, history } = data;

  return (
    <div className="min-h-screen bg-official-light/10 px-6 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/coordinator/farmers')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Farmer Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-official-light flex items-center justify-center font-bold text-official text-lg">
            {farmer.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-800">{farmer.fullName}</p>
            <p className="text-sm text-gray-400">{farmer.phone}</p>
          </div>
        </div>
        <a href={`tel:${farmer.phone}`} className="block text-center bg-official text-white font-semibold py-2.5 rounded-lg text-sm">
          📞 Call Farmer
        </a>
      </div>

      {activeSession ? (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-700">Current Session</p>
            <span className="text-xs bg-farmer-light text-farmer-dark px-2 py-1 rounded-full font-semibold">{activeSession.status}</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span className="text-gray-400">Farm</span><span>{activeSession.farm?.farmName}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Checked in</span><span>{new Date(activeSession.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Expected return</span><span>{new Date(activeSession.expectedReturnBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 text-sm text-gray-400">No active session.</div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="font-semibold text-gray-700 mb-2">Recent History</p>
        {history?.length === 0 ? (
          <p className="text-gray-400 text-sm">No past sessions.</p>
        ) : (
          <div className="space-y-2">
            {history?.map((h) => (
              <div key={h._id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-600">{new Date(h.checkInTime).toLocaleDateString()}</span>
                <span className={h.status === 'alert-sent' ? 'text-orange-600' : 'text-farmer'}>{h.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
