import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20" />

      <Container className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Professional EV Manufacturer Since 2012
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Low-Speed Electric Vehicles for{' '}
            <span className="text-primary">Every Purpose</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl">
            From sightseeing tours to security patrols, logistics to campus shuttles — Saric delivers
            reliable, eco-friendly electric vehicles to 60+ countries worldwide.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors group"
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
