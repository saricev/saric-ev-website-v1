import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/data';
import { requirePermission } from '@/lib/permissions';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, 'products:write');
    if ('error' in auth) return auth.error;

    const data = await request.json();
    const products = await getProducts();

    if (products.find((p) => p.slug === data.slug)) {
      return NextResponse.json({ error: 'Slug already exists.' }, { status: 400 });
    }

    products.push(data);
    await saveProducts(products);
    return NextResponse.json({ success: true, product: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
