import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SolutionCard from '@/components/solutions/SolutionCard';
import CTASection from '@/components/home/CTASection';
import { getSolutions } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Explore our electric vehicle solutions for tourism, security, logistics, and resort shuttle applications.',
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <>
      <section className="py-12 bg-gray-50">
        <Container>
          <Breadcrumb items={[{ label: 'Solutions' }]} />
          <SectionTitle
            title="Solutions for Every Need"
            subtitle="Our electric vehicles serve a wide range of industries and applications."
            centered={false}
          />
          <div className="space-y-20">
            {solutions.map((solution, index) => (
              <SolutionCard
                key={solution.slug}
                solution={solution}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
