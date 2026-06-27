import { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ContactForm from '@/components/forms/ContactForm';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Saric for product inquiries, quotes, and dealer information.',
  openGraph: {
    title: 'Contact Us | Saric EV',
    description: 'Get in touch with Saric for product inquiries, quotes, and dealer information.',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Saric',
            url: 'https://saricev.com/contact',
            mainEntity: {
              '@type': 'Organization',
              name: company.name,
              telephone: company.phone,
              email: company.email,
              address: { '@type': 'PostalAddress', addressLocality: company.address },
            },
          }),
        }}
      />
      <Container>
        <Breadcrumb items={[{ label: 'Contact Us' }]} />
        <SectionTitle
          title="Get in Touch"
          subtitle="Have a question or ready to order? We'd love to hear from you."
          centered={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{company.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{company.phone}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium text-gray-900">{company.whatsapp}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{company.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send an Inquiry</h2>
              <ContactForm prefillProduct={params.product} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
