import { Suspense } from 'react';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore our complete range of low-speed electric vehicles for tourism, patrol, logistics, and utility applications.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <Container>
        <Breadcrumb items={[{ label: 'Products' }]} />
        <SectionTitle
          title="Our Products"
          subtitle="Explore our complete range of low-speed electric vehicles for every application."
          centered={false}
        />
        <Suspense fallback={<div className="h-16 bg-gray-100 rounded-lg animate-pulse mb-8" />}>
          <ProductsClient products={products} />
        </Suspense>
      </Container>
    </section>
  );
}
