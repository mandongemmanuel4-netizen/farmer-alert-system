import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function FarmersList() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/admin/farmers').then((res) => setFarmers(res.data));
  useEffect(() => { load(); }, []);

  const toggleActive = async (id) => {
    await api.put(`/admin/farmers/${id}/toggle-active`);
    load();
  };

  const filtered = farmers.filter((f) => f.fullName.toLowerCase().includes(search.toLowerCase()) || f.phone.includes(search));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farmers</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farmers..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone Number</th>
              <th className="px-5 py-3">Ward</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{f.fullName}</td>
                <td className="px-5 py-3 text-gray-500">{f.phone}</td>
                <td className="px-5 py-3 text-gray-500">{f.ward?.name || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${f.isActive ? 'bg-farmer-light text-farmer-dark' : 'bg-gray-100 text-gray-400'}`}>
                    {f.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(f._id)} className="text-official text-sm font-medium">
                    {f.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No farmers found.</p>}
      </div>
    </AdminLayout>
  );
}
