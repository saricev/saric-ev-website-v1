import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Users, Globe, Factory } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CTASection from '@/components/home/CTASection';
import { company } from '@/data/company';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${company.name} - a leading low-speed electric vehicle manufacturer with ${company.exportCountries}+ export countries and ${company.factoryArea} factory.`,
  openGraph: {
    title: `About Us | ${company.name}`,
    description: `Learn about ${company.name} - a leading low-speed electric vehicle manufacturer with ${company.exportCountries}+ export countries.`,
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
};

const milestones = [
  { year: '2012', title: 'Founded', description: 'Saric established as an electric vehicle manufacturer.' },
  { year: '2015', title: 'First Export', description: 'Expanded to international markets, shipping to Southeast Asia.' },
  { year: '2017', title: 'CE Certification', description: 'Obtained CE certification for European market access.' },
  { year: '2019', title: 'Factory Expansion', description: 'Expanded factory to 50,000 m² with automated production lines.' },
  { year: '2021', title: '50+ Countries', description: 'Exported to over 50 countries across 6 continents.' },
  { year: '2024', title: 'Lithium Technology', description: 'Launched full lithium battery lineup for extended range.' },
];

const stats = [
  { icon: Factory, value: company.factoryArea, label: 'Factory Area' },
  { icon: Users, value: company.employees, label: 'Employees' },
  { icon: Globe, value: `${company.exportCountries}+`, label: 'Export Countries' },
  { icon: Award, value: 'ISO 9001', label: 'Quality Certified' },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-12 bg-gray-50">
        <Container>
          <Breadcrumb items={[{ label: 'About Us' }]} />

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider">About {company.name}</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                Leading the Future of Urban Mobility
              </h1>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Founded in {company.founded}, {company.name} has grown from a small workshop to a {company.factoryArea} manufacturing facility
                exporting to {company.exportCountries}+ countries. We specialize in low-speed electric vehicles for tourism, security,
                logistics, and utility applications.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Our mission is to provide reliable, eco-friendly electric vehicles that help businesses reduce operating costs
                while minimizing environmental impact. Every vehicle is built to international quality standards with CE,
                EPA, and DOT certifications.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
              <Image
                src="/images/about/factory.jpg"
                alt="Saric Factory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto" />
                  <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <SectionTitle
            title="Our Journey"
            subtitle="Key milestones in the Saric story."
          />
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex flex-col md:flex-row items-center gap-4 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <p className="text-primary font-bold text-lg">{milestone.year}</p>
                    <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-20 text-center">
            <SectionTitle
              title="Quality Certifications"
              subtitle="Our vehicles meet the highest international standards."
            />
            <div className="flex justify-center gap-8 flex-wrap">
              {['CE', 'EPA', 'DOT', 'ISO 9001:2015'].map((cert) => (
                <div key={cert} className="bg-white px-8 py-6 rounded-xl border border-gray-200 shadow-sm">
                  <Award className="w-10 h-10 text-primary mx-auto" />
                  <p className="mt-3 font-semibold text-gray-900">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
