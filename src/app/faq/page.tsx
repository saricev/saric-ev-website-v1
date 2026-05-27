import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Accordion from '@/components/faq/Accordion';
import { getFaqs } from '@/lib/data';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Saric electric vehicles, ordering, shipping, warranty, and dealer programs.',
};

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        <Breadcrumb items={[{ label: 'FAQ' }]} />
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our products and services."
          centered={false}
        />
        <div className="max-w-3xl">
          <Accordion items={faqs} />
        </div>
      </Container>
    </section>
  );
}
