import Link from 'next/link';
import { Map, Shield, Truck, Wrench } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';

const categories = [
  {
    id: 'tourism',
    label: 'Tourism & Sightseeing',
    description: 'Electric carts for resorts, theme parks, and scenic areas.',
    icon: Map,
    href: '/products?category=tourism',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'patrol',
    label: 'Security & Patrol',
    description: 'Patrol vehicles for communities, campuses, and industrial parks.',
    icon: Shield,
    href: '/products?category=patrol',
    color: 'bg-red-50 text-red-600',
  },
  {
    id: 'logistics',
    label: 'Logistics & Cargo',
    description: 'Electric vans for last-mile delivery and warehouse operations.',
    icon: Truck,
    href: '/products?category=logistics',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'utility',
    label: 'Utility & Maintenance',
    description: 'Versatile vehicles for facility management and services.',
    icon: Wrench,
    href: '/products?category=utility',
    color: 'bg-green-50 text-green-600',
  },
];

export default function ProductCategories() {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionTitle
          title="Vehicle Categories"
          subtitle="Explore our complete range of electric vehicles designed for specific applications."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
