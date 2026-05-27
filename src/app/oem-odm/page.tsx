import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'OEM/ODM Services',
  description: 'Full OEM/ODM customization services for electric vehicles. Custom colors, branding, configurations, and complete vehicle design.',
};

const customizations = [
  {
    title: 'Exterior Design',
    items: ['Custom paint colors', 'Logo & branding placement', 'Body style modifications', 'Canopy design options'],
  },
  {
    title: 'Interior Configuration',
    items: ['Seat material & color', 'Seat layout changes', 'Dashboard customization', 'Storage solutions'],
  },
  {
    title: 'Performance Upgrades',
    items: ['Battery capacity options', 'Motor power upgrades', 'Speed limiter settings', 'Suspension tuning'],
  },
  {
    title: 'Accessories & Features',
    items: ['Audio system integration', 'GPS tracking system', 'LED lighting packages', 'Safety equipment'],
  },
];

const processSteps = [
  { step: '01', title: 'Consultation', description: 'Share your requirements and vision with our sales team.' },
  { step: '02', title: 'Design Proposal', description: 'Our R&D team creates a detailed design and quotation.' },
  { step: '03', title: 'Sample Production', description: 'We produce a prototype for your review and approval.' },
  { step: '04', title: 'Mass Production', description: 'After approval, we begin full production with QC inspections.' },
  { step: '05', title: 'Shipping & Support', description: 'Export documentation, shipping arrangement, and after-sales support.' },
];

export default function OemOdmPage() {
  return (
    <>
      <section className="py-12 bg-gray-50">
        <Container>
          <Breadcrumb items={[{ label: 'OEM/ODM' }]} />
          <SectionTitle
            title="OEM/ODM Customization"
            subtitle="We bring your vision to life with comprehensive customization services."
            centered={false}
          />

          {/* Customization options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {customizations.map((section) => (
              <div key={section.title} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Process */}
          <div className="mt-20">
            <SectionTitle
              title="Our Process"
              subtitle="From concept to delivery, we guide you through every step."
            />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                    {step.step}
                  </div>
                  <h4 className="mt-4 font-semibold text-gray-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-primary text-white rounded-2xl p-12">
            <h2 className="text-2xl font-bold">Ready to Start Your Custom Project?</h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Contact our OEM/ODM team to discuss your requirements and get a custom quotation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
