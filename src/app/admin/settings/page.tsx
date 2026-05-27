'use client';

import { useState, useEffect } from 'react';
import { CompanyInfo } from '@/types';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<CompanyInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [canWrite, setCanWrite] = useState(false);

  useEffect(() => {
    fetch('/api/company').then((r) => r.json()).then(setForm);
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      setCanWrite(data.user?.permissions?.includes('company:write') ?? false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setMessage('Settings saved successfully!');
    else setMessage('Failed to save.');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Company Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input type="text" value={form.social.facebook || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input type="text" value={form.social.linkedin || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input type="text" value={form.social.youtube || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, youtube: e.target.value } })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input type="text" value={form.social.instagram || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} disabled={!canWrite} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50" />
          </div>
        </div>
        {canWrite && (
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {message && <span className="text-sm text-green-600">{message}</span>}
          </div>
        )}
        {!canWrite && (
          <p className="text-sm text-gray-500">You have read-only access to settings.</p>
        )}
      </form>
    </div>
  );
}
