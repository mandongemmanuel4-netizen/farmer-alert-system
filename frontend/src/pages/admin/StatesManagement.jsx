import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function StatesManagement() {
  const [states, setStates] = useState([]);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/admin/location-stats').then((res) => setStates(res.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await api.post('/locations/states', { name: newName.trim() });
      setNewName('');
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add state');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">States</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="New state name"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64"
        />
        <button type="submit" disabled={saving} className="bg-official text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
          + Add State
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-5 py-3">State Name</th><th className="px-5 py-3">No. of LGAs</th></tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                <td className="px-5 py-3 text-gray-500">{s.lgaCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Total States: {states.length}</p>
    </AdminLayout>
  );
}
