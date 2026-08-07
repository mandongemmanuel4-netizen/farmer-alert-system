import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function CSOsList() {
  const [coordinators, setCoordinators] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({ fullName: '', phone: '', pin: '', state: '', lga: '', wardId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/admin/coordinators').then((res) => setCoordinators(res.data));
  useEffect(() => { load(); }, []);
  useEffect(() => { api.get('/locations/states').then((res) => setStates(res.data)); }, []);
  useEffect(() => {
    if (!form.state) return setLgas([]);
    api.get(`/locations/lgas?state=${form.state}`).then((res) => setLgas(res.data));
  }, [form.state]);
  useEffect(() => {
    if (!form.lga) return setWards([]);
    api.get(`/locations/wards?lga=${form.lga}`).then((res) => setWards(res.data));
  }, [form.lga]);

  const toggleActive = async (id) => {
    await api.put(`/admin/coordinators/${id}/toggle-active`);
    load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{4}$/.test(form.pin)) return setError('PIN must be exactly 4 digits');
    if (!form.wardId) return setError('Please select a ward for this CSO');

    setSaving(true);
    try {
      await api.post('/admin/coordinators', {
        fullName: form.fullName, phone: form.phone, pin: form.pin, wardId: form.wardId,
      });
      setShowCreate(false);
      setForm({ fullName: '', phone: '', pin: '', state: '', lga: '', wardId: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create CSO');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Safety Officers</h1>
        <button onClick={() => setShowCreate(true)} className="bg-official text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add New CSO
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Phone Number</th>
              <th className="px-5 py-3">Ward(s)</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coordinators.map((c) => (
              <tr key={c._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{c.fullName}</td>
                <td className="px-5 py-3 text-gray-500">{c.phone}</td>
                <td className="px-5 py-3 text-gray-500">{c.ward?.name || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.isActive ? 'bg-farmer-light text-farmer-dark' : 'bg-gray-100 text-gray-400'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleActive(c._id)} className="text-official text-sm font-medium">
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coordinators.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No CSOs yet. Add the first one.</p>}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Add New CSO</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text" placeholder="Full name" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
              <input
                type="tel" placeholder="Phone number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
              <input
                type="text" placeholder="4-digit PIN" maxLength={4} value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
              />
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value, lga: '', wardId: '' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white"
              >
                <option value="">Select state</option>
                {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select
                value={form.lga}
                onChange={(e) => setForm({ ...form, lga: e.target.value, wardId: '' })}
                disabled={!form.state}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white disabled:bg-gray-50"
              >
                <option value="">Select LGA</option>
                {lgas.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
              <select
                value={form.wardId}
                onChange={(e) => setForm({ ...form, wardId: e.target.value })}
                disabled={!form.lga}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white disabled:bg-gray-50"
              >
                <option value="">Select ward (this CSO's assignment)</option>
                {wards.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-gray-300 rounded-lg py-2.5 font-medium text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-official text-white rounded-lg py-2.5 font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create CSO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
