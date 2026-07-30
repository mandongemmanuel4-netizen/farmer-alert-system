import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterForm } from '../../context/RegisterContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CreatePin() {
  const navigate = useNavigate();
  const { form, clearForm } = useRegisterForm();
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { ...form, pin });
      // Auto-login right after registration so the user lands straight on their dashboard
      await login(form.phone, pin);
      clearForm();
      navigate('/farmer');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-farmer-light/30 flex flex-col px-6 py-8">
      <div className="max-w-md w-full mx-auto flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/register/location" className="text-gray-500">&larr;</Link>
          <span className="text-sm text-gray-500">Step 3 of 3</span>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6">
          <div className="w-full h-1.5 bg-farmer rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Create Security PIN</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Create a 4-digit PIN to secure your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg mt-2 transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-xs text-gray-400 text-center bg-farmer-light/50 rounded-lg p-3">
            🔒 Keep your PIN secret and do not share with anyone.
          </p>
        </form>
      </div>
    </div>
  );
}
