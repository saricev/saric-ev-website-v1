import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Download, MessageSquare } from 'lucide-react';
import Container from '@/components/layout/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import ProductGallery from '@/components/products/ProductGallery';
import ProductSpecs from '@/components/products/ProductSpecs';
import ProductConfig from '@/components/products/ProductConfig';
import { getProducts, getProductBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: `/products/${slug}`,
      images: product.images?.[0] ? [{ url: product.images[0], width: 1200, height: 800, alt: product.name }] : [],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images,
            brand: { '@type': 'Brand', name: 'Saric' },
            manufacturer: { '@type': 'Organization', name: 'Saric' },
            category: product.category,
            sku: product.slug,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'Organization', name: 'Saric' },
            },
          }),
        }}
      />
      <Container>
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary">{product.model}</Badge>
              <Badge>{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-bold text-primary">{product.seats}</p>
                <p className="text-xs text-gray-500 mt-1">Seats</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-bold text-primary">{product.range}</p>
                <p className="text-xs text-gray-500 mt-1">km Range</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-bold text-primary">{product.maxSpeed}</p>
                <p className="text-xs text-gray-500 mt-1">km/h Max</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-2xl font-bold text-primary">{product.loadCapacity}</p>
                <p className="text-xs text-gray-500 mt-1">kg Load</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?product=${product.slug}`}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Inquiry
              </Link>
              {product.pdfPath && (
                <a
                  href={product.pdfPath}
                  download
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
            <ProductSpecs specs={product.specs} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuration</h2>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <ProductConfig
                battery={product.battery}
                certifications={product.certifications}
                tags={product.tags}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/products"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </Container>
    </section>
  );
}
