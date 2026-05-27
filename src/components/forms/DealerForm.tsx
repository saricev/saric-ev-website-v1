'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const volumeOptions = [
  { value: '', label: 'Select Expected Volume' },
  { value: '1-10', label: '1-10 units / year' },
  { value: '10-50', label: '10-50 units / year' },
  { value: '50-100', label: '50-100 units / year' },
  { value: '100+', label: '100+ units / year' },
];

export default function DealerForm() {
  const [form, setForm] = useState({
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    existingBusiness: '',
    annualVolume: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ company: '', contactPerson: '', email: '', phone: '', country: '', existingBusiness: '', annualVolume: '', message: '' });
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
        <h3 className="text-xl font-semibold text-gray-900">Application Submitted!</h3>
        <p className="mt-2 text-gray-600">Thank you for your interest. Our team will review your application and contact you within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Company Name *"
          required
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Your Company Ltd."
        />
        <Input
          label="Contact Person *"
          required
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          placeholder="John Smith"
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
      <Input
        label="Country *"
        required
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
        placeholder="United States"
      />
      <Input
        label="Existing Business Description"
        value={form.existingBusiness}
        onChange={(e) => setForm({ ...form, existingBusiness: e.target.value })}
        placeholder="e.g., Golf course equipment supplier, auto dealership..."
      />
      <Select
        label="Expected Annual Purchase Volume"
        options={volumeOptions}
        value={form.annualVolume}
        onChange={(e) => setForm({ ...form, annualVolume: e.target.value })}
      />
      <Textarea
        label="Additional Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell us about your market and goals..."
      />
      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
