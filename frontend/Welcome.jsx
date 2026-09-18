import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Logo from '../../components/common/Logo';

export default function Welcome() {
  const navigate = useNavigate();
  const [showPanic, setShowPanic] = useState(false);
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handlePanic = () => {
    if (!phone.trim()) { setError('Enter your registered phone number.'); return; }
    setBusy(true);
    setError('');
    const send = (gps) => api.post('/checkins/public-panic', { phone, gps })
      .then(() => { setShowPanic(false); setPhone(''); alert('🚨 Emergency alert sent. Your emergency contacts, Coordinator, and nearest security post have been notified.'); })
      .catch((err) => setError(err.response?.data?.message || 'Failed to send panic alert. Please try again.'))
      .finally(() => setBusy(false));

    if (!navigator.geolocation) return send(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => send({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => send(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .anim-logo { animation: popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both, floatSlow 4s ease-in-out 0.7s infinite; }
        .anim-title { animation: fadeInUp 0.6s ease-out 0.35s both; }
        .anim-tagline { animation: fadeInUp 0.6s ease-out 0.5s both; }
        .anim-subtitle { animation: fadeInUp 0.6s ease-out 0.65s both; }
        .anim-btn1 { animation: fadeInUp 0.6s ease-out 0.85s both; }
        .anim-btn2 { animation: fadeInUp 0.6s ease-out 1s both; }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <div className="anim-logo mb-8">
          <Logo size={160} />
        </div>

        <h1 className="anim-title text-xl font-extrabold text-gray-900">
          Welcome to <span className="text-farmer">FSDAMS</span>
        </h1>
        <p className="anim-tagline text-farmer-dark font-medium mt-2 text-sm">Your safety, our priority.</p>
        <p className="anim-subtitle text-gray-400 text-xs mt-1 max-w-xs">We are here to protect you while you farm.</p>
      </div>

      <div className="space-y-3 max-w-md mx-auto w-full">
        <button
          onClick={() => navigate('/register')}
          className="anim-btn1 w-full bg-farmer hover:bg-farmer-dark active:scale-95 text-white font-semibold py-2.5 text-sm rounded-lg transition"
        >
          Register
        </button>
        <button
          onClick={() => setShowPanic(true)}
          className="w-full bg-alert-panic hover:bg-red-700 active:scale-95 text-white font-semibold py-3 text-sm rounded-lg transition"
        >
          🚨 Panic / Emergency
        </button>
        <button
          onClick={() => navigate('/login')}
          className="anim-btn2 w-full border-2 border-farmer text-farmer font-semibold py-2.5 text-sm rounded-lg transition hover:bg-farmer-light/40 active:scale-95"
        >
          Login
        </button>
      </div>

      {showPanic && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-2">🚨</div>
              <h2 className="font-bold text-gray-900 text-lg">Emergency Panic Alert</h2>
              <p className="text-sm text-gray-500 mt-2 mb-4">No PIN is required. Enter your registered phone number to send an emergency alert.</p>
            </div>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 123 4567" className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-alert-panic" />
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowPanic(false); setError(''); }} disabled={busy} className="flex-1 border border-gray-300 rounded-lg py-3 font-medium">Cancel</button>
              <button onClick={handlePanic} disabled={busy} className="flex-1 bg-alert-panic text-white rounded-lg py-3 font-semibold disabled:opacity-60">{busy ? 'Sending...' : 'Send Alert'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}