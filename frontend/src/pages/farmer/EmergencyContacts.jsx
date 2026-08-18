import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FarmerBottomNav from '../../components/farmer/FarmerBottomNav';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

const emptyContact = { name: '', phone: '', relationship: '' };

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([{ ...emptyContact }, { ...emptyContact }, { ...emptyContact }]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/contacts').then((res) => {
      if (res.data.length === 3) {
        setContacts(res.data);
      } else {
        setEditing(true); // force setup if not yet complete
      }
    }).finally(() => setLoading(false));
  }, []);

  const updateContact = (index, field, value) => {
    setContacts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    for (const c of contacts) {
      if (!c.name.trim() || !c.phone.trim() || !c.relationship.trim()) {
        setError('All 3 contacts need a name, phone number, and relationship.');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api.put('/contacts', { contacts });
      setContacts(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contacts');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-farmer-light/20 pb-24 md:ml-64">
      <FarmerSidebar />
      <div className="bg-white px-6 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate('/farmer')} className="text-gray-500">&larr;</button>
        <h1 className="text-lg font-bold text-gray-900">Emergency Contacts</h1>
      </div>

      <div className="px-6 py-4 md:max-w-xl md:mx-auto">
        <div className="bg-farmer-light/50 text-farmer-dark text-sm rounded-lg p-3 mb-4 flex items-start gap-2">
          <span>ℹ️</span>
          <span>You must have exactly 3 emergency contacts.</span>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">
            {contacts.map((c, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-500">Contact {i + 1}</p>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateContact(i, 'name', e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  value={c.phone}
                  onChange={(e) => updateContact(i, 'phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={c.relationship}
                  onChange={(e) => updateContact(i, 'relationship', e.target.value)}
                  placeholder="Relationship (e.g. Wife, Brother)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-farmer text-white font-semibold py-3 rounded-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Contacts'}
            </button>
          </form>
        ) : (
          <>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-farmer-light flex items-center justify-center text-farmer-dark font-semibold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.relationship}</p>
                      <p className="text-xs text-gray-400">{c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditing(true)} title="Edit" className="text-lg">✏️</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-farmer text-white font-semibold py-3 rounded-lg mt-4"
            >
              Edit Contacts
            </button>
          </>
        )}
      </div>

      <FarmerBottomNav />
    </div>
  );
}