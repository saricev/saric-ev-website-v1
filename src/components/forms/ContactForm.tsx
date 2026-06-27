'use client';

import { useState, useCallback } from 'react';
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

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const initialForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  interestedProducts: [] as string[],
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!form.country) errors.country = 'Please select a country';
  return errors;
}

export default function ContactForm({ prefillProduct }: { prefillProduct?: string }) {
  const [form, setForm] = useState({
    ...initialForm,
    interestedProducts: prefillProduct ? [prefillProduct] : [] as string[],
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
  }, [form]);

  const handleChange = useCallback((field: keyof typeof initialForm, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    // Clear error on edit if field was touched
    if (touched[field]) {
      const fieldErrors = validate(next);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  }, [form, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, country: true });
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ ...initialForm, interestedProducts: [] });
        setErrors({});
        setTouched({});
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="contact-name"
          label="Full Name *"
          required
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          placeholder="John Smith"
        />
        <Input
          id="contact-company"
          label="Company Name"
          value={form.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Your Company Ltd."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="contact-email"
          label="Email *"
          type="email"
          required
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          placeholder="john@example.com"
        />
        <Input
          id="contact-phone"
          label="Phone / WhatsApp"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </div>
      <Select
        id="contact-country"
        label="Country *"
        required
        options={countryOptions}
        value={form.country}
        onChange={(e) => handleChange('country', e.target.value)}
        onBlur={() => handleBlur('country')}
        error={touched.country ? errors.country : undefined}
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
              aria-pressed={form.interestedProducts.includes(p.slug)}
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
        id="contact-message"
        label="Message"
        value={form.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Tell us about your requirements..."
      />
      <div aria-live="polite" className="sr-only">
        {status === 'error' && 'Submission failed. Please try again.'}
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again or contact us directly.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  );
}
