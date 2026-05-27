import { Metadata } from 'next';
import { Globe, TrendingUp, Award, Headphones } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DealerForm from '@/components/forms/DealerForm';

export const metadata: Metadata = {
  title: 'Become a Dealer',
  description: 'Join Saric\'s global dealer network. Exclusive territory rights, marketing support, and competitive pricing for electric vehicle distributors.',
};

const benefits = [
  {
    icon: Globe,
    title: 'Exclusive Territory',
    description: 'Protected sales territory in your region to maximize your market potential.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    description: 'Attractive dealer margins and volume-based pricing tiers.',
  },
  {
    icon: Award,
    title: 'Marketing Support',
    description: 'Product photos, brochures, trade show support, and co-branding materials.',
  },
  {
    icon: Headphones,
    title: 'Technical Training',
    description: 'Comprehensive product training for your sales and service teams.',
  },
];

export default function DealerPage() {
  return (
    <>
      <section className="py-12 bg-gray-50">
        <Container>
          <Breadcrumb items={[{ label: 'Dealer Program' }]} />
          <SectionTitle
            title="Become a Saric Dealer"
            subtitle="Join our growing global network of authorized dealers and distributors."
            centered={false}
          />

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-16">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Application form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Dealer Application</h2>
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <DealerForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
