'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Role {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

const ALL_PERMISSIONS = [
  'products:read', 'products:write', 'products:delete',
  'solutions:read', 'solutions:write', 'solutions:delete',
  'blog:read', 'blog:write', 'blog:delete',
  'faq:read', 'faq:write', 'faq:delete',
  'inquiries:read', 'inquiries:write', 'inquiries:delete',
  'dealers:read', 'dealers:write', 'dealers:delete',
  'company:read', 'company:write',
  'users:read', 'users:write', 'users:delete',
  'settings:read', 'settings:write',
];

const PERMISSION_GROUPS = [
  { label: 'Products', prefix: 'products' },
  { label: 'Solutions', prefix: 'solutions' },
  { label: 'Blog', prefix: 'blog' },
  { label: 'FAQ', prefix: 'faq' },
  { label: 'Inquiries', prefix: 'inquiries' },
  { label: 'Dealers', prefix: 'dealers' },
  { label: 'Company', prefix: 'company' },
  { label: 'Users', prefix: 'users' },
  { label: 'Settings', prefix: 'settings' },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] as string[] });
  const [error, setError] = useState('');

  useEffect(() => { loadRoles(); }, []);

  async function loadRoles() {
    const res = await fetch('/api/roles');
    if (res.ok) setRoles(await res.json());
    setLoading(false);
  }

  function togglePermission(perm: string) {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  }

  function toggleGroup(prefix: string) {
    const groupPerms = ALL_PERMISSIONS.filter((p) => p.startsWith(prefix + ':'));
    const allSelected = groupPerms.every((p) => form.permissions.includes(p));
    setForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !p.startsWith(prefix + ':'))
        : [...new Set([...prev.permissions, ...groupPerms])],
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowCreate(false);
      setForm({ name: '', description: '', permissions: [] });
      loadRoles();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create role.');
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError('');
    const res = await fetch(`/api/roles/${editing.name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: form.description, permissions: form.permissions }),
    });
    if (res.ok) {
      setEditing(null);
      setForm({ name: '', description: '', permissions: [] });
      loadRoles();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update role.');
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`Delete role "${name}"?`)) return;
    const res = await fetch(`/api/roles/${name}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to delete role.');
    }
    loadRoles();
  }

  function startEdit(role: Role) {
    setEditing(role);
    setForm({ name: role.name, description: role.description, permissions: [...role.permissions] });
    setShowCreate(false);
  }

  function startCreate() {
    setShowCreate(true);
    setEditing(null);
    setForm({ name: '', description: '', permissions: [] });
  }

  if (loading) return <p>Loading...</p>;

  const isFormVisible = showCreate || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
        </div>
        <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={editing ? handleUpdate : handleCreate} className="mb-8 bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900">{editing ? `Edit Role: ${editing.name}` : 'Create New Role'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text" required value={form.name} disabled={!!editing}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="space-y-4">
              {PERMISSION_GROUPS.map((group) => {
                const groupPerms = ALL_PERMISSIONS.filter((p) => p.startsWith(group.prefix + ':'));
                const allSelected = groupPerms.every((p) => form.permissions.includes(p));
                return (
                  <div key={group.prefix} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox" checked={allSelected}
                        onChange={() => toggleGroup(group.prefix)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm font-semibold text-gray-800">{group.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 ml-7">
                      {groupPerms.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox" checked={form.permissions.includes(perm)}
                            onChange={() => togglePermission(perm)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600">{perm.split(':')[1]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
              {editing ? 'Update Role' : 'Create Role'}
            </button>
            <button type="button" onClick={() => { setShowCreate(false); setEditing(null); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{role.permissions.length} permissions</td>
                <td className="px-6 py-4 text-sm">
                  {role.isSystem ? (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">System</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">Custom</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(role)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {!role.isSystem && (
                      <button onClick={() => handleDelete(role.name)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
