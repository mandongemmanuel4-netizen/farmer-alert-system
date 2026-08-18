import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(phone, pin);
      navigate(`/${user.role}`); // sends farmer -> /farmer, coordinator -> /coordinator, admin -> /admin
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid phone number or PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-farmer-light/30 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size={80} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 text-sm">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0803 123 4567"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
              />
              <button
                type="button"
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                {showPin ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-pin" className="text-sm text-farmer">Forgot PIN?</Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <Link to="/register" className="text-farmer font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}