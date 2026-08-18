import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function WardsManagement() {
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [stateId, setStateId] = useState('');
  const [lgaId, setLgaId] = useState('');
  const [wards, setWards] = useState([]);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/locations/states').then((res) => { setStates(res.data); if (res.data[0]) setStateId(res.data[0]._id); }); }, []);
  useEffect(() => {
    if (!stateId) return;
    api.get(`/locations/lgas?state=${stateId}`).then((res) => { setLgas(res.data); if (res.data[0]) setLgaId(res.data[0]._id); else setLgaId(''); });
  }, [stateId]);

  const loadWards = () => {
    if (!lgaId) return setWards([]);
    api.get(`/locations/wards?lga=${lgaId}`).then((res) => setWards(res.data));
  };
  useEffect(() => { loadWards(); }, [lgaId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !lgaId) return;
    setSaving(true);
    try {
      await api.post('/locations/wards', { name: newName.trim(), lga: lgaId });
      setNewName('');
      loadWards();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add ward');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wards</h1>

      <div className="flex gap-3 mb-4">
        <select value={stateId} onChange={(e) => setStateId(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white">
          {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select value={lgaId} onChange={(e) => setLgaId(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white">
          {lgas.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="New ward name"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64"
        />
        <button type="submit" disabled={saving} className="bg-official text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
          + Add Ward
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-5 py-3">Ward Name</th></tr>
          </thead>
          <tbody>
            {wards.map((w) => (
              <tr key={w._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{w.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {wards.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No wards for this LGA yet.</p>}
      </div>
      <p className="text-xs text-gray-400 mt-3">Total Wards: {wards.length}</p>
    </AdminLayout>
  );
}
