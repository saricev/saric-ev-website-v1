import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProducts, saveProducts, deleteProduct } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'products:write');
    if ('error' in auth) return auth.error;

    const { slug } = await params;
    const data = await request.json();
    const products = await getProducts();
    const index = products.findIndex((p) => p.slug === slug);
    if (index === -1) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    products[index] = { ...products[index], ...data };
    await saveProducts(products);
    return NextResponse.json({ success: true, product: products[index] });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const auth = await requirePermission(request, 'products:delete');
    if ('error' in auth) return auth.error;

    const { slug } = await params;
    const success = await deleteProduct(slug);
    if (!success) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
