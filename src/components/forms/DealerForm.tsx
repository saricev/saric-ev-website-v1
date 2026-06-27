'use client';

import { useState, useCallback } from 'react';
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

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const initialForm = {
  company: '',
  contactPerson: '',
  email: '',
  phone: '',
  country: '',
  existingBusiness: '',
  annualVolume: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.company.trim()) errors.company = 'Company name is required';
  if (!form.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!form.country.trim()) errors.country = 'Country is required';
  return errors;
}

export default function DealerForm() {
  const [form, setForm] = useState(initialForm);
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
    if (touched[field]) {
      const fieldErrors = validate(next);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  }, [form, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ company: true, contactPerson: true, email: true, country: true });
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm(initialForm);
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
        <h3 className="text-xl font-semibold text-gray-900">Application Submitted!</h3>
        <p className="mt-2 text-gray-600">Thank you for your interest. Our team will review your application and contact you within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="dealer-company"
          label="Company Name *"
          required
          value={form.company}
          onChange={(e) => handleChange('company', e.target.value)}
          onBlur={() => handleBlur('company')}
          error={touched.company ? errors.company : undefined}
          placeholder="Your Company Ltd."
        />
        <Input
          id="dealer-contact"
          label="Contact Person *"
          required
          value={form.contactPerson}
          onChange={(e) => handleChange('contactPerson', e.target.value)}
          onBlur={() => handleBlur('contactPerson')}
          error={touched.contactPerson ? errors.contactPerson : undefined}
          placeholder="John Smith"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="dealer-email"
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
          id="dealer-phone"
          label="Phone / WhatsApp"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </div>
      <Input
        id="dealer-country"
        label="Country *"
        required
        value={form.country}
        onChange={(e) => handleChange('country', e.target.value)}
        onBlur={() => handleBlur('country')}
        error={touched.country ? errors.country : undefined}
        placeholder="United States"
      />
      <Input
        id="dealer-business"
        label="Existing Business Description"
        value={form.existingBusiness}
        onChange={(e) => handleChange('existingBusiness', e.target.value)}
        placeholder="e.g., Golf course equipment supplier, auto dealership..."
      />
      <Select
        id="dealer-volume"
        label="Expected Annual Purchase Volume"
        options={volumeOptions}
        value={form.annualVolume}
        onChange={(e) => handleChange('annualVolume', e.target.value)}
      />
      <Textarea
        id="dealer-message"
        label="Additional Message"
        value={form.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Tell us about your market and goals..."
      />
      <div aria-live="polite" className="sr-only">
        {status === 'error' && 'Submission failed. Please try again.'}
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
