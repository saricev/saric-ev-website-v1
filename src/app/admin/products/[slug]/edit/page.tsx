import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { getProductBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Product: {product.name}</h1>
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
