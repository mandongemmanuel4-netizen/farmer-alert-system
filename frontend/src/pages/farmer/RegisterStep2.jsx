import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterForm } from '../../context/RegisterContext';
import api from '../../services/api';

export default function RegisterStep2() {
  const navigate = useNavigate();
  const { form, updateForm } = useRegisterForm();
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/locations/states').then((res) => setStates(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.state) { setLgas([]); return; }
    api.get(`/locations/lgas?state=${form.state}`).then((res) => setLgas(res.data)).catch(() => {});
  }, [form.state]);

  useEffect(() => {
    if (!form.lga) { setWards([]); return; }
    api.get(`/locations/wards?lga=${form.lga}`).then((res) => setWards(res.data)).catch(() => {});
  }, [form.lga]);

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.state) newErrors.state = 'Select your state';
    if (!form.lga) newErrors.lga = 'Select your LGA';
    if (!form.ward) newErrors.ward = 'Select your ward';
    if (!form.village.trim()) newErrors.village = 'Enter your village';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    navigate('/register/pin');
  };

  return (
    <div className="min-h-screen bg-farmer-light/30 flex flex-col px-6 py-8">
      <div className="max-w-md w-full mx-auto flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/register" className="text-gray-500">&larr;</Link>
          <span className="text-sm text-gray-500">Step 2 of 3</span>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6">
          <div className="w-2/3 h-1.5 bg-farmer rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Your Location</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Please select your location</p>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={form.state}
              onChange={(e) => updateForm({ state: e.target.value, lga: '', ward: '' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
            >
              <option value="">Select state</option>
              {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
            <select
              value={form.lga}
              onChange={(e) => updateForm({ lga: e.target.value, ward: '' })}
              disabled={!form.state}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white disabled:bg-gray-100"
            >
              <option value="">Select LGA</option>
              {lgas.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
            {errors.lga && <p className="text-red-500 text-xs mt-1">{errors.lga}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
            <select
              value={form.ward}
              onChange={(e) => updateForm({ ward: e.target.value })}
              disabled={!form.lga}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white disabled:bg-gray-100"
            >
              <option value="">Select ward</option>
              {wards.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
            </select>
            {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => updateForm({ village: e.target.value })}
              placeholder="Enter your village"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
            />
            {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg mt-4 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
