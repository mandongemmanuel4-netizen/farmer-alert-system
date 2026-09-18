import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function formatElapsed(start) {
  const diffMs = Date.now() - new Date(start).getTime();
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function ActiveSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState('');
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadSession = () => {
    api.get('/checkins/active').then((res) => {
      setSession(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadSession(); }, []);

  useEffect(() => {
    if (!session) return;
    setElapsed(formatElapsed(session.checkInTime));
    const interval = setInterval(() => setElapsed(formatElapsed(session.checkInTime)), 60000);
    return () => clearInterval(interval);
  }, [session]);

  const handleCheckOut = async () => {
    setBusy(true);
    setError('');
    try {
      await api.put(`/checkins/${session._id}/checkout`);
      navigate('/farmer');
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed');
      setBusy(false);
    }
  };

  const handlePanic = () => {
    setBusy(true);
    setError('');
    const send = (gps) => api.post('/checkins/panic', { gps })
      .then(() => {
        setShowPanicConfirm(false);
        alert('🚨 Emergency alert sent. Your emergency contacts, coordinator, and nearest security post have been notified.');
        loadSession();
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to send panic alert'))
      .finally(() => setBusy(false));

    if (!navigator.geolocation) return send(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => send({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => send(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-4">You don't have an active farming session.</p>
        <button onClick={() => navigate('/farmer/checkin')} className="bg-farmer text-white px-6 py-3 rounded-lg font-semibold">
          Check In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-farmer-light/20 px-6 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/farmer')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Active Session</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-800">{session.farm?.farmName || 'Farm'}</span>
          <span className="text-xs bg-farmer-light text-farmer-dark px-2 py-1 rounded-full font-semibold">ACTIVE</span>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between"><span>Checked in</span><span>{new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          <div className="flex justify-between"><span>Expected Return</span><span>{new Date(session.expectedReturnBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
          <div className="flex justify-between"><span>Elapsed Time</span><span>{elapsed}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex justify-between text-sm">
        <div>
          <p className="text-gray-400">GPS Status</p>
          <p className="text-farmer font-medium">● Good</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">Last Updated</p>
          <p className="text-gray-700">{new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleCheckOut}
        disabled={busy}
        className="w-full bg-farmer text-white font-semibold py-3 rounded-lg mb-3 disabled:opacity-60"
      >
        {busy ? 'Working...' : 'Check Out'}
      </button>
      <button
        onClick={() => setShowPanicConfirm(true)}
        disabled={busy}
        className="w-full bg-alert-panic text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
      >
        🛡️ Panic
      </button>

      {showPanicConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <p className="font-bold text-gray-900 mb-2">Send Emergency Alert?</p>
            <p className="text-sm text-gray-500 mb-5">This will immediately notify your emergency contacts, coordinator, and the nearest security post with your current location.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowPanicConfirm(false)} className="flex-1 border border-gray-300 rounded-lg py-2.5 font-medium">Cancel</button>
              <button onClick={handlePanic} disabled={busy} className="flex-1 bg-alert-panic text-white rounded-lg py-2.5 font-semibold disabled:opacity-60">
                {busy ? 'Sending...' : 'YES'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
