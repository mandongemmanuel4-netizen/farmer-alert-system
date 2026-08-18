import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function SecurityPosts() {
  const [posts, setPosts] = useState([]);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', state: '', lga: '', ward: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/admin/security-posts').then((res) => setPosts(res.data));
  useEffect(() => { load(); api.get('/locations/states').then((res) => setStates(res.data)); }, []);
  useEffect(() => { if (form.state) api.get(`/locations/lgas?state=${form.state}`).then((res) => setLgas(res.data)); }, [form.state]);
  useEffect(() => { if (form.lga) api.get(`/locations/wards?lga=${form.lga}`).then((res) => setWards(res.data)); }, [form.lga]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.ward) return alert('Please fill in name, phone, and ward');
    setSaving(true);
    try {
      await api.post('/admin/security-posts', { name: form.name, phone: form.phone, ward: form.ward });
      setForm({ name: '', phone: '', state: '', lga: '', ward: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add security post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this security post?')) return;
    await api.delete(`/admin/security-posts/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Posts</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-3 gap-3">
        <input placeholder="Post name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Contact phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, lga: '', ward: '' })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Select state</option>
          {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select value={form.lga} onChange={(e) => setForm({ ...form, lga: e.target.value, ward: '' })} disabled={!form.state} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Select LGA</option>
          {lgas.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
        <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} disabled={!form.lga} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Select ward</option>
          {wards.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
        </select>
        <button type="submit" disabled={saving} className="bg-official text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60">
          {saving ? 'Adding...' : '+ Add Post'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-5 py-3">Post Name</th><th className="px-5 py-3">Ward</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-5 py-3 text-gray-500">{p.ward?.name || '-'}</td>
                <td className="px-5 py-3 text-gray-500">{p.phone}</td>
                <td className="px-5 py-3">
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No security posts yet.</p>}
      </div>
      <p className="text-xs text-gray-400 mt-3">Total Posts: {posts.length}</p>
    </AdminLayout>
  );
}
