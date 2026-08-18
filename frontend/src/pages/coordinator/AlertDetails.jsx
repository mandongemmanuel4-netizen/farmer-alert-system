import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CsoSidebar from '../../components/coordinator/CsoSidebar';

export default function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResolve, setShowResolve] = useState(false);
  const [notes, setNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const load = () => {
    api.get(`/coordinator/alerts/${id}`).then((res) => {
      setAlert(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [id]);

  const handleResolve = async () => {
    setResolving(true);
    try {
      await api.put(`/coordinator/alerts/${id}/resolve`, { notes });
      setShowResolve(false);
      load();
    } catch {
      alert('Failed to resolve alert. Please try again.');
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!alert) return <div className="min-h-screen flex items-center justify-center text-gray-400">Alert not found.</div>;

  const isPanic = alert.type === 'panic';
  const mapsLink = `https://maps.google.com/?q=${alert.gps?.lat},${alert.gps?.lng}`;

  return (
    <div className="min-h-screen bg-official-light/10 px-6 py-4 md:ml-64">
      <CsoSidebar />
      <div className="md:max-w-2xl md:mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/coordinator/alerts')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Alert Details</h1>
      </div>

      <div className={`rounded-xl p-4 mb-4 ${isPanic ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`font-bold ${isPanic ? 'text-alert-panic' : 'text-orange-600'}`}>
            {isPanic ? '🚨 Panic Alert' : '⏰ Missed Check-out'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${alert.status === 'open' ? 'bg-red-200 text-red-800' : 'bg-farmer-light text-farmer-dark'}`}>
            {alert.status === 'open' ? 'Active' : 'Resolved'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-3">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-official-light flex items-center justify-center font-bold text-official">
            {alert.farmer?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{alert.farmer?.fullName}</p>
            <p className="text-xs text-gray-400">{alert.farmer?.phone}</p>
          </div>
        </div>

        <div className="text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-gray-400">Alert Time</span><span className="text-gray-700">{new Date(alert.createdAt).toLocaleString()}</span></div>
          {alert.checkIn && (
            <>
              <div className="flex justify-between"><span className="text-gray-400">Checked In</span><span className="text-gray-700">{new Date(alert.checkIn.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Expected Return</span><span className="text-gray-700">{new Date(alert.checkIn.expectedReturnBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            </>
          )}
          {alert.resolvedBy && (
            <div className="flex justify-between"><span className="text-gray-400">Resolved By</span><span className="text-gray-700">{alert.resolvedBy.fullName}</span></div>
          )}
        </div>

        {alert.resolutionNotes && (
          <div className="bg-farmer-light/40 rounded-lg p-3 text-sm text-farmer-dark">
            <p className="font-medium mb-1">Resolution Notes:</p>
            <p>{alert.resolutionNotes}</p>
          </div>
        )}
      </div>

      {/* Recipients + delivery status */}
      {alert.recipients?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="font-semibold text-gray-700 text-sm mb-2">Alert Sent To</p>
          <div className="space-y-2">
            {alert.recipients.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{r.name} <span className="text-gray-400">({r.kind.replace('-', ' ')})</span></span>
                <span className={`text-xs font-medium ${r.smsStatus === 'failed' ? 'text-red-500' : 'text-farmer'}`}>
                  {r.smsStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <a href={`tel:${alert.farmer?.phone}`} className="bg-white border border-gray-200 rounded-xl py-3 text-center text-sm font-semibold text-gray-700 shadow-sm">
          📞 Call Farmer
        </a>
        <a href={mapsLink} target="_blank" rel="noreferrer" className="bg-white border border-gray-200 rounded-xl py-3 text-center text-sm font-semibold text-gray-700 shadow-sm">
          🗺️ Open Map
        </a>
      </div>

      {alert.status === 'open' && (
        <button
          onClick={() => setShowResolve(true)}
          className="w-full bg-farmer text-white font-semibold py-3 rounded-xl shadow-sm"
        >
          Resolve Alert
        </button>
      )}

      {showResolve && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <p className="font-bold text-gray-900 mb-3">Resolve Alert</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add resolution notes (e.g. farmer contacted, confirmed safe)"
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowResolve(false)} className="flex-1 border border-gray-300 rounded-lg py-2.5 font-medium">Cancel</button>
              <button onClick={handleResolve} disabled={resolving} className="flex-1 bg-farmer text-white rounded-lg py-2.5 font-semibold disabled:opacity-60">
                {resolving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
