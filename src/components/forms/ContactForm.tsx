'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { products } from '@/data/products';

const countryOptions = [
  { value: '', label: 'Select Country' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
  { value: 'AE', label: 'UAE' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'IN', label: 'India' },
  { value: 'TH', label: 'Thailand' },
  { value: 'PH', label: 'Philippines' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'OTHER', label: 'Other' },
];

export default function ContactForm({ prefillProduct }: { prefillProduct?: string }) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    interestedProducts: prefillProduct ? [prefillProduct] : [] as string[],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', company: '', email: '', phone: '', country: '', interestedProducts: [], message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-xl font-semibold text-gray-900">Thank You!</h3>
        <p className="mt-2 text-gray-600">We&apos;ve received your inquiry and will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full Name *"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Smith"
        />
        <Input
          label="Company Name"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Your Company Ltd."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Email *"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="john@example.com"
        />
        <Input
          label="Phone / WhatsApp"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+1 234 567 8900"
        />
      </div>
      <Select
        label="Country *"
        required
        options={countryOptions}
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interested Products</label>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => {
                setForm({
                  ...form,
                  interestedProducts: form.interestedProducts.includes(p.slug)
                    ? form.interestedProducts.filter((s) => s !== p.slug)
                    : [...form.interestedProducts, p.slug],
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                form.interestedProducts.includes(p.slug)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.model}
            </button>
          ))}
        </div>
      </div>
      <Textarea
        label="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell us about your requirements..."
      />
      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again or contact us directly.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  );
}
