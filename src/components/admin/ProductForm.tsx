'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory } from '@/types';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [form, setForm] = useState({
    slug: product?.slug || '',
    name: product?.name || '',
    model: product?.model || '',
    category: (product?.category || 'tourism') as ProductCategory,
    tags: product?.tags.join(', ') || '',
    seats: product?.seats || 0,
    loadCapacity: product?.loadCapacity || 0,
    range: product?.range || 0,
    maxSpeed: product?.maxSpeed || 0,
    batteryType: product?.battery.type || 'Lead-Acid',
    batteryCapacity: product?.battery.capacity || '',
    batteryOptions: product?.battery.options.join(', ') || '',
    specs: product?.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
    certifications: product?.certifications.join(', ') || '',
    pdfPath: product?.pdfPath || '',
    description: product?.description || '',
    featured: product?.featured || false,
    sortOrder: product?.sortOrder || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData: Product = {
      slug: form.slug,
      name: form.name,
      model: form.model,
      category: form.category as Product['category'],
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      seats: Number(form.seats),
      loadCapacity: Number(form.loadCapacity),
      range: Number(form.range),
      maxSpeed: Number(form.maxSpeed),
      battery: {
        type: form.batteryType,
        capacity: form.batteryCapacity,
        options: form.batteryOptions.split(',').map((o) => o.trim()).filter(Boolean),
      },
      images,
      specs: Object.fromEntries(
        form.specs.split('\n').filter(Boolean).map((line) => {
          const [key, ...rest] = line.split(':');
          return [key.trim(), rest.join(':').trim()];
        })
      ),
      certifications: form.certifications.split(',').map((c) => c.trim()).filter(Boolean),
      pdfPath: form.pdfPath,
      description: form.description,
      featured: form.featured,
      sortOrder: Number(form.sortOrder),
    };

    try {
      const url = mode === 'create' ? '/api/products' : `/api/products/${product?.slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save product.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" disabled={mode === 'edit'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input type="text" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="tourism">Tourism</option>
            <option value="patrol">Patrol</option>
            <option value="logistics">Logistics</option>
            <option value="utility">Utility</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
          <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Range (km)</label>
          <input type="number" value={form.range} onChange={(e) => setForm({ ...form, range: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Speed (km/h)</label>
          <input type="number" value={form.maxSpeed} onChange={(e) => setForm({ ...form, maxSpeed: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Load Capacity (kg)</label>
          <input type="number" value={form.loadCapacity} onChange={(e) => setForm({ ...form, loadCapacity: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Battery Type</label>
          <input type="text" value={form.batteryType} onChange={(e) => setForm({ ...form, batteryType: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Battery Capacity</label>
          <input type="text" value={form.batteryCapacity} onChange={(e) => setForm({ ...form, batteryCapacity: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Battery Options (comma separated)</label>
          <input type="text" value={form.batteryOptions} onChange={(e) => setForm({ ...form, batteryOptions: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
        <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <ImageUploader
          value={images}
          onChange={setImages}
          folder="products"
          multiple={true}
          maxImages={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (one per line, format: Key: Value)</label>
        <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={6} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (comma separated)</label>
          <input type="text" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF Path</label>
          <input type="text" value={form.pdfPath} onChange={(e) => setForm({ ...form, pdfPath: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
