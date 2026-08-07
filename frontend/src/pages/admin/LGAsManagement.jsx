import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function LGAsManagement() {
  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState('');
  const [lgas, setLgas] = useState([]);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/locations/states').then((res) => { setStates(res.data); if (res.data[0]) setStateId(res.data[0]._id); }); }, []);

  const loadLgas = () => {
    if (!stateId) return;
    api.get(`/locations/lgas?state=${stateId}`).then((res) => setLgas(res.data));
  };
  useEffect(() => { loadLgas(); }, [stateId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !stateId) return;
    setSaving(true);
    try {
      await api.post('/locations/lgas', { name: newName.trim(), state: stateId });
      setNewName('');
      loadLgas();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add LGA');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">LGAs</h1>

      <select value={stateId} onChange={(e) => setStateId(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm mb-4 bg-white">
        {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="New LGA name"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64"
        />
        <button type="submit" disabled={saving} className="bg-official text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
          + Add LGA
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-5 py-3">LGA Name</th></tr>
          </thead>
          <tbody>
            {lgas.map((l) => (
              <tr key={l._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{l.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {lgas.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No LGAs for this state yet.</p>}
      </div>
      <p className="text-xs text-gray-400 mt-3">Total LGAs: {lgas.length}</p>
    </AdminLayout>
  );
}
