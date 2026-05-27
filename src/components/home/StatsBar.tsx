import Container from '@/components/layout/Container';
import { company } from '@/data/company';

const stats = [
  { value: `${company.founded}`, label: 'Founded', suffix: '' },
  { value: `${company.exportCountries}+`, label: 'Export Countries', suffix: '' },
  { value: `${company.annualOutput}`, label: 'Units / Year', suffix: '' },
  { value: `${company.factoryArea}`, label: 'Factory Area', suffix: '' },
];

export default function StatsBar() {
  return (
    <section className="bg-primary text-white py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
