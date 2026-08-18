import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import MapPicker from '../../components/common/MapPicker';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

export default function AddFarm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({ farmName: '', cropType: '', farmSize: '', gps: null });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      api.get('/farms').then((res) => {
        const farm = res.data.find((f) => f._id === editId);
        if (farm) {
          setForm({ farmName: farm.farmName, cropType: farm.cropType || '', farmSize: farm.farmSize || '', gps: farm.gps });
        }
      });
    }
  }, [editId]);

  const useMyCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location services.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, gps: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError('Could not get your location. You can still tap the map below to select it manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.farmName.trim()) return setError('Farm name is required');
    if (!form.gps) return setError('Please tap on the map below to set your farm location');

    setSaving(true);
    try {
      if (editId) {
        await api.put(`/farms/${editId}`, form);
      } else {
        await api.post('/farms', form);
      }
      navigate('/farmer/farms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save farm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 px-6 py-4 md:ml-64">
      <FarmerSidebar />
      <div className="md:max-w-lg md:mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/farmer/farms')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">{editId ? 'Edit Farm' : 'Add New Farm'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Farm Location</label>
            <button
              type="button"
              onClick={useMyCurrentLocation}
              className="text-farmer text-xs font-medium"
            >
              {locating ? 'Locating...' : '📍 Use my current location'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-2">Tap anywhere on the map to set your farm's location, or drag the pin to adjust it.</p>
          <MapPicker value={form.gps} onChange={(gps) => setForm((f) => ({ ...f, gps }))} />
          {form.gps && (
            <p className="text-xs text-farmer-dark mt-1">
              Selected: {form.gps.lat.toFixed(5)}, {form.gps.lng.toFixed(5)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
          <input
            type="text"
            value={form.farmName}
            onChange={(e) => setForm({ ...form, farmName: e.target.value })}
            placeholder="e.g. Rice Farm"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
          <select
            value={form.cropType}
            onChange={(e) => setForm({ ...form, cropType: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
          >
            <option value="">Select crop type</option>
            <option>Rice</option>
            <option>Maize</option>
            <option>Millet</option>
            <option>Sorghum</option>
            <option>Groundnut</option>
            <option>Cassava</option>
            <option>Vegetables</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (Acres)</label>
          <input
            type="text"
            value={form.farmSize}
            onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
            placeholder="e.g. 5 Acres"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farmer"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-farmer hover:bg-farmer-dark text-white font-semibold py-3 rounded-lg disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Farm'}
        </button>
      </form>
      </div>
    </div>
  );
}
