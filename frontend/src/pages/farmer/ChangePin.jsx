import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

export default function ChangePin() {
  const navigate = useNavigate();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!/^\d{4}$/.test(newPin)) return setError('New PIN must be exactly 4 digits');
    if (newPin !== confirmPin) return setError('New PINs do not match');

    setSaving(true);
    try {
      await api.post('/auth/change-pin', { currentPin, newPin });
      setSuccess(true);
      setCurrentPin(''); setNewPin(''); setConfirmPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change PIN');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24 md:ml-64">
      <FarmerSidebar />
      <div className="bg-white px-6 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate('/farmer/profile')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Change PIN</h1>
      </div>

      <div className="px-6 py-6 md:max-w-md md:mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current PIN</label>
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New PIN</label>
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-farmer text-sm font-medium">✅ PIN updated successfully</p>}

          <button
            type="submit" disabled={saving}
            className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {saving ? 'Updating...' : 'Update PIN'}
          </button>
        </form>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
