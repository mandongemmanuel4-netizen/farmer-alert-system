import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function defaultReturnTime() {
  const d = new Date();
  d.setHours(17, 0, 0, 0); // default 5:00 PM today
  if (d < new Date()) d.setDate(d.getDate() + 1); // if already past 5pm, default to tomorrow
  return d.toISOString().slice(0, 16); // format for datetime-local input
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState('');
  const [expectedReturnBy, setExpectedReturnBy] = useState(defaultReturnTime());
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/farms').then((res) => {
      setFarms(res.data);
      if (res.data.length > 0) setFarmId(res.data[0]._id);
    });
  }, []);

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
            expectedReturnBy: new Date(expectedReturnBy).toISOString(),
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
    <div className="min-h-screen bg-farmer-light/20 px-6 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/farmer')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Check In</h1>
      </div>

      <div className="bg-farmer-light/40 rounded-xl h-40 flex items-center justify-center text-5xl mb-6">
        🧑‍🌾
      </div>

      {farms.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You need to add a farm before you can check in. <button onClick={() => navigate('/farmer/farms/add')} className="underline font-medium">Add one now</button>.
        </div>
      ) : (
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Farm</label>
            <select
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
            >
              {farms.map((f) => <option key={f._id} value={f._id}>{f.farmName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Time</label>
            <input
              type="datetime-local"
              value={expectedReturnBy}
              onChange={(e) => setExpectedReturnBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4" />
            I have arrived safely at my farm.
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-farmer text-white font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {submitting ? 'Starting...' : 'Start Farming Session'}
          </button>
        </form>
      )}
    </div>
  );
}
