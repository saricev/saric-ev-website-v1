import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Electrify Your Fleet?
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Get a custom quote for your project. Our team will help you choose the right vehicles
          and configurations for your specific needs.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors group"
          >
            Get a Free Quote
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dealer"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Become a Dealer
          </Link>
        </div>
      </Container>
    </section>
  );
}
