'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types';
import ImageUploader from './ImageUploader';

interface BlogFormProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

export default function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: post?.slug || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image: post?.image || '',
    author: post?.author || 'Saric Team',
    date: post?.date || new Date().toISOString().split('T')[0],
    tags: post?.tags.join(', ') || '',
    readTime: post?.readTime || 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData: BlogPost = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    const url = mode === 'create' ? '/api/blog' : `/api/blog/${post?.slug}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    if (res.ok) router.push('/admin/blog');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" disabled={mode === 'edit'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={15} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
        <ImageUploader
          value={form.image ? [form.image] : []}
          onChange={(urls) => setForm({ ...form, image: urls[0] || '' })}
          folder="blog"
          multiple={false}
          maxImages={1}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (min)</label>
          <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
        <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
        </button>
        <button type="button" onClick={() => router.push('/admin/blog')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
