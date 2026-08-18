import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';
import api from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [farmCount, setFarmCount] = useState(null);
  const [contactCount, setContactCount] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadAll = () => {
    api.get('/farms').then((res) => setFarmCount(res.data.length)).catch(() => setFarmCount(0));
    api.get('/contacts').then((res) => setContactCount(res.data.length)).catch(() => setContactCount(0));
    api.get('/checkins/active').then((res) => setActiveSession(res.data)).catch(() => setActiveSession(null));
  };

  useEffect(() => { loadAll(); }, []);

  const isCheckedIn = !!activeSession;

  const handleCheckIn = () => {
    if (isCheckedIn) { navigate('/farmer/session'); return; }
    navigate('/farmer/checkin');
  };

  const handleCheckOut = async () => {
    if (!isCheckedIn) return;
    setBusy(true);
    try {
      await api.put(`/checkins/${activeSession._id}/checkout`);
      loadAll();
    } catch {
      alert('Check-out failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handlePanic = () => {
    if (!navigator.geolocation) return alert('Location services are required to send a panic alert.');
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post('/checkins/panic', { gps: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
          setShowPanicConfirm(false);
          alert('🚨 Emergency alert sent. Your emergency contacts, coordinator, and nearest security post have been notified.');
          loadAll();
        } catch {
          alert('Failed to send panic alert. Please try again.');
        } finally {
          setBusy(false);
        }
      },
      () => { alert('Could not get your current location.'); setBusy(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24">
      <div className="bg-farmer text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <p className="text-sm text-white/80">Good day,</p>
        <h1 className="text-xl font-bold">{user?.fullName || 'Farmer'} 👋</h1>
      </div>

      <div className="px-6 mt-5">
        {/* Active session summary (only shown when checked in) */}
        {isCheckedIn && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800">{activeSession.farm?.farmName || 'Active Session'}</span>
              <span className="text-xs bg-farmer-light text-farmer-dark px-2 py-1 rounded-full font-semibold">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-400">
              Checked in: {new Date(activeSession.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·
              {' '}Expected return: {new Date(activeSession.expectedReturnBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}

        {/* Bold 3-button action row, matching the mockup */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={handleCheckIn}
            className="bg-farmer hover:bg-farmer-dark text-white rounded-2xl shadow-md py-5 flex flex-col items-center gap-2 transition active:scale-95"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">Check In</span>
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn || busy}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-md py-5 flex flex-col items-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-semibold">Check Out</span>
          </button>

          <button
            onClick={() => isCheckedIn ? setShowPanicConfirm(true) : alert('You need to be checked in to send a panic alert.')}
            className="bg-alert-panic hover:bg-red-700 text-white rounded-2xl shadow-md py-5 flex flex-col items-center gap-2 transition active:scale-95"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm font-semibold">Panic</span>
          </button>
        </div>

        {/* Quick access grid */}
        <p className="text-sm font-semibold text-gray-500 mb-2">Quick Access</p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/farmer/farms" className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
            <span className="text-2xl">🌾</span>
            <span className="font-semibold text-gray-800">My Farms</span>
            <span className="text-xs text-gray-400">{farmCount === null ? '...' : `${farmCount} registered`}</span>
          </Link>
          <Link to="/farmer/contacts" className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
            <span className="text-2xl">📞</span>
            <span className="font-semibold text-gray-800">Emergency Contacts</span>
            <span className="text-xs text-gray-400">{contactCount === null ? '...' : `${contactCount} of 3 set`}</span>
          </Link>
          <Link to="/farmer/history" className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
            <span className="text-2xl">🕐</span>
            <span className="font-semibold text-gray-800">History</span>
          </Link>
          <Link to="/farmer/profile" className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
            <span className="text-2xl">👤</span>
            <span className="font-semibold text-gray-800">Profile</span>
          </Link>
        </div>

        {(farmCount === 0 || contactCount !== null && contactCount < 3) && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            ⚠️ Complete your setup: {farmCount === 0 && 'add a farm'}{farmCount === 0 && contactCount < 3 && ' and '}{contactCount < 3 && 'set your 3 emergency contacts'} before checking in.
          </div>
        )}
      </div>

      <FarmerBottomNav />

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
