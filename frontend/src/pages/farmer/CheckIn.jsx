import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

const DURATIONS = [
  { hours: 1, label: 'Quick trip', sub: '1 hour' },
  { hours: 3, label: 'Half morning', sub: '3 hours' },
  { hours: 5, label: 'Half day', sub: '5 hours' },
  { hours: 9, label: 'Full day', sub: '9 hours' },
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState('');
  const [hours, setHours] = useState(5);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('17:00');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/farms').then((res) => {
      setFarms(res.data);
      if (res.data.length > 0) setFarmId(res.data[0]._id);
    });
  }, []);

  const expectedReturnBy = useCustomTime
    ? (() => {
        const [h, m] = customTime.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        if (d < new Date()) d.setDate(d.getDate() + 1); // if that time already passed today, assume tomorrow
        return d;
      })()
    : new Date(Date.now() + hours * 3600000);

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');

    if (!farmId) return setError('Please select a farm');
    if (!confirmed) return setError('Please confirm you have arrived safely at your farm');
    if (!navigator.geolocation) return setError('Your browser does not support location services');

    setSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post('/checkins', {
            farmId,
            expectedReturnBy: expectedReturnBy.toISOString(),
            gps: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          navigate('/farmer/session');
        } catch (err) {
          setError(err.response?.data?.message || 'Check-in failed');
          setSubmitting(false);
        }
      },
      () => {
        setError('Could not get your current location. Please allow location access.');
        setSubmitting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 px-6 py-4 md:ml-64">
      <FarmerSidebar />
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .anim-1 { animation: fadeInUp 0.5s ease-out 0.05s both; }
        .anim-2 { animation: fadeInUp 0.5s ease-out 0.15s both; }
        .anim-3 { animation: fadeInUp 0.5s ease-out 0.25s both; }
        .anim-4 { animation: fadeInUp 0.5s ease-out 0.35s both; }
      `}</style>

      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/farmer')} className="text-gray-500 text-lg">&larr;</button>
          <h1 className="text-lg font-bold text-gray-900">Check In</h1>
        </div>

        {/* Illustration card */}
        <div className="anim-1 bg-gradient-to-b from-farmer-light/70 to-farmer-light/30 rounded-2xl h-44 flex items-center justify-center mb-6 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center text-5xl">
            🧑‍🌾
          </div>
        </div>

        {farms.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            You need to add a farm before you can check in.{' '}
            <button onClick={() => navigate('/farmer/farms/add')} className="underline font-medium">Add one now</button>.
          </div>
        ) : (
          <form onSubmit={handleStart} className="space-y-5">
            <div className="anim-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Farm</label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-farmer"
              >
                {farms.map((f) => <option key={f._id} value={f._id}>{f.farmName}</option>)}
              </select>
            </div>

            <div className="anim-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">How long will you be at the farm?</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.hours}
                    type="button"
                    onClick={() => { setHours(d.hours); setUseCustomTime(false); }}
                    className={`py-3 px-2 rounded-xl text-left border-2 transition ${
                      !useCustomTime && hours === d.hours
                        ? 'bg-farmer border-farmer text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{d.label}</div>
                    <div className={`text-xs ${!useCustomTime && hours === d.hours ? 'text-white/80' : 'text-gray-400'}`}>{d.sub}</div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setUseCustomTime(true)}
                className={`w-full mt-2 py-3 px-3 rounded-xl text-left border-2 transition flex items-center justify-between ${
                  useCustomTime ? 'bg-farmer border-farmer text-white shadow-sm' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-semibold text-sm">Custom return time</span>
                {useCustomTime && (
                  <input
                    type="time"
                    value={customTime}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="bg-white/20 rounded-lg px-2 py-1 text-white text-sm border border-white/40 [color-scheme:dark]"
                  />
                )}
              </button>

              <p className="text-xs text-gray-400 mt-2">
                Expected return: <span className="font-medium text-farmer-dark">
                  {expectedReturnBy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            </div>

            <label className="anim-3 flex items-center gap-2 text-sm text-gray-700 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 accent-farmer" />
              I have arrived safely at my farm.
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="anim-4 w-full bg-farmer hover:bg-farmer-dark active:scale-95 text-white font-semibold py-3 rounded-xl shadow-sm transition disabled:opacity-60"
            >
              {submitting ? 'Starting...' : 'Start Farming Session'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}