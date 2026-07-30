import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';

export default function MyFarms() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFarms = () => {
    setLoading(true);
    api.get('/farms').then((res) => setFarms(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadFarms(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/farms/${id}`);
    loadFarms();
  };

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/farmer')} className="text-gray-500">&larr;</button>
          <h1 className="text-lg font-bold text-gray-900">My Farms</h1>
        </div>
        <Link to="/farmer/farms/add" className="text-farmer text-xl font-bold">+</Link>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : farms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">You haven't added any farms yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {farms.map((farm) => (
              <div key={farm._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <p className="font-semibold text-gray-800">{farm.farmName}</p>
                    <p className="text-xs text-gray-400">
                      {farm.cropType && `Crop: ${farm.cropType}`}{farm.cropType && farm.farmSize && ' · '}{farm.farmSize && `Size: ${farm.farmSize}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-lg">
                  <Link to={`/farmer/farms/add?edit=${farm._id}`} title="Edit">✏️</Link>
                  <button onClick={() => handleDelete(farm._id, farm.farmName)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          to="/farmer/farms/add"
          className="block text-center bg-farmer text-white font-semibold py-3 rounded-lg mt-4"
        >
          + Add New Farm
        </Link>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
