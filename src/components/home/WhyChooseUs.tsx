import { Award, Truck, Headphones, Settings } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';

const reasons = [
  {
    icon: Award,
    title: 'Certified Quality',
    description: 'CE, EPA, and DOT certified vehicles manufactured under ISO 9001:2015 quality management.',
  },
  {
    icon: Settings,
    title: 'OEM/ODM Capability',
    description: 'Full customization from colors and branding to complete vehicle design modifications.',
  },
  {
    icon: Truck,
    title: 'Global Shipping',
    description: 'Reliable sea freight from Shanghai/Ningbo with complete export documentation support.',
  },
  {
    icon: Headphones,
    title: 'After-Sales Support',
    description: '24/7 online support, spare parts supply, video tutorials, and optional on-site training.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionTitle
          title="Why Choose Saric"
          subtitle="We deliver more than vehicles — we deliver complete solutions."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
