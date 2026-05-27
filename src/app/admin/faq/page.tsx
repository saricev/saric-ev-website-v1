'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { FAQ } from '@/types';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: '' });
  const [canWrite, setCanWrite] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    fetch('/api/faq').then((r) => r.json()).then(setFaqs);
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      const perms = data.user?.permissions || [];
      setCanWrite(perms.includes('faq:write'));
      setCanDelete(perms.includes('faq:delete'));
    });
  }, []);

  const loadFaqs = () => fetch('/api/faq').then((r) => r.json()).then(setFaqs);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/faq/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ question: '', answer: '', category: '' });
    setEditing(null);
    setShowForm(false);
    loadFaqs();
  };

  const handleEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`/api/faq/${id}`, { method: 'DELETE' });
    loadFaqs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        {canWrite && (
          <button onClick={() => { setEditing(null); setForm({ question: '', answer: '', category: '' }); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Ordering, Shipping" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <input type="text" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
              <textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{faq.category}</span>
                <h3 className="mt-2 font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-1 text-sm text-gray-500">{faq.answer}</p>
              </div>
              {(canWrite || canDelete) && (
                <div className="flex items-center gap-2 ml-4">
                  {canWrite && (
                    <button onClick={() => handleEdit(faq)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
