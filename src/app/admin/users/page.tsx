'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'viewer' });
  const [roles, setRoles] = useState<{ name: string; description: string }[]>([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    const res = await fetch('/api/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  async function loadRoles() {
    const res = await fetch('/api/roles');
    if (res.ok) setRoles(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setShowCreate(false);
      setNewUser({ username: '', password: '', role: 'viewer' });
      loadUsers();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create user.');
    }
    setCreating(false);
  }

  async function handleDelete(id: string, username: string) {
    if (!confirm(`Delete user "${username}"?`)) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) loadUsers();
    else {
      const data = await res.json();
      alert(data.error || 'Failed to delete user.');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/roles"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Roles
          </Link>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-lg">
          <h3 className="font-semibold text-gray-900">Create New User</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text" required value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((r) => (
                <option key={r.name} value={r.name}>{r.name} - {r.description}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
              {creating ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{user.role}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/users/${user.id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(user.id, user.username)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
