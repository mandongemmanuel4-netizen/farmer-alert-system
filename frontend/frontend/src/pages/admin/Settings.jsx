import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/admin/settings').then((res) => setSettings(res.data)); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/admin/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <AdminLayout><p className="text-gray-400">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>

      <form onSubmit={handleSave} className="max-w-lg space-y-5">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <p className="font-semibold text-gray-700">Check-in Behavior</p>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Reminder Time (minutes before expected return)</label>
            <input
              type="number" value={settings.reminderMinutesBeforeReturn}
              onChange={(e) => setSettings({ ...settings, reminderMinutesBeforeReturn: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Grace Period (minutes after expected return before alert fires)</label>
            <input
              type="number" value={settings.gracePeriodMinutes}
              onChange={(e) => setSettings({ ...settings, gracePeriodMinutes: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 space-y-2">
          <p className="font-semibold text-gray-700 mb-2">SMS Settings</p>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Provider</span><span>{settings.smsProvider}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Sender ID</span><span>{settings.smsSenderId}</span></div>
        </div>

        {saved && <p className="text-farmer text-sm font-medium">✅ Settings saved</p>}

        <button type="submit" disabled={saving} className="bg-official text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </AdminLayout>
  );
}
