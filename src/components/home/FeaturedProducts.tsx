import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Badge from '@/components/ui/Badge';
import { getOptimizedUrl } from '@/lib/cloudinary-utils';
import { Product } from '@/types';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionTitle
          title="Featured Products"
          subtitle="Our most popular electric vehicles, trusted by customers worldwide."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={getOptimizedUrl(product.images[0])}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{product.model}</Badge>
                  <Badge>{product.seats} Seats</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-600 gap-4">
                  <span>{product.range} km range</span>
                  <span>{product.maxSpeed} km/h</span>
                </div>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  View Details
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
