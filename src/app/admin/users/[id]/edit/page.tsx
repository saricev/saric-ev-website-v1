'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface Role {
  name: string;
  description: string;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const [userRes, rolesRes] = await Promise.all([
        fetch(`/api/users/${id}`),
        fetch('/api/roles'),
      ]);
      if (userRes.ok) {
        const user = await userRes.json();
        setForm({ username: user.username, password: '', role: user.role });
      }
      if (rolesRes.ok) setRoles(await rolesRes.json());
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const updates: Record<string, string> = {};
    if (form.username) updates.username = form.username;
    if (form.password) updates.password = form.password;
    if (form.role) updates.role = form.role;

    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      router.push('/admin/users');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update user.');
    }
    setSaving(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit User</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
          <input
            type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {roles.map((r) => (
              <option key={r.name} value={r.name}>{r.name} - {r.description}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.push('/admin/users')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
